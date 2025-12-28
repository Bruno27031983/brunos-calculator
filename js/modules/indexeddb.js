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
            // removed for production
            reject(request.error);
        };

        request.onsuccess = () => {
            db = request.result;
            // removed for production
            resolve(db);
        };

        request.onupgradeneeded = (event) => {
            db = event.target.result;

            // Vytvorenie object store ak neexistuje
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                const objectStore = db.createObjectStore(STORE_NAME, { keyPath: 'key' });
                objectStore.createIndex('timestamp', 'timestamp', { unique: false });
                // removed for production
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
                // removed for production
                resolve(true);
            };

            request.onerror = () => {
                // removed for production
                reject(request.error);
            };
        });
    } catch (error) {
        // removed for production
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
                    // removed for production
                    resolve(request.result.value);
                } else {
                    // removed for production
                    resolve(null);
                }
            };

            request.onerror = () => {
                // removed for production
                reject(request.error);
            };
        });
    } catch (error) {
        // removed for production
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
                // removed for production
                resolve(true);
            };

            request.onerror = () => {
                // removed for production
                reject(request.error);
            };
        });
    } catch (error) {
        // removed for production
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
                // removed for production
                reject(request.error);
            };
        });
    } catch (error) {
        // removed for production
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
                // removed for production
                reject(request.error);
            };
        });
    } catch (error) {
        // removed for production
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
                // removed for production
                resolve(true);
            };

            request.onerror = () => {
                // removed for production
                reject(request.error);
            };
        });
    } catch (error) {
        // removed for production
        return false;
    }
}

/**
 * Kontrola či IndexedDB funguje
 */
export async function isIndexedDBAvailable() {
    if (!window.indexedDB) {
        // removed for production
        return false;
    }

    try {
        await initDB();
        return true;
    } catch (error) {
        // removed for production
        return false;
    }
}
