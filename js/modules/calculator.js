/**
 * Modul pre výpočtové funkcie
 */

import { MINUTES_PER_HOUR, HOURS_PER_DAY, DAY_NAMES, MONTH_NAMES } from './constants.js';

/**
 * Získa počet dní v danom mesiaci a roku
 */
export function getDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
}

/**
 * Získa názov dňa v týždni pre dané dátum
 */
export function getDayName(year, month, day) {
    const date = new Date(year, month, day);
    return DAY_NAMES[date.getDay()];
}

/**
 * Získa názov mesiaca
 */
export function getMonthName(month) {
    return MONTH_NAMES[month];
}

/**
 * Parsuje časový reťazec (HH:MM) na objekt s hodinami a minútami
 */
export function parseTime(timeString) {
    if (!timeString || typeof timeString !== 'string') {
        return null;
    }

    const parts = timeString.split(':');
    if (parts.length !== 2) {
        return null;
    }

    const hours = parseInt(parts[0], 10);
    const minutes = parseInt(parts[1], 10);

    if (isNaN(hours) || isNaN(minutes)) {
        return null;
    }

    return { hours, minutes };
}

/**
 * Validuje časový vstup
 */
export function isValidTime(hours, minutes) {
    return hours >= 0 && hours < HOURS_PER_DAY &&
           minutes >= 0 && minutes < MINUTES_PER_HOUR;
}

/**
 * Vypočíta rozdiel v minútach medzi dvoma časmi
 */
export function calculateTimeDifference(startTime, endTime, breakTimeHours = 0) {
    const start = parseTime(startTime);
    const end = parseTime(endTime);

    if (!start || !end) {
        return null;
    }

    if (!isValidTime(start.hours, start.minutes) || !isValidTime(end.hours, end.minutes)) {
        return null;
    }

    const startDate = new Date();
    startDate.setHours(start.hours, start.minutes, 0, 0);

    const endDate = new Date();
    endDate.setHours(end.hours, end.minutes, 0, 0);

    let diffMinutes = (endDate - startDate) / 60000 - (breakTimeHours * MINUTES_PER_HOUR);

    // Ak je rozdiel záporný, predpokladáme prechod cez polnoc
    if (diffMinutes < 0) {
        diffMinutes += HOURS_PER_DAY * MINUTES_PER_HOUR;
    }

    return diffMinutes;
}

/**
 * Konvertuje minúty na objekt s hodinami a minútami
 */
export function minutesToHoursAndMinutes(totalMinutes) {
    const hours = Math.floor(totalMinutes / MINUTES_PER_HOUR);
    const minutes = Math.round(totalMinutes % MINUTES_PER_HOUR);
    return { hours, minutes };
}

/**
 * Konvertuje minúty na desatinné hodiny
 */
export function minutesToDecimalHours(totalMinutes, decimalPlaces = 1) {
    return (totalMinutes / MINUTES_PER_HOUR).toFixed(decimalPlaces);
}

/**
 * Vypočíta hrubú mzdu na základe odpracovaných minút a hodinovej mzdy
 */
export function calculateGrossSalary(totalMinutes, hourlyWage, decimalPlaces = 1) {
    if (!totalMinutes || isNaN(totalMinutes) || !hourlyWage || isNaN(hourlyWage)) {
        return '0.00';
    }

    const hours = totalMinutes / MINUTES_PER_HOUR;
    const grossSalary = hours * hourlyWage;

    return isFinite(grossSalary) ? grossSalary.toFixed(decimalPlaces) : '0.00';
}

/**
 * Vypočíta čistú mzdu po zdanení
 */
export function calculateNetSalary(grossSalary, taxRate, decimalPlaces = 1) {
    if (!grossSalary || isNaN(grossSalary) || !taxRate || isNaN(taxRate)) {
        return '0.00';
    }

    const netSalary = grossSalary * (1 - taxRate);

    return isFinite(netSalary) ? netSalary.toFixed(decimalPlaces) : '0.00';
}

/**
 * Vypočíta odpracovaný čas a mzdy pre jeden deň
 */
export function calculateDayData(startTime, endTime, breakTime, hourlyWage, taxRate, decimalPlaces = 1) {
    const totalMinutes = calculateTimeDifference(startTime, endTime, breakTime);

    if (totalMinutes === null || totalMinutes < 0) {
        return {
            totalMinutes: 0,
            displayTime: `0h 0m (${(0).toFixed(decimalPlaces)} h)`,
            grossSalary: '0.00',
            netSalary: '0.00'
        };
    }

    const { hours, minutes } = minutesToHoursAndMinutes(totalMinutes);
    const decimalHours = minutesToDecimalHours(totalMinutes, decimalPlaces);
    const grossSalary = calculateGrossSalary(totalMinutes, hourlyWage, decimalPlaces);
    const netSalary = calculateNetSalary(parseFloat(grossSalary), taxRate, decimalPlaces);

    return {
        totalMinutes,
        displayTime: `${hours}h ${minutes}m (${decimalHours} h)`,
        grossSalary,
        netSalary
    };
}

/**
 * Vypočíta celkové štatistiky za všetky dni
 */
export function calculateTotalStats(daysData, decimalPlaces = 1) {
    let totalMinutes = 0;
    let totalGrossSalary = 0;
    let totalNetSalary = 0;
    let daysWithEntries = 0;

    daysData.forEach(day => {
        if (day && day.totalMinutes > 0) {
            totalMinutes += day.totalMinutes;
            totalGrossSalary += parseFloat(day.grossSalary) || 0;
            totalNetSalary += parseFloat(day.netSalary) || 0;
            daysWithEntries++;
        }
    });

    const totalTime = minutesToHoursAndMinutes(totalMinutes);
    const totalDecimalHours = minutesToDecimalHours(totalMinutes, decimalPlaces);

    // Výpočet priemeru
    let averageNetSalary = 0;
    let averageMinutes = 0;

    if (daysWithEntries > 0) {
        averageNetSalary = (totalNetSalary / daysWithEntries).toFixed(decimalPlaces);
        averageMinutes = totalMinutes / daysWithEntries;
    }

    const averageTime = minutesToHoursAndMinutes(averageMinutes);
    const averageDecimalHours = minutesToDecimalHours(averageMinutes, decimalPlaces);

    return {
        daysWithEntries,
        totalMinutes,
        totalHours: totalTime.hours,
        totalMinutesRemainder: totalTime.minutes,
        totalDecimalHours,
        totalGrossSalary: totalGrossSalary.toFixed(decimalPlaces),
        totalNetSalary: totalNetSalary.toFixed(decimalPlaces),
        averageNetSalary,
        averageHours: averageTime.hours,
        averageMinutes: averageTime.minutes,
        averageDecimalHours
    };
}

/**
 * Formátuje časový vstup (pridá dvojbodku automaticky)
 */
export function formatTimeInput(value) {
    let formatted = value.replace(/[^\d:]/g, '');

    if (formatted.length === 4 && !formatted.includes(':')) {
        formatted = formatted.slice(0, 2) + ':' + formatted.slice(2);
    }

    return formatted;
}

/**
 * Skontroluje, či je časový formát validný
 */
export function validateTimeFormat(value) {
    if (value.length !== 5) {
        return false;
    }

    const time = parseTime(value);
    if (!time) {
        return false;
    }

    return isValidTime(time.hours, time.minutes);
}
