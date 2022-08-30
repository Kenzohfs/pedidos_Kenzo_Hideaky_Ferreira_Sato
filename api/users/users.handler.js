const crud = require("../../crud/index");

const tableUsers = "Users";

async function getUsers() {
    return await crud.get(tableUsers);
}

async function getUser(id) {
    const user = await crud.getById(tableUsers, id)
        .then((user) => {
            return user;
        }).catch(() => {
            return {
                error: "0004",
                message: "ID de user inválido!",
                invalidId: id
            }
        })

    return user;
}

async function saveUser(user) {
    if (invalidUser(user))
        return {
            error: "0001",
            message: "É necessário preencher os campos necessários!",
            requiredFields: ["cpf", "name", "surname"]
        }

    if (await invalidCpf(user.cpf))
        return {
            error: "0002",
            message: "É necessário que o usuário possua um CPF válido!",
            invalidCpf: user.cpf
        }

    const savedUser = await crud.save(tableUsers, undefined, user);

    return savedUser;
}

async function updateUser(id, user) {
    if (invalidUser(user))
        return {
            error: "0001",
            message: "É necessário preencher os campos necessários!",
            requiredFields: ["cpf", "name", "surname"]
        }

    if (await invalidId(id))
        return {
            error: "0003",
            message: "ID inválido!",
            invalidId: id
        }

    const newUser = await crud.save(tableUsers, id, user);

    return newUser;
}

async function deleteUser(id) {
    if (await invalidId(id))
        return {
            error: "0003",
            message: "ID inválido!",
            invalidId: id
        }

    const deletedUser = await crud.remove(tableUsers, id);

    return deletedUser;
}

function invalidUser(user) {
    if (user.cpf && user.name && user.surname &&
        Object.keys(user).length == 3)
        return false;
    return true;
}

async function invalidCpf(cpf) {
    const user = await crud.getWithFilter(tableUsers, "==", "cpf", cpf);

    if (user.length == 0)
        return false;
    return true;
}

async function invalidId(id) {
    const user = await crud.getById(tableUsers, id)
        .then(() => {
            return false;
        })
        .catch(() => {
            return true;
        });

    return user;
}

module.exports = {
    getUsers,
    getUser,
    saveUser,
    updateUser,
    deleteUser
}