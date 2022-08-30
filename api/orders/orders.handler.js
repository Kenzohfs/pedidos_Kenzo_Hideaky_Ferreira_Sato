const crud = require("../../crud/index");
const OrderProductsHandler = require("../orderProducts/orderProducts.handler")

const tableOrders = "Orders";
const tableUsers = "Users";
const tableProducts = "Products";
const statusAberto = "Aberto";

async function getOrders() {
    return await crud.get(tableOrders);
}

async function getOrder(id) {
    const order = await crud.getById(tableOrders, id)
        .then((order) => {
            return order;
        }).catch(() => {
            return {
                error: "0004",
                message: "ID de pedido inválido!",
                invalidId: id
            }
        })

    return order;
}

async function saveOrder(order) {
    if (await invalidOrder(order))
        return {
            error: "0001",
            message: "É necessário preencher os campos necessários!",
            requiredFields: ["userId", "status", "products"]
        }

    if (await invalidProductsList(order.productsList))
        return {
            error: "0001",
            message: "É necessário preencher os campos necessários da lista de produtos!",
            requiredFields: ["productId", "quantidade"]
        }

    if (await invalidProductsId(order.productsList))
        return {
            error: "0003",
            message: "ID de produto inválido!"
        }

    if (await invalidUser(order.userId))
        return {
            error: "0004",
            message: "Id de usuário inválido!",
            userId: order.userId
        }

    if (await userHasOpenOrder(order.userId))
        return {
            error: "0005",
            message: "Usuário já possui um pedido em aberto!",
            userId: order.userId
        }

    order.number = await addNumberOrder(order.userId);

    const productsList = order.products;
    delete order.products;

    const savedOrder = await crud.save(tableOrders, undefined, order);

    for (let product of productsList) {
        await OrderProductsHandler.saveOrderProduct({ ...product, orderId: savedOrder.id });
    }

    return savedOrder;
}

async function updateOrder(id, order) {
    if (!(order.status && Object.keys(order).length == 1))
        return {
            error: "0001",
            message: "É necessário preencher os campos necessários!",
            requiredFields: ["status"]
        }

    if (await invalidId(id))
        return {
            error: "0003",
            message: "ID inválido!",
            invalidId: id
        }

    const oldOrder = await crud.getById(tableOrders, id);
    delete oldOrder.status;
    const newOrder = await crud.save(tableOrders, id, { ...oldOrder, status: order.status });

    return newOrder;
}

async function deleteOrder(id) {
    if (await invalidId(id))
        return {
            error: "0003",
            message: "ID inválido!",
            invalidId: id
        }

    const deletedProduct = await crud.remove(tableOrders, id);

    return deletedProduct;
}

async function invalidOrder(order) {
    if (order.userId && order.status && order.products &&
        Object.keys(order).length == 3)
        return false;
    return true;
}

async function invalidId(id) {
    const order = await crud.getById(tableOrders, id)
        .then(() => {
            return false;
        })
        .catch(() => {
            return true;
        });

    return order;
}

async function invalidUser(id) {
    const user = await crud.getById(tableUsers, id)
        .then(() => {
            return false;
        })
        .catch(() => {
            return true;
        });

    return user;
}

async function userHasOpenOrder(id) {
    const ordersList = await crud.getWithFilter(tableOrders, "==", "userId", id);

    for (let order of ordersList)
        if (order.status == statusAberto)
            return true;

    return false;
}

async function invalidProductsList(list) {
    for (let item of list)
        if (
            !(item.hasOwnProperty("productId") && item.hasOwnProperty("quantity"))
            && Object.keys(item).length != 2
        )
            return true;

    return false;
}

async function invalidProductsId(list) {
    for (let item of list) {
        const invalidProduct = await crud.getById(tableProducts, item.productId)
            .then(() => {
                return false;
            })
            .catch(() => {
                return true;
            });

        if (invalidProduct) {
            return true;
        }
    }
}

async function addNumberOrder(userId) {
    const orders = await crud.getWithFilter(tableOrders, "==", "userId", userId);

    return (orders.length + 1);
}

module.exports = {
    getOrders,
    getOrder,
    saveOrder,
    updateOrder,
    deleteOrder
}