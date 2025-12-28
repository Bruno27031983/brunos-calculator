/**
 * Backup Manager - Multi-level zálohovací systém
 * Zabezpečuje redundantné ukladanie dát do viacerých úložísk
 */

import { saveToIndexedDB, loadFromIndexedDB, isIndexedDBAvailable, getAllData } from './indexeddb.js';
import { loadAllData, saveAllData } from './storage.js';
import { STORAGE_KEYS } from './constants.js';

// Konštanty pre backup
const BACKUP_PREFIX = 'backup_';
const AUTO_BACKUP_INTERVAL = 5 * 60 * 1000; // 5 minút
const MAX_AUTO_BACKUPS = 10;
const BACKUP_VERSION = '1.0';

/**
 * Vytvorí kompletný snapshot všetkých dát
 */
export function createBackupSnapshot(data) {
    return {
        version: BACKUP_VERSION,
        timestamp: new Date().toISOString(),
        data: data,
        metadata: {
            userAgent: navigator.userAgent,
            created: new Date().toISOString(),
            dataSize: JSON.stringify(data).length
        }
    };
}

/**
 * Uloží backup do všetkých dostupných úložísk
 */
export async function saveBackup(data, backupName = null) {
    const name = backupName || `${BACKUP_PREFIX}${Date.now()}`;
    const snapshot = createBackupSnapshot(data);
    const results = {
        localStorage: false,
        indexedDB: false,
        success: false
    };

    try {
        // 1. Uloženie do localStorage (ak je miesto)
        try {
            localStorage.setItem(name, JSON.stringify(snapshot));
            results.localStorage = true;
            // removed for production
        } catch (error) {
            // removed for production
        }

        // 2. Uloženie do IndexedDB
        const isIDBAvailable = await isIndexedDBAvailable();
        if (isIDBAvailable) {
            const saved = await saveToIndexedDB(name, snapshot);
            results.indexedDB = saved;
            if (saved) {
                // removed for production
            }
        } else {
            // removed for production
        }

        results.success = results.localStorage || results.indexedDB;

        if (results.success) {
            // removed for production
        } else {
            // removed for production
        }

        return { name, ...results };
    } catch (error) {
        // removed for production
        return { name, ...results };
    }
}

/**
 * Načíta backup podľa názvu
 */
export async function loadBackup(backupName) {
    try {
        // Skús najprv IndexedDB
        const isIDBAvailable = await isIndexedDBAvailable();
        if (isIDBAvailable) {
            const data = await loadFromIndexedDB(backupName);
            if (data) {
                // removed for production
                return data;
            }
        }

        // Ak nie je v IndexedDB, skús localStorage
        const localData = localStorage.getItem(backupName);
        if (localData) {
            // removed for production
            return JSON.parse(localData);
        }

        // removed for production
        return null;
    } catch (error) {
        // removed for production
        return null;
    }
}

/**
 * Získa zoznam všetkých dostupných backupov
 */
export async function listBackups() {
    const backups = [];

    try {
        // Backupy z localStorage
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith(BACKUP_PREFIX)) {
                try {
                    const data = JSON.parse(localStorage.getItem(key));
                    backups.push({
                        name: key,
                        timestamp: data.timestamp,
                        source: 'localStorage',
                        size: JSON.stringify(data).length
                    });
                } catch (error) {
                    // removed for production
                }
            }
        }

        // Backupy z IndexedDB
        const isIDBAvailable = await isIndexedDBAvailable();
        if (isIDBAvailable) {
            const allData = await getAllData();
            allData.forEach(item => {
                if (item.key.startsWith(BACKUP_PREFIX)) {
                    backups.push({
                        name: item.key,
                        timestamp: item.timestamp,
                        source: 'IndexedDB',
                        size: JSON.stringify(item.value).length
                    });
                }
            });
        }

        // Zoradi podľa času (najnovšie prvé)
        backups.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        // removed for production
        return backups;
    } catch (error) {
        // removed for production
        return [];
    }
}

/**
 * Obnoví dáta z backupu
 */
export async function restoreFromBackup(backupName) {
    try {
        const backup = await loadBackup(backupName);

        if (!backup) {
            throw new Error(`Backup ${backupName} nenájdený`);
        }

        if (!backup.data) {
            throw new Error('Backup neobsahuje dáta');
        }

        // Overenie verzie backupu
        if (backup.version !== BACKUP_VERSION) {
            // removed for production
        }

        // Vytvorenie zálohy pred obnovením (safety backup)
        const currentData = loadAllData({
            hourlyWage: 10,
            taxRate: 0.02,
            decimalPlaces: 1
        });

        await saveBackup(currentData, `${BACKUP_PREFIX}before_restore_${Date.now()}`);

        // Obnovenie dát
        const success = saveAllData(backup.data);

        if (success) {
            // removed for production
            // removed for production
            return {
                success: true,
                backup: backup,
                message: 'Dáta úspešne obnovené'
            };
        } else {
            throw new Error('Zlyhalo uloženie obnovených dát');
        }
    } catch (error) {
        // removed for production
        return {
            success: false,
            error: error.message,
            message: 'Chyba pri obnovovaní dát'
        };
    }
}

/**
 * Automatické zálohovanie s limitom počtu záloh
 */
export async function autoBackup(data) {
    try {
        // removed for production

        // Vytvorenie novej zálohy
        const result = await saveBackup(data, `${BACKUP_PREFIX}auto_${Date.now()}`);

        if (!result.success) {
            // removed for production
            return false;
        }

        // Čistenie starých automatických záloh
        await cleanupOldBackups();

        // removed for production
        return true;
    } catch (error) {
        // removed for production
        return false;
    }
}

/**
 * Vymaže staré automatické zálohy (ponechá len MAX_AUTO_BACKUPS najnovších)
 */
async function cleanupOldBackups() {
    try {
        const backups = await listBackups();
        const autoBackups = backups.filter(b => b.name.includes('auto'));

        if (autoBackups.length > MAX_AUTO_BACKUPS) {
            const toDelete = autoBackups.slice(MAX_AUTO_BACKUPS);

            for (const backup of toDelete) {
                if (backup.source === 'localStorage') {
                    localStorage.removeItem(backup.name);
                }
                // IndexedDB cleanup by sa mal spraviť cez indexeddb modul
                // removed for production
            }

            // removed for production
        }
    } catch (error) {
        // removed for production
    }
}

/**
 * Vytvorí automatický backup interval
 */
export function startAutoBackup(getData) {
    // removed for production

    return setInterval(async () => {
        const data = getData();
        await autoBackup(data);
    }, AUTO_BACKUP_INTERVAL);
}

/**
 * Zastaví automatické zálohovanie
 */
export function stopAutoBackup(intervalId) {
    if (intervalId) {
        clearInterval(intervalId);
        // removed for production
    }
}

/**
 * Export všetkých dát do JSON súboru
 */
export function exportBackupToFile(data, filename = null) {
    try {
        const snapshot = createBackupSnapshot(data);
        const json = JSON.stringify(snapshot, null, 2);
        const blob = new Blob([json], { type: 'application/json' });

        const name = filename || `brunos-calculator-backup-${new Date().toISOString().split('T')[0]}.json`;
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = name;
        a.click();

        URL.revokeObjectURL(url);

        // removed for production
        return true;
    } catch (error) {
        // removed for production
        return false;
    }
}

/**
 * Import dát zo súboru
 */
export function importBackupFromFile(callback) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';

    input.onchange = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const backup = JSON.parse(e.target.result);

                if (!backup.data) {
                    throw new Error('Neplatný formát backup súboru');
                }

                if (backup.version !== BACKUP_VERSION) {
                    // removed for production
                }

                // removed for production

                if (callback) {
                    callback({
                        success: true,
                        backup: backup
                    });
                }
            } catch (error) {
                // removed for production
                if (callback) {
                    callback({
                        success: false,
                        error: error.message
                    });
                }
            }
        };

        reader.readAsText(file);
    };

    input.click();
}

/**
 * Získa štatistiky o backupoch
 */
export async function getBackupStats() {
    const backups = await listBackups();

    const stats = {
        totalBackups: backups.length,
        autoBackups: backups.filter(b => b.name.includes('auto')).length,
        manualBackups: backups.filter(b => !b.name.includes('auto') && !b.name.includes('before_restore')).length,
        totalSize: backups.reduce((sum, b) => sum + (b.size || 0), 0),
        oldestBackup: backups.length > 0 ? backups[backups.length - 1].timestamp : null,
        newestBackup: backups.length > 0 ? backups[0].timestamp : null,
        sources: {
            localStorage: backups.filter(b => b.source === 'localStorage').length,
            indexedDB: backups.filter(b => b.source === 'IndexedDB').length
        }
    };

    return stats;
}
