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

    let savedOrderProduct;

    // if (await orderHasProduct(orderProduct)) {
    //     await updateQuantityProduct(orderProduct);
    // } else {
    savedOrderProduct = await crud.save(tableOrderProducts, undefined, orderProduct);
    // }

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
    
    try  {
        await crud.getById(tableProducts, productId)
    } catch (error) {
        console.log("Entrou catch");
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
}

async function updateQuantityProduct(orderProduct) {
    const orderProductFiltered = await crud.getWithFilter(tableOrderProducts, "==", "productId", orderProduct.productId);

    for (let orderProductFiltered of orderProductFiltered) {
        if (orderProductFiltered.productId == orderProduct.productId) {
            return true;
        }
    }
}

module.exports = {
    getOrderProducts,
    getOrderProduct,
    saveOrderProduct,
    updateOrderProduct,
    deleteOrderProduct
}