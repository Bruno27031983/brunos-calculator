/**
 * Modul pre UI operácie a DOM manipuláciu
 */

import {
    CSS_CLASSES,
    NOTIFICATION_DURATION,
    PROGRESS_BAR_COLORS,
    PROGRESS_BAR_THRESHOLDS,
    MAX_DATA_SIZE_KB
} from './constants.js';
import { calculateDataSize } from './storage.js';
import { showError } from './toast.js';

/**
 * Zobrazí notifikáciu o uložení
 */
export function showSaveNotification() {
    const notification = document.getElementById('saveNotification');
    if (!notification) return;

    notification.classList.add(CSS_CLASSES.SHOW);
    setTimeout(() => {
        notification.classList.remove(CSS_CLASSES.SHOW);
    }, NOTIFICATION_DURATION);
}

/**
 * Aktualizuje progress bar s veľkosťou dát
 */
export function updateDataSizeDisplay() {
    const dataSizeText = document.getElementById('dataSizeText');
    const dataSizeFill = document.getElementById('dataSizeFill');

    if (!dataSizeText || !dataSizeFill) return;

    const sizeInfo = calculateDataSize();
    if (!sizeInfo) {
        dataSizeText.textContent = 'Veľkosť dát: Nepodarilo sa vypočítať';
        return;
    }

    const { kilobytes, percentageUsed, isOverLimit } = sizeInfo;

    dataSizeText.textContent = `Veľkosť dát: ${kilobytes} KB / ${MAX_DATA_SIZE_KB} KB`;
    dataSizeFill.style.width = `${percentageUsed}%`;

    // Nastavenie farby podľa použitia
    if (percentageUsed > PROGRESS_BAR_THRESHOLDS.DANGER || isOverLimit) {
        dataSizeFill.style.backgroundColor = PROGRESS_BAR_COLORS.DANGER;
    } else if (percentageUsed > PROGRESS_BAR_THRESHOLDS.WARNING) {
        dataSizeFill.style.backgroundColor = PROGRESS_BAR_COLORS.WARNING;
    } else {
        dataSizeFill.style.backgroundColor = PROGRESS_BAR_COLORS.NORMAL;
    }

    if (isOverLimit) {
        showError(`Aktuálna veľkosť dát (${kilobytes} KB) prekročila maximálnu povolenú veľkosť (${MAX_DATA_SIZE_KB} KB). Pokúste sa znížiť množstvo uložených dát.`);
        console.warn('Dáta prekročili limit veľkosti.');
    } else {
        console.log(`Aktuálna veľkosť dát: ${kilobytes} KB (${percentageUsed}%)`);
    }
}

/**
 * Aplikuje alebo odstráni tmavý režim
 */
export function applyDarkMode(isDark) {
    const elementsToToggle = [
        document.body,
        document.querySelector('.container'),
        ...document.querySelectorAll('table, th, td, input, .btn'),
        document.getElementById('totalSalary'),
        document.getElementById('mainTitle'),
        document.querySelector('.autor-info')
    ];

    elementsToToggle.forEach(element => {
        if (element) {
            if (isDark) {
                element.classList.add(CSS_CLASSES.DARK_MODE);
            } else {
                element.classList.remove(CSS_CLASSES.DARK_MODE);
            }
        }
    });

    const currentDayRow = document.querySelector(`.${CSS_CLASSES.CURRENT_DAY}`);
    if (currentDayRow) {
        if (isDark) {
            currentDayRow.classList.add(CSS_CLASSES.DARK_MODE);
        } else {
            currentDayRow.classList.remove(CSS_CLASSES.DARK_MODE);
        }
    }

    console.log(`Tmavý režim ${isDark ? 'aktivovaný' : 'deaktivovaný'}`);
}

/**
 * Aktualizuje zobrazenie celkových štatistík
 */
