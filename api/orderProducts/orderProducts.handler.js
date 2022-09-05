const crud = require("../../crud/index");

const tableOrderProducts = "OrderProducts";
const tableOrders = "Orders";
const statusAberto = "Aberto";

async function getOrderProducts() {
    return await crud.get(tableOrderProducts);
}

async function getOrderProduct(id) {
    const orderProduct = await crud.getById(tableOrderProducts, id)
        .then((orderProduct) => {
            return orderProduct;
        }).catch(() => {
            return {
                error: "0004",
                message: "ID de pedido inválido!",
                invalidId: id
            }
        })

    return orderProduct;
}

async function addOrderProduct(products) {
    let errorHasOcured = false;

    if (Array.isArray(products)) {
        for (let product of products) {
            message = await saveOrderProduct(product);

            if (message.error) {
                errorHasOcured = true;
            }
        }
    } else {
        message = await saveOrderProduct(products);
    }

    if (!message.error || !errorHasOcured) {
        message = { message: `Produto(s) adicionado(s) ao pedido com sucesso!` };
    }

    return message;
}

async function saveOrderProduct(orderProduct) {
    if (invalidOrderProduct(orderProduct))
        return {
            error: "0001",
            message: "É necessário preencher os campos necessários!",
            requiredFields: ["productId", "quantity", "orderId"]
        }

    if (await invalidProductId(orderProduct.productId))
        return {
            error: "0003",
            message: "ID de produto inválido!"
        }

    if (await orderIsClosed(orderProduct.orderId))
        return {
            error: "0005",
            message: "Pedido está fechado!",
            orderId: orderProduct.orderId
        }

    let savedOrderProduct;

    if (await orderHasProduct(orderProduct)) {
        savedOrderProduct = await updateQuantityProduct(orderProduct);
    } else {
        savedOrderProduct = await crud.save(tableOrderProducts, undefined, orderProduct);
    }

    return savedOrderProduct;
}

async function updateOrderProduct(id, orderProduct) {
    if (invalidOrder(orderProduct) && !orderProduct.orderId)
        return {
            error: "0001",
            message: "É necessário preencher os campos necessários!",
            requiredFields: ["productId", "quantity", "orderId"]
        }

    if (await invalidId(id))
        return {
            error: "0003",
            message: "ID inválido!",
            invalidId: id
        }

    if (await orderIsClosed(orderProduct.orderId))
        return {
            error: "0005",
            message: "Pedido está fechado!",
            orderId: orderProduct.orderId
        }

    const newOrderProduct = await crud.save(tableOrderProducts, id, orderProduct);

    if (newOrderProduct.quantity <= 0)
        await deleteOrderProduct(newOrderProduct.id);

    return newOrderProduct;
}

async function deleteProducts(productsList) {
    let errorHasOcured = false;

    if (Array.isArray(productsList)) {
        for (let product of productsList) {
            message = await removeProduct(product);

            if (message.error) {
                errorHasOcured = true;
            }
        }
    } else {
        message = await removeProduct(productsList);
    }

    if (!message.error || !errorHasOcured) {
        message = { message: `Produto(s) removido(s) do pedido com sucesso!` };
    }

    return message;
}

async function deleteOrderProduct(id) {
    if (await invalidId(id))
        return {
            error: "0003",
            message: "ID inválido!",
            invalidId: id
        }

    const deletedOrderProduct = await crud.remove(tableOrderProducts, id);

    return deletedOrderProduct;
}

async function removeProduct(oldProduct) {
    const products = await crud.getWithFilter(tableOrderProducts, "==", "productId", oldProduct.productId);

    let id;
    for (let product of products) {
        if (product.productId == oldProduct.productId) {
            product.quantity -= oldProduct.quantity;
            id = product.id;
            delete product.id;

            if (product.quantity <= 0) {
                return await deleteOrderProduct(id);
            } else {
                return await crud.save(tableOrderProducts, id, product);
            }
        }
    }
}

function invalidOrderProduct(orderProduct) {
    if (orderProduct.productId && orderProduct.quantity && orderProduct.orderId &&
        Object.keys(orderProduct).length == 3)
        return false;
    return true;
}

async function invalidId(id) {
    const order = await crud.getById(tableOrderProducts, id)
        .then(() => {
            return false;
        })
        .catch(() => {
            return true;
        });

    return order;
}

async function invalidProductId(productId) {
    let invalidProduct = true;

    try {
        await crud.getById(tableProducts, productId)
    } catch (error) {
        invalidProduct = false;
    }

    return invalidProduct;
}

async function orderIsClosed(orderId) {
    const order = await crud.getById(tableOrders, orderId);
    if (order.status == statusAberto)
        return false;
    return true;
}

async function orderHasProduct(orderProduct) {
    const orderProducts = await crud.getWithFilter(tableOrderProducts, "==", "orderId", orderProduct.orderId);

    for (let orderProductFiltered of orderProducts) {
        if (orderProductFiltered.productId == orderProduct.productId) {
            return true;
        }
    }

    return false;
}

async function updateQuantityProduct(orderProduct) {
    const productsFiltered = await crud.getWithFilter(tableOrderProducts, "==", "orderId", orderProduct.orderId);
    
    let id;
    for (let product of productsFiltered) {
        if (product.productId == orderProduct.productId) {
            product.quantity += orderProduct.quantity;
            id = product.id;
            delete product.id;

            return await crud.save(tableOrderProducts, id, product);
        }
    }
}

module.exports = {
    getOrderProducts,
    getOrderProduct,
    addOrderProduct,
    saveOrderProduct,
    updateOrderProduct,
    deleteProducts,
    deleteOrderProduct
}