/**
 * Konštanty aplikácie Bruno's Calculator
 */

// Názvy mesiacov
export const MONTH_NAMES = [
    "Január", "Február", "Marec", "Apríl", "Máj", "Jún",
    "Júl", "August", "September", "Október", "November", "December"
];

// Názvy dní v týždni
export const DAY_NAMES = [
    "Nedeľa", "Pondelok", "Utorok", "Streda", "Štvrtok", "Piatok", "Sobota"
];

// Limity pre localStorage
export const MAX_DATA_SIZE = 4 * 1024 * 1024; // 4 MB
export const MAX_DATA_SIZE_KB = MAX_DATA_SIZE / 1024; // 4096 KB

// Debounce časovanie (ms)
export const DEBOUNCE_DELAY = 300;

// Časovanie notifikácií (ms)
export const NOTIFICATION_DURATION = 2000;

// Časové konštanty
export const MINUTES_PER_HOUR = 60;
export const HOURS_PER_DAY = 24;

// Roky pre výber
export const YEAR_RANGE_START = 2020;
export const YEAR_RANGE_END = 2030;

// Default hodnoty
export const DEFAULT_HOURLY_WAGE = 10;
export const DEFAULT_TAX_RATE = 2;
export const DEFAULT_DECIMAL_PLACES = 1;

// LocalStorage kľúče
export const STORAGE_KEYS = {
    WORK_DAYS_DATA: 'workDaysData',
    HOURLY_WAGE: 'hourlyWage',
    TAX_RATE: 'taxRate',
    DARK_MODE: 'darkMode',
    DECIMAL_PLACES: 'decimalPlaces',
    EMPLOYEE_NAME: 'employeeName'
};

// CSS triedy
export const CSS_CLASSES = {
    DARK_MODE: 'dark-mode',
    CURRENT_DAY: 'current-day',
    SHOW: 'show'
};

// Progress bar farby
export const PROGRESS_BAR_COLORS = {
    NORMAL: '#4CAF50',
    WARNING: '#ff9800',
    DANGER: '#f44336'
};

// Progress bar thresholdy (percentá)
export const PROGRESS_BAR_THRESHOLDS = {
    WARNING: 50,
    DANGER: 80
};

// Validácia času
export const TIME_VALIDATION = {
    MAX_HOURS: 23,
    MAX_MINUTES: 59,
    MIN_VALUE: 0
};

// PDF nastavenia
export const PDF_SETTINGS = {
    FONT_NAME: 'Roboto',
    TITLE_FONT_SIZE: 18,
    SUBTITLE_FONT_SIZE: 14,
    BODY_FONT_SIZE: 12,
    TITLE_Y: 20,
    SUBTITLE_Y: 25,
    TABLE_START_Y: 30,
    MARGIN_TOP: 25,
    MARGIN_X: 14,
    HEADER_COLOR: [41, 128, 185],
    ALT_ROW_COLOR: [245, 245, 245]
};
