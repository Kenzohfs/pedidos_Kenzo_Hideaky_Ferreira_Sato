const crud = require("../../crud/index");

const tableProducts = "Products";

async function getProducts() {
    return await crud.get(tableProducts);
}

async function getProduct(id) {
    const product = await crud.getById(tableProducts, id)
        .then((product) => {
            return product;
        }).catch(() => {
            return {
                error: "0004",
                message: "ID de produto inválido!",
                invalidId: id
            }
        })

    return product;
}

async function saveProduct(product) {
    if (invalidProduct(product))
        return {
            error: "0001",
            message: "É necessário preencher os campos necessários!",
            requiredFields: ["name", "price"]
        }

    const savedProduct = await crud.save(tableProducts, undefined, product);

    return savedProduct;
}

async function updateProduct(id, product) {
    if (invalidProduct(product))
        return {
            error: "0001",
            message: "É necessário preencher os campos necessários!",
            requiredFields: ["name", "price"]
        }

    if (await invalidId(id))
        return {
            error: "0003",
            message: "ID inválido!",
            invalidId: id
        }

    const newProduct = await crud.save(tableProducts, id, product);

    return newProduct;
}

async function deleteProduct(id) {
    if (await invalidId(id))
        return {
            error: "0003",
            message: "ID inválido!",
            invalidId: id
        }

    const deletedProduct = await crud.remove(tableProducts, id);

    return deletedProduct;
}

function invalidProduct(product) {
    if (product.name && product.price &&
        Object.keys(product).length == 2)
        return false;
    return true;
}

async function invalidId(id) {
    const product = await crud.getById(tableProducts, id)
        .then(() => {
            return false;
        })
        .catch(() => {
            return true;
        });

    return product;
}

module.exports = {
    getProducts,
    getProduct,
    saveProduct,
    updateProduct,
    deleteProduct
}