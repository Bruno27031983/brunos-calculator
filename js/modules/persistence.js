/**
 * Modul pre prácu s Persistent Storage API
 * Zabezpečuje, že prehliadač nebude automaticky mazať dáta
 */

/**
 * Požiada o trvalé úložisko (nebude automaticky vymazané prehliadačom)
 */
export async function requestPersistentStorage() {
    if (!navigator.storage || !navigator.storage.persist) {
        // removed for production
        return {
            granted: false,
            supported: false,
            message: 'Váš prehliadač nepodporuje trvalé úložisko'
        };
    }

    try {
        const isPersisted = await navigator.storage.persisted();

        if (isPersisted) {
            // removed for production
            return {
                granted: true,
                supported: true,
                alreadyPersisted: true,
                message: 'Úložisko je už chránené proti automatickému vymazaniu'
            };
        }

        // Žiadosť o persistent storage
        const granted = await navigator.storage.persist();

        if (granted) {
            // removed for production
            return {
                granted: true,
                supported: true,
                alreadyPersisted: false,
                message: 'Trvalé úložisko povolené! Vaše dáta sú chránené.'
            };
        } else {
            // removed for production
            return {
                granted: false,
                supported: true,
                alreadyPersisted: false,
                message: 'Trvalé úložisko odmietnuté. Dáta môžu byť vymazané pri nedostatku miesta.'
            };
        }
    } catch (error) {
        // removed for production
        return {
            granted: false,
            supported: true,
            error: error.message,
            message: 'Chyba pri žiadosti o trvalé úložisko'
        };
    }
}

/**
 * Skontroluje, či je úložisko persistentné
 */
export async function isPersisted() {
    if (!navigator.storage || !navigator.storage.persisted) {
        return false;
    }

    try {
        return await navigator.storage.persisted();
    } catch (error) {
        // removed for production
        return false;
    }
}

/**
 * Získa odhad dostupného úložiska
 */
export async function getStorageEstimate() {
    if (!navigator.storage || !navigator.storage.estimate) {
        // removed for production
        return null;
    }

    try {
        const estimate = await navigator.storage.estimate();

        const quota = estimate.quota || 0;
        const usage = estimate.usage || 0;
        const available = quota - usage;
        const percentUsed = quota > 0 ? ((usage / quota) * 100).toFixed(2) : 0;

        const result = {
            quota: quota,
            usage: usage,
            available: available,
            percentUsed: parseFloat(percentUsed),
            quotaMB: (quota / (1024 * 1024)).toFixed(2),
            usageMB: (usage / (1024 * 1024)).toFixed(2),
            availableMB: (available / (1024 * 1024)).toFixed(2)
        };

        // removed for production

        return result;
    } catch (error) {
        // removed for production
        return null;
    }
}

/**
 * Získa komplexný status persistence a úložiska
 */
export async function getStorageStatus() {
    const persisted = await isPersisted();
    const estimate = await getStorageEstimate();

    const status = {
        isPersisted: persisted,
        estimate: estimate,
        supported: {
            persist: !!(navigator.storage && navigator.storage.persist),
            estimate: !!(navigator.storage && navigator.storage.estimate)
        }
    };

    return status;
}

/**
 * Zobrazí používateľovi informácie o úložisku
 */
export async function showStorageInfo() {
    const status = await getStorageStatus();

    let message = '💾 INFORMÁCIE O ÚLOŽISKU\n\n';

    // Persistent Storage
    if (status.supported.persist) {
        if (status.isPersisted) {
            message += '✅ Trvalé úložisko: AKTÍVNE\n';
            message += '   Dáta sú chránené proti automatickému vymazaniu\n\n';
        } else {
            message += '⚠️ Trvalé úložisko: NEAKTÍVNE\n';
            message += '   Dáta môžu byť vymazané pri nedostatku miesta\n\n';
        }
    } else {
        message += '❌ Trvalé úložisko: NEPODPOROVANÉ\n';
        message += '   Váš prehliadač nepodporuje túto funkciu\n\n';
    }

    // Storage Estimate
    if (status.estimate) {
        message += `📊 Využitie úložiska:\n`;
        message += `   Použité: ${status.estimate.usageMB} MB\n`;
        message += `   Dostupné: ${status.estimate.availableMB} MB\n`;
        message += `   Kvóta: ${status.estimate.quotaMB} MB\n`;
        message += `   Využitie: ${status.estimate.percentUsed}%\n\n`;

        if (status.estimate.percentUsed > 80) {
            message += '⚠️ VAROVANIE: Úložisko je takmer plné!\n';
            message += '   Odporúčame exportovať zálohy.\n';
        }
    } else {
        message += '❌ Odhad úložiska nie je dostupný\n';
    }

    return message;
}

/**
 * Kontrola, či je dostatok miesta pre uloženie dát
 */
export async function hasEnoughSpace(requiredBytes) {
    const estimate = await getStorageEstimate();

    if (!estimate) {
        // Ak nemôžeme zistiť, predpokladáme, že je dostatok miesta
        return true;
    }

    const hasSpace = estimate.available >= requiredBytes;

    if (!hasSpace) {
        // removed for production
    }

    return hasSpace;
}

/**
 * Upozornenie pri kritickom stave úložiska
 */
export async function checkStorageHealth() {
    const estimate = await getStorageEstimate();

    if (!estimate) {
        return {
            healthy: true,
            warning: false,
            critical: false
        };
    }

    const percentUsed = estimate.percentUsed;

    const health = {
        healthy: percentUsed < 80,
        warning: percentUsed >= 80 && percentUsed < 95,
        critical: percentUsed >= 95,
        percentUsed: percentUsed,
        message: ''
    };

    if (health.critical) {
        health.message = `⛔ KRITICKÉ: Úložisko je ${percentUsed}% plné! Dáta môžu byť vymazané.`;
    } else if (health.warning) {
        health.message = `⚠️ VAROVANIE: Úložisko je ${percentUsed}% plné. Odporúčame exportovať zálohy.`;
    } else {
        health.message = `✅ Úložisko je v poriadku (${percentUsed}% použité)`;
    }

    // removed for production

    return health;
}

/**
 * Inicializácia persistence systému
 */
export async function initPersistence() {
    // removed for production

    // Požiadať o persistent storage
    const persistResult = await requestPersistentStorage();

    // Kontrola zdravia úložiska
    const health = await checkStorageHealth();

    // Zobrazenie statusu
    const status = await getStorageStatus();

    const result = {
        persistence: persistResult,
        health: health,
        status: status
    };

    // removed for production

    return result;
}
