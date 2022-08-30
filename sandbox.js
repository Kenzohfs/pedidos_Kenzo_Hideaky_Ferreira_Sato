const crud = require("./crud/index");

async function save() {
    await crud.save("Users", undefined, { cpf: "123", name: "Kenzo", surname: "Sato" });
}

save();