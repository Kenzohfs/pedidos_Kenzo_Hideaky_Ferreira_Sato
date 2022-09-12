const { initializeApp } = require('firebase/app');
const {
    getFirestore,
    collection,
    doc,
    setDoc,
    addDoc,
    query,
    where,
    getDocs,
    getDoc,
    deleteDoc
} = require("firebase/firestore/lite");

const firebaseConfig = {
    apiKey: "AIzaSyBco3RJekF7DsJS5TxnD-Ay2OlJfto3dm4",
    authDomain: "pedidos-kenzo-sato.firebaseapp.com",
    projectId: "pedidos-kenzo-sato",
    storageBucket: "pedidos-kenzo-sato.appspot.com",
    messagingSenderId: "1738317266",
    appId: "1:1738317266:web:18afe4115ddc6fc313fc0b",
    measurementId: "G-ND7343C2JG"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore();

async function save(nomeTabela, id, dado) {
    if (id) {
        const referencedEntity = await setDoc(doc(db, nomeTabela, id), dado);
        const savedData = {
            ...dado,
            id: id
        }
        return savedData;
    } else {
        const referencedEntity = await addDoc(collection(db, nomeTabela), dado);
        const savedData = {
            ...dado,
            id: referencedEntity.id
        }
        return savedData;
    }
}

async function get(nomeTabela) {
    const tableRef = collection(db, nomeTabela);

    const q = query(tableRef);

    const querySnapshot = await getDocs(q);

    const lista = [];

    querySnapshot.forEach((doc) => {
        const data = {
            ...doc.data(),
            id: doc.id
        }
        lista.push(data);
    })

    return lista;
}

async function getById(nomeTabela, id) {
    const docRef = doc(db, nomeTabela, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return docSnap.data();
    } else {
        throw new Error("Not found!");
    }
}

async function remove(nomeTabela, id) {
    const dado = await deleteDoc(doc(db, nomeTabela, id));
    return {
        message: `${id} deleted!`
    }
}

async function getWithFilter(nomeTabela, operador, nomeDado, dado) {
    const tableRef = collection(db, nomeTabela);
    const q = query(tableRef, where(nomeDado, operador, dado));
    const data = await getDocs(q)

    const lista = [];

    data.forEach((doc) => {
        const data = {
            ...doc.data(),
            id: doc.id
        }
        lista.push(data);
    })

    return lista;
}

module.exports = {
    save,
    get,
    getById,
    getWithFilter,
    remove
}