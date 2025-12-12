import { db } from "../../utils/firebase";
import { collection, getDocs, addDoc, query } from "firebase/firestore";

export async function getKanji() {

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
        let itemList = [];
        querySnapshot.forEach((doc) => {
            let thisItem = {
                id: doc.id,
                ...doc.data()
            }
            itemList.push(thisItem.character);
        });
        setParticleArray(itemList);
    } catch (error) {
        console.log(error);
    }
}

export async function getSentences() {

}

export async function addKanji() {

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

export async function addSentences() {

}