export function updateTotalDisplay(stats) {
    const totalSalaryDiv = document.getElementById('totalSalary');
    if (!totalSalaryDiv) return;

    totalSalaryDiv.innerHTML = `
        Počet odpracovaných dní: ${stats.daysWithEntries}<br>
        Celkový odpracovaný čas: ${stats.totalHours}h ${stats.totalMinutesRemainder}m (${stats.totalDecimalHours} h)<br>
        Celková hrubá mzda: ${stats.totalGrossSalary}€<br>
        Celková čistá mzda: ${stats.totalNetSalary}€<br>
        Priemerná čistá mzda: ${stats.averageNetSalary}€<br>
        <strong>Priemerný odpracovaný čas: ${stats.averageHours}h ${stats.averageMinutes}m (${stats.averageDecimalHours} h)</strong>
    `;
}

/**
 * Získa hodnotu vstupného poľa
 */
export function getInputValue(id) {
    const element = document.getElementById(id);
    return element ? element.value : '';
}

/**
 * Nastaví hodnotu vstupného poľa
 */
export function setInputValue(id, value) {
    const element = document.getElementById(id);
    if (element) {
        element.value = value;
    }
}

/**
 * Získa textový obsah elementu
 */
export function getTextContent(id) {
    const element = document.getElementById(id);
    return element ? element.textContent : '';
}

/**
 * Nastaví textový obsah elementu
 */
export function setTextContent(id, text) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = text;
    }
}

/**
 * Presunie focus na nasledujúci element
 */
export function focusNextElement(nextId) {
    const nextElement = document.getElementById(nextId);
    if (nextElement) {
        nextElement.focus();
    }
}

/**
 * Vytvorí ID elementu pre konkrétny deň
 */
export function createDayElementId(year, month, day, type) {
    return `${type}-${year}-${month}-${day}`;
}

/**
 * Získa element pre konkrétny deň
 */
export function getDayElement(year, month, day, type) {
    const id = createDayElementId(year, month, day, type);
    return document.getElementById(id);
}

/**
 * Vyplní aktuálny čas do time inputu
 */
function fillCurrentTime(input, handlers, day, type) {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const currentTime = `${hours}:${minutes}`;

    input.value = currentTime;

    // Trigger the onTimeInput handler if it exists
    if (handlers && handlers.onTimeInput) {
        handlers.onTimeInput(day, type);
    }
}

/**
 * Vytvorí riadok tabuľky pre jeden deň
 */
export function createDayRow(year, month, day, dayName, isCurrentDay, decimalPlaces, handlers) {
    const row = document.createElement('tr');
    row.setAttribute('role', 'row');

    if (isCurrentDay) {
        row.classList.add(CSS_CLASSES.CURRENT_DAY);
    }

    const startId = createDayElementId(year, month, day, 'start');
    const endId = createDayElementId(year, month, day, 'end');
    const breakId = createDayElementId(year, month, day, 'break');
    const totalId = createDayElementId(year, month, day, 'total');
    const grossId = createDayElementId(year, month, day, 'gross');
    const netId = createDayElementId(year, month, day, 'net');

    // Bezpečne vytvoríme elementy pomocou DOM API namiesto innerHTML (XSS ochrana)

    // Stĺpec dňa
    const dayCell = document.createElement('td');
    dayCell.setAttribute('role', 'cell');
    dayCell.textContent = `Deň ${day} (${dayName})`;
    row.appendChild(dayCell);

    // Príchod s ikonou hodín
    const startCell = document.createElement('td');
    startCell.setAttribute('role', 'cell');
    const startWrapper = document.createElement('div');
    startWrapper.className = 'time-input-wrapper';
    const startInput = document.createElement('input');
    startInput.type = 'tel';
    startInput.id = startId;
    startInput.maxLength = 5;
    startInput.pattern = '[0-9:]*';
    startInput.inputMode = 'numeric';
    startInput.placeholder = 'HH:MM';
    startInput.setAttribute('aria-label', `Čas príchodu pre deň ${day} ${dayName}`);
    const startClockIcon = document.createElement('span');
    startClockIcon.className = 'time-clock-icon';
    startClockIcon.textContent = '🕐';
    startClockIcon.setAttribute('role', 'button');
    startClockIcon.setAttribute('aria-label', 'Vyplniť aktuálny čas');
    startClockIcon.setAttribute('title', 'Kliknutím vyplníte aktuálny čas');
    startClockIcon.addEventListener('click', () => fillCurrentTime(startInput, handlers, day, 'start'));
    startWrapper.appendChild(startInput);
    startWrapper.appendChild(startClockIcon);
    startCell.appendChild(startWrapper);
    row.appendChild(startCell);

    // Odchod s ikonou hodín
    const endCell = document.createElement('td');
    endCell.setAttribute('role', 'cell');
    const endWrapper = document.createElement('div');
    endWrapper.className = 'time-input-wrapper';
    const endInput = document.createElement('input');
    endInput.type = 'tel';
    endInput.id = endId;
    endInput.maxLength = 5;
    endInput.pattern = '[0-9:]*';
    endInput.inputMode = 'numeric';
    endInput.placeholder = 'HH:MM';
    endInput.setAttribute('aria-label', `Čas odchodu pre deň ${day} ${dayName}`);
    const endClockIcon = document.createElement('span');
    endClockIcon.className = 'time-clock-icon';
    endClockIcon.textContent = '🕐';
    endClockIcon.setAttribute('role', 'button');
    endClockIcon.setAttribute('aria-label', 'Vyplniť aktuálny čas');
    endClockIcon.setAttribute('title', 'Kliknutím vyplníte aktuálny čas');
    endClockIcon.addEventListener('click', () => fillCurrentTime(endInput, handlers, day, 'end'));
    endWrapper.appendChild(endInput);
    endWrapper.appendChild(endClockIcon);
    endCell.appendChild(endWrapper);
    row.appendChild(endCell);

    // Prestávka
    const breakCell = document.createElement('td');
    breakCell.setAttribute('role', 'cell');
    const breakInput = document.createElement('input');
    breakInput.type = 'number';
    breakInput.id = breakId;
    breakInput.min = '0';
    breakInput.step = '0.5';
    breakInput.placeholder = 'prestávka';
    breakInput.setAttribute('aria-label', `Prestávka v hodinách pre deň ${day} ${dayName}`);
    breakCell.appendChild(breakInput);
    row.appendChild(breakCell);

    // Odpracované
    const totalCell = document.createElement('td');
    totalCell.setAttribute('role', 'cell');
    totalCell.id = totalId;
    totalCell.textContent = `0h 0m (${(0).toFixed(decimalPlaces)} h)`;
    totalCell.setAttribute('aria-label', `Odpracované hodiny pre deň ${day}`);
    row.appendChild(totalCell);

    // Hrubá mzda
    const grossCell = document.createElement('td');
    grossCell.setAttribute('role', 'cell');
    const grossInput = document.createElement('input');
    grossInput.type = 'number';
    grossInput.id = grossId;
    grossInput.min = '0';
    grossInput.step = '0.01';
    grossInput.placeholder = 'Hrubá Mzda';
    grossInput.readOnly = true;
    grossInput.setAttribute('aria-label', `Hrubá mzda pre deň ${day}`);
    grossInput.setAttribute('aria-readonly', 'true');
    grossCell.appendChild(grossInput);
    row.appendChild(grossCell);

    // Čistá mzda
    const netCell = document.createElement('td');
    netCell.setAttribute('role', 'cell');
    const netInput = document.createElement('input');
    netInput.type = 'number';
    netInput.id = netId;
    netInput.min = '0';
    netInput.step = '0.01';
    netInput.placeholder = 'Čistá Mzda';
    netInput.readOnly = true;
    netInput.setAttribute('aria-label', `Čistá mzda pre deň ${day}`);
    netInput.setAttribute('aria-readonly', 'true');
    netCell.appendChild(netInput);
    row.appendChild(netCell);

    // Akcia
    const actionCell = document.createElement('td');
    actionCell.setAttribute('role', 'cell');
    const resetBtn = document.createElement('button');
    resetBtn.className = 'btn reset-btn';
    resetBtn.dataset.day = day;
    resetBtn.textContent = 'Vynulovať';
    resetBtn.setAttribute('aria-label', `Vynulovať dáta pre deň ${day} ${dayName}`);
    actionCell.appendChild(resetBtn);
    row.appendChild(actionCell);

    // Pridanie event listenerov (používame priame referencie namiesto dotazovania DOM)
    if (handlers) {
        if (handlers.onTimeInput) {
            startInput.addEventListener('input', () => handlers.onTimeInput(day, 'start'));
            endInput.addEventListener('input', () => handlers.onTimeInput(day, 'end'));
        }

        if (handlers.onBreakInput) {
            breakInput.addEventListener('input', () => handlers.onBreakInput(day));
        }

        if (handlers.onResetRow) {
            resetBtn.addEventListener('click', () => handlers.onResetRow(day));
        }
    }

    return row;
}

/**
 * Vyčistí tabuľku pracovných dní
 */
export function clearWorkDaysTable() {
    const workDays = document.getElementById('workDays');
    if (workDays) {
        workDays.innerHTML = '';
    }
}

/**
 * Pridá riadok do tabuľky pracovných dní
 */
export function appendDayRow(row) {
    const workDays = document.getElementById('workDays');
    if (workDays) {
        workDays.appendChild(row);
    }
}

/**
 * Aktualizuje zobrazenie dát pre jeden deň
 */
export function updateDayDisplay(year, month, day, dayData, decimalPlaces) {
    const totalElement = getDayElement(year, month, day, 'total');
    const grossElement = getDayElement(year, month, day, 'gross');
    const netElement = getDayElement(year, month, day, 'net');

    if (totalElement) {
        totalElement.textContent = dayData.displayTime;
    }

    if (grossElement) {
        grossElement.value = dayData.grossSalary;
    }

    if (netElement) {
        netElement.value = dayData.netSalary;
    }
}

/**
 * Resetuje zobrazenie dát pre jeden deň
 */
export function resetDayDisplay(year, month, day, decimalPlaces) {
    setInputValue(createDayElementId(year, month, day, 'start'), '');
    setInputValue(createDayElementId(year, month, day, 'end'), '');
    setInputValue(createDayElementId(year, month, day, 'break'), '');
    setTextContent(createDayElementId(year, month, day, 'total'), `0h 0m (${(0).toFixed(decimalPlaces)} h)`);
    setInputValue(createDayElementId(year, month, day, 'gross'), '0.00');
    setInputValue(createDayElementId(year, month, day, 'net'), '0.00');
}

/**
 * Načíta dáta dňa zo vstupných polí
 */
export function getDayInputData(year, month, day) {
    return {
        start: getInputValue(createDayElementId(year, month, day, 'start')),
        end: getInputValue(createDayElementId(year, month, day, 'end')),
        breakTime: parseFloat(getInputValue(createDayElementId(year, month, day, 'break'))) || 0,
        gross: getInputValue(createDayElementId(year, month, day, 'gross')),
        net: getInputValue(createDayElementId(year, month, day, 'net'))
    };
}

/**
 * Naplní vstupné polia dátami dňa
 */
export function populateDayInputs(year, month, day, dayData) {
    setInputValue(createDayElementId(year, month, day, 'start'), dayData.start || '');
    setInputValue(createDayElementId(year, month, day, 'end'), dayData.end || '');
    setInputValue(createDayElementId(year, month, day, 'break'), dayData.breakTime || '');
    setInputValue(createDayElementId(year, month, day, 'gross'), dayData.gross || '0.00');
    setInputValue(createDayElementId(year, month, day, 'net'), dayData.net || '0.00');
}
