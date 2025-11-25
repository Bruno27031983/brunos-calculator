/**
 * Modul pre prácu s localStorage
 */

import { MAX_DATA_SIZE, MAX_DATA_SIZE_KB, STORAGE_KEYS } from './constants.js';

/**
 * Načíta hodnotu z localStorage a parsuje ju
 */
function getItem(key, defaultValue = null) {
    try {
        const item = localStorage.getItem(key);
        return item !== null ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.error(`Chyba pri načítavaní ${key} z localStorage:`, error);
        return defaultValue;
    }
}

/**
 * Uloží hodnotu do localStorage
 */
function setItem(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (error) {
        console.error(`Chyba pri ukladaní ${key} do localStorage:`, error);
        return false;
    }
}

/**
 * Vypočíta veľkosť všetkých dát v localStorage
 */
export function calculateDataSize() {
    try {
        const workDaysData = localStorage.getItem(STORAGE_KEYS.WORK_DAYS_DATA) || '{}';
        const hourlyWage = localStorage.getItem(STORAGE_KEYS.HOURLY_WAGE) || '';
        const taxRate = localStorage.getItem(STORAGE_KEYS.TAX_RATE) || '';
        const darkMode = localStorage.getItem(STORAGE_KEYS.DARK_MODE) || 'false';
        const decimalPlaces = localStorage.getItem(STORAGE_KEYS.DECIMAL_PLACES) || '1';
        const employeeName = localStorage.getItem(STORAGE_KEYS.EMPLOYEE_NAME) || '""';

        const totalData = workDaysData + hourlyWage + taxRate + darkMode + decimalPlaces + employeeName;
        const bytes = new Blob([totalData]).size;
        const kilobytes = (bytes / 1024).toFixed(2);
        const percentageUsed = Math.min(((bytes / MAX_DATA_SIZE) * 100).toFixed(2), 100);

        return {
            bytes,
            kilobytes,
            percentageUsed,
            isOverLimit: bytes > MAX_DATA_SIZE
        };
    } catch (error) {
        console.error('Chyba pri výpočte veľkosti dát:', error);
        return null;
    }
}

/**
 * Načíta všetky dáta pracovných dní
 */
export function loadWorkDaysData() {
    return getItem(STORAGE_KEYS.WORK_DAYS_DATA, {});
}

/**
 * Uloží dáta pracovných dní
 */
export function saveWorkDaysData(data) {
    return setItem(STORAGE_KEYS.WORK_DAYS_DATA, data);
}

/**
 * Načíta hodinovú mzdu
 */
export function loadHourlyWage(defaultValue) {
    const value = getItem(STORAGE_KEYS.HOURLY_WAGE);
    return !isNaN(parseFloat(value)) ? parseFloat(value) : defaultValue;
}

/**
 * Uloží hodinovú mzdu
 */
export function saveHourlyWage(wage) {
    return setItem(STORAGE_KEYS.HOURLY_WAGE, wage);
}

/**
 * Načíta daňovú sadzbu
 */
export function loadTaxRate(defaultValue) {
    const value = getItem(STORAGE_KEYS.TAX_RATE);
    return !isNaN(parseFloat(value)) ? parseFloat(value) : defaultValue;
}

/**
 * Uloží daňovú sadzbu
 */
export function saveTaxRate(rate) {
    return setItem(STORAGE_KEYS.TAX_RATE, rate);
}

/**
 * Načíta stav tmavého režimu
 */
export function loadDarkMode() {
    return getItem(STORAGE_KEYS.DARK_MODE, false);
}

/**
 * Uloží stav tmavého režimu
 */
export function saveDarkMode(isDark) {
    return setItem(STORAGE_KEYS.DARK_MODE, isDark);
}

/**
 * Načíta počet desatinných miest
 */
export function loadDecimalPlaces(defaultValue) {
    const value = getItem(STORAGE_KEYS.DECIMAL_PLACES);
    return value !== null ? parseInt(value) : defaultValue;
}

/**
 * Uloží počet desatinných miest
 */
export function saveDecimalPlaces(places) {
    return setItem(STORAGE_KEYS.DECIMAL_PLACES, places);
}

/**
 * Načíta meno pracovníka
 */
export function loadEmployeeName() {
    return getItem(STORAGE_KEYS.EMPLOYEE_NAME, '');
}

/**
 * Uloží meno pracovníka
 */
export function saveEmployeeName(name) {
    return setItem(STORAGE_KEYS.EMPLOYEE_NAME, name);
}

/**
 * Uloží všetky dáta naraz s kontrolou veľkosti
 */
export function saveAllData(data) {
    const { monthData, hourlyWage, taxRate, isDarkMode, decimalPlaces, employeeName } = data;

    // Kontrola veľkosti pred uložením
    const serializedData = JSON.stringify(monthData);
    const serializedHourlyWage = JSON.stringify(hourlyWage);
    const serializedTaxRate = JSON.stringify(taxRate);
    const serializedDarkMode = JSON.stringify(isDarkMode);
    const serializedDecimalPlaces = JSON.stringify(decimalPlaces);
    const serializedEmployeeName = JSON.stringify(employeeName);

    const totalData = serializedData + serializedHourlyWage + serializedTaxRate +
                      serializedDarkMode + serializedDecimalPlaces + serializedEmployeeName;
    const bytes = new Blob([totalData]).size;

    if (bytes > MAX_DATA_SIZE) {
        alert(`Prekročili ste maximálnu veľkosť dát (${MAX_DATA_SIZE_KB.toFixed(2)} KB). Dáta neboli uložené.`);
        return false;
    }

    // Uloženie všetkých dát
    const success = saveWorkDaysData(monthData) &&
                   saveHourlyWage(hourlyWage) &&
                   saveTaxRate(taxRate) &&
                   saveDarkMode(isDarkMode) &&
                   saveDecimalPlaces(decimalPlaces) &&
                   saveEmployeeName(employeeName);

    if (success) {
        console.log('Všetky dáta úspešne uložené');
    }

    return success;
}

/**
 * Načíta všetky dáta naraz
 */
export function loadAllData(defaults) {
    return {
        monthData: loadWorkDaysData(),
        hourlyWage: loadHourlyWage(defaults.hourlyWage),
        taxRate: loadTaxRate(defaults.taxRate),
        isDarkMode: loadDarkMode(),
        decimalPlaces: loadDecimalPlaces(defaults.decimalPlaces),
        employeeName: loadEmployeeName()
    };
}
