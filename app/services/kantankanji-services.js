import { db } from "../../utils/firebase";
import { collection, getDocs, addDoc, query, where } from "firebase/firestore";

export async function getKanji() {
    try {
        const getItemsReference = collection(db, "kanji");
        const getItemsQuery = query(getItemsReference);
        const querySnapshot = await getDocs(getItemsQuery);
        return querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
        }));
    } catch (error) {
        console.log(error);
        return [];
    }
}

export async function getKana(setKanaArray) {
    try {
        const getItemsReference = collection(db, "kana");
        const getItemsQuery = query(getItemsReference);
        const querySnapshot = await getDocs(getItemsQuery);
        let itemList = [];
        querySnapshot.forEach((doc) => {
            let thisItem = {
                id: doc.id,
                ...doc.data()
            }
            itemList.push(thisItem);
        });
        setKanaArray(itemList);
    } catch (error) {
        console.log(error);
    }
}

export async function getParticles(setParticleArray) {
    try {
        const getItemsReference = collection(db, "particles");
        const getItemsQuery = query(getItemsReference);
        const querySnapshot = await getDocs(getItemsQuery);
        let itemArray = [];
        querySnapshot.forEach((doc) => {
            let thisItem = {
            id: doc.id,
            ...doc.data()
            }
            itemArray.push(thisItem.character);
        });
        setParticleArray(itemArray)
    } catch (error) {
        console.log(error);
    }
}

export async function getSentences() {
    try {
        const getItemsReference = collection(db, "grammar");
        const getItemsQuery = query(getItemsReference, where("verb","!=",null));
        const querySnapshot = await getDocs(getItemsQuery);
        return querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
        }));
    } catch (error) {
        console.log(error);
        return [];
    }
}

export async function getNotNullSentences() {
    try {
        const getItemsReference = collection(db, "grammar");
        const getItemsQuery = query(getItemsReference, where("particle","!=",null));
        const querySnapshot = await getDocs(getItemsQuery);
        return querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
        }));
    } catch (error) {
        console.log(error);
        return [];
    }
}


export async function addKanji(kanji) {
    try {
        const addItemsReference = collection(db, "kanji");
        kanji.forEach(async (kana) => {
            await addDoc(addItemsReference, kana);
        })
    } catch (error) {
        console.log(error);
    }
}

export async function addKana(kanas) {
    try {
        const addItemsReference = collection(db, "kana");
        kanas.forEach(async (kana) => {
            await addDoc(addItemsReference, kana);
        })
    } catch (error) {
        console.log(error);
    }
}

export async function addParticles(particles) {
    try {
        const addItemsReference = collection(db, "particles");
        particles.forEach(async (particle) => {
            await addDoc(addItemsReference, particle);
        })
    } catch (error) {
        console.log(error);
    }
}

export async function addSentences(grammar) {
    try {
        const addItemsReference = collection(db, "grammar");
        grammar.forEach(async (sentence) => {
            await addDoc(addItemsReference, sentence);
        })
    } catch (error) {
        console.log(error);
    }
}