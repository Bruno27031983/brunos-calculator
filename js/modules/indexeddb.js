/**
 * Modul pre prácu s IndexedDB
 * Poskytuje sekundárne úložisko s väčšou kapacitou ako localStorage
 */

const DB_NAME = 'BrunosCalculatorDB';
const DB_VERSION = 1;
const STORE_NAME = 'workData';

let db = null;

/**
 * Inicializuje IndexedDB databázu
 */
export function initDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = () => {
            console.error('Chyba pri otváraní IndexedDB:', request.error);
            reject(request.error);
        };

        request.onsuccess = () => {
            db = request.result;
            console.log('IndexedDB úspešne inicializovaná');
            resolve(db);
        };

        request.onupgradeneeded = (event) => {
            db = event.target.result;

            // Vytvorenie object store ak neexistuje
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                const objectStore = db.createObjectStore(STORE_NAME, { keyPath: 'key' });
                objectStore.createIndex('timestamp', 'timestamp', { unique: false });
                console.log('Object store vytvorený');
            }
        };
    });
}

/**
 * Uloží dáta do IndexedDB
 */
export async function saveToIndexedDB(key, value) {
    try {
        if (!db) {
            await initDB();
        }

        return new Promise((resolve, reject) => {
            const transaction = db.transaction([STORE_NAME], 'readwrite');
            const objectStore = transaction.objectStore(STORE_NAME);

            const data = {
                key: key,
                value: value,
                timestamp: new Date().toISOString()
            };

            const request = objectStore.put(data);

            request.onsuccess = () => {
                console.log(`Dáta uložené do IndexedDB pod kľúčom: ${key}`);
                resolve(true);
            };

            request.onerror = () => {
                console.error('Chyba pri ukladaní do IndexedDB:', request.error);
                reject(request.error);
            };
        });
    } catch (error) {
        console.error('Chyba v saveToIndexedDB:', error);
        return false;
    }
}

/**
 * Načíta dáta z IndexedDB
 */
export async function loadFromIndexedDB(key) {
    try {
        if (!db) {
            await initDB();
        }

        return new Promise((resolve, reject) => {
            const transaction = db.transaction([STORE_NAME], 'readonly');
            const objectStore = transaction.objectStore(STORE_NAME);
            const request = objectStore.get(key);

            request.onsuccess = () => {
                if (request.result) {
                    console.log(`Dáta načítané z IndexedDB: ${key}`);
                    resolve(request.result.value);
                } else {
                    console.log(`Žiadne dáta pre kľúč: ${key}`);
                    resolve(null);
                }
            };

            request.onerror = () => {
                console.error('Chyba pri načítavaní z IndexedDB:', request.error);
                reject(request.error);
            };
        });
    } catch (error) {
        console.error('Chyba v loadFromIndexedDB:', error);
        return null;
    }
}

/**
 * Vymaže dáta z IndexedDB
 */
export async function deleteFromIndexedDB(key) {
    try {
        if (!db) {
            await initDB();
        }

        return new Promise((resolve, reject) => {
            const transaction = db.transaction([STORE_NAME], 'readwrite');
            const objectStore = transaction.objectStore(STORE_NAME);
            const request = objectStore.delete(key);

            request.onsuccess = () => {
                console.log(`Dáta vymazané z IndexedDB: ${key}`);
                resolve(true);
            };

            request.onerror = () => {
                console.error('Chyba pri vymazávaní z IndexedDB:', request.error);
                reject(request.error);
            };
        });
    } catch (error) {
        console.error('Chyba v deleteFromIndexedDB:', error);
        return false;
    }
}

/**
 * Získa všetky kľúče z IndexedDB
 */
export async function getAllKeys() {
    try {
        if (!db) {
            await initDB();
        }

        return new Promise((resolve, reject) => {
            const transaction = db.transaction([STORE_NAME], 'readonly');
            const objectStore = transaction.objectStore(STORE_NAME);
            const request = objectStore.getAllKeys();

            request.onsuccess = () => {
                resolve(request.result);
            };

            request.onerror = () => {
                console.error('Chyba pri získavaní kľúčov:', request.error);
                reject(request.error);
            };
        });
    } catch (error) {
        console.error('Chyba v getAllKeys:', error);
        return [];
    }
}

/**
 * Získa všetky dáta z IndexedDB
 */
export async function getAllData() {
    try {
        if (!db) {
            await initDB();
        }

        return new Promise((resolve, reject) => {
            const transaction = db.transaction([STORE_NAME], 'readonly');
            const objectStore = transaction.objectStore(STORE_NAME);
            const request = objectStore.getAll();

            request.onsuccess = () => {
                resolve(request.result);
            };

            request.onerror = () => {
                console.error('Chyba pri získavaní všetkých dát:', request.error);
                reject(request.error);
            };
        });
    } catch (error) {
        console.error('Chyba v getAllData:', error);
        return [];
    }
}

/**
 * Vymaže všetky dáta z IndexedDB
 */
export async function clearAllData() {
    try {
        if (!db) {
            await initDB();
        }

        return new Promise((resolve, reject) => {
            const transaction = db.transaction([STORE_NAME], 'readwrite');
            const objectStore = transaction.objectStore(STORE_NAME);
            const request = objectStore.clear();

            request.onsuccess = () => {
                console.log('Všetky dáta vymazané z IndexedDB');
                resolve(true);
            };

            request.onerror = () => {
                console.error('Chyba pri vymazávaní dát:', request.error);
                reject(request.error);
            };
        });
    } catch (error) {
        console.error('Chyba v clearAllData:', error);
        return false;
    }
}

/**
 * Kontrola či IndexedDB funguje
 */
export async function isIndexedDBAvailable() {
    if (!window.indexedDB) {
        console.warn('IndexedDB nie je podporovaná v tomto prehliadači');
        return false;
    }

    try {
        await initDB();
        return true;
    } catch (error) {
        console.error('IndexedDB nie je dostupná:', error);
        return false;
    }
}
