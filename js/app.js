/**
 * Hlavný aplikačný modul Bruno's Calculator
 */

import {
    YEAR_RANGE_START,
    YEAR_RANGE_END,
    DEFAULT_HOURLY_WAGE,
    DEFAULT_TAX_RATE,
    DEFAULT_DECIMAL_PLACES,
    DEBOUNCE_DELAY
} from './modules/constants.js';

import {
    saveAllData,
    loadAllData,
    saveDarkMode
} from './modules/storage.js';

import {
    getDaysInMonth,
    getDayName,
    getMonthName,
    calculateDayData,
    calculateTotalStats,
    formatTimeInput,
    validateTimeFormat
} from './modules/calculator.js';

import {
    showSaveNotification,
    updateDataSizeDisplay,
    applyDarkMode,
    updateTotalDisplay,
    getInputValue,
    setInputValue,
    focusNextElement,
    createDayRow,
    clearWorkDaysTable,
    appendDayRow,
    updateDayDisplay,
    resetDayDisplay,
    getDayInputData,
    populateDayInputs,
    createDayElementId
} from './modules/ui.js';

import {
    exportToPDF,
    exportToExcel,
    sendPDF,
    importFromExcel
} from './modules/export.js';

/**
 * Hlavná trieda aplikácie
 */
class BrunosCalculator {
    constructor() {
        // Inicializácia stavu
        this.currentDate = new Date();
        this.currentMonth = this.currentDate.getMonth();
        this.currentYear = this.currentDate.getFullYear();
        this.hourlyWage = DEFAULT_HOURLY_WAGE;
        this.taxRate = DEFAULT_TAX_RATE / 100;
        this.decimalPlaces = DEFAULT_DECIMAL_PLACES;
        this.employeeName = '';
        this.monthData = {};

        // Debounce timer
        this.saveTimer = null;

        // Bind metód
        this.handleTimeInput = this.handleTimeInput.bind(this);
        this.handleBreakInput = this.handleBreakInput.bind(this);
        this.handleResetRow = this.handleResetRow.bind(this);
        this.handleResetAll = this.handleResetAll.bind(this);
        this.handleToggleDarkMode = this.handleToggleDarkMode.bind(this);
        this.handleExportPDF = this.handleExportPDF.bind(this);
        this.handleExportExcel = this.handleExportExcel.bind(this);
        this.handleSendPDF = this.handleSendPDF.bind(this);
        this.handleImportExcel = this.handleImportExcel.bind(this);
        this.handleMonthChange = this.handleMonthChange.bind(this);
        this.handleYearChange = this.handleYearChange.bind(this);
        this.handleDecimalPlacesChange = this.handleDecimalPlacesChange.bind(this);
        this.handleEmployeeNameChange = this.handleEmployeeNameChange.bind(this);
        this.handleSettingsChange = this.handleSettingsChange.bind(this);
    }

    /**
     * Inicializácia aplikácie
     */
    init() {
        console.log('Inicializácia Bruno\'s Calculator...');

        // Načítanie dát
        this.loadData();

        // Nastavenie UI
        this.setupUI();

        // Vytvorenie tabuľky
        this.createTable();

        // Výpočet celkových štatistík
        this.calculateTotal();

        // Aplikovanie tmavého režimu
        applyDarkMode(this.isDarkMode);

        // Aktualizácia veľkosti dát
        updateDataSizeDisplay();

        console.log('Aplikácia inicializovaná');
    }

    /**
     * Načíta dáta z localStorage
     */
    loadData() {
        const defaults = {
            hourlyWage: DEFAULT_HOURLY_WAGE,
            taxRate: DEFAULT_TAX_RATE / 100,
            decimalPlaces: DEFAULT_DECIMAL_PLACES
        };

        const data = loadAllData(defaults);

        this.monthData = data.monthData;
        this.hourlyWage = data.hourlyWage;
        this.taxRate = data.taxRate;
        this.isDarkMode = data.isDarkMode;
        this.decimalPlaces = data.decimalPlaces;
        this.employeeName = data.employeeName;

        console.log('Dáta načítané:', { hourlyWage: this.hourlyWage, taxRate: this.taxRate, decimalPlaces: this.decimalPlaces });
    }

    /**
     * Nastavenie UI elementov
     */
    setupUI() {
        // Naplnenie výberu rokov
        const yearSelect = document.getElementById('yearSelect');
        for (let year = YEAR_RANGE_START; year <= YEAR_RANGE_END; year++) {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            yearSelect.appendChild(option);
        }

        // Nastavenie aktuálnych hodnôt
        document.getElementById('monthSelect').value = this.currentMonth;
        document.getElementById('yearSelect').value = this.currentYear;
        document.getElementById('hourlyWageInput').value = this.hourlyWage;
        document.getElementById('taxRateInput').value = (this.taxRate * 100).toFixed(1);
        document.getElementById('decimalPlacesSelect').value = this.decimalPlaces;
        document.getElementById('employeeNameInput').value = this.employeeName;

        // Pripojenie event listenerov
        this.attachEventListeners();
    }

    /**
     * Pripojenie event listenerov
     */
    attachEventListeners() {
        document.getElementById('monthSelect').addEventListener('change', this.handleMonthChange);
        document.getElementById('yearSelect').addEventListener('change', this.handleYearChange);
        document.getElementById('decimalPlacesSelect').addEventListener('change', this.handleDecimalPlacesChange);
        document.getElementById('employeeNameInput').addEventListener('input', this.handleEmployeeNameChange);
        document.getElementById('hourlyWageInput').addEventListener('input', this.handleSettingsChange);
        document.getElementById('taxRateInput').addEventListener('input', this.handleSettingsChange);

        // Tlačidlá
        document.querySelector('.btn.highlight').addEventListener('click', this.handleToggleDarkMode);

        const buttons = document.querySelectorAll('.btn-container .btn');
        buttons.forEach(btn => {
            const text = btn.textContent;
            if (text.includes('Resetovať')) {
                btn.addEventListener('click', this.handleResetAll);
            } else if (text.includes('Exportovať do PDF')) {
                btn.addEventListener('click', this.handleExportPDF);
            } else if (text.includes('Exportovať do Excelu')) {
                btn.addEventListener('click', this.handleExportExcel);
            } else if (text.includes('Odoslať PDF')) {
                btn.addEventListener('click', this.handleSendPDF);
            } else if (text.includes('Importovať z Excelu')) {
                btn.addEventListener('click', this.handleImportExcel);
            }
        });
    }

    /**
     * Vytvorí tabuľku pre aktuálny mesiac
     */
    createTable() {
        clearWorkDaysTable();

        console.log(`Vytváranie tabuľky pre ${getMonthName(this.currentMonth)} ${this.currentYear}`);

        const currentDay = this.currentDate.getDate();
        const currentMonthIndex = this.currentDate.getMonth();
        const currentYearValue = this.currentDate.getFullYear();
        const daysInMonth = getDaysInMonth(this.currentYear, this.currentMonth);

        for (let i = 1; i <= daysInMonth; i++) {
            const dayName = getDayName(this.currentYear, this.currentMonth, i);
            const isCurrentDay = (i === currentDay &&
                                  this.currentMonth === currentMonthIndex &&
                                  this.currentYear === currentYearValue);

            const row = createDayRow(
                this.currentYear,
                this.currentMonth,
                i,
                dayName,
                isCurrentDay,
                this.decimalPlaces,
                {
                    onTimeInput: this.handleTimeInput,
                    onBreakInput: this.handleBreakInput,
                    onResetRow: this.handleResetRow
                }
            );

            appendDayRow(row);
        }

        // Načítanie uložených dát
        this.loadMonthData();

        // Aplikovanie tmavého režimu na nové elementy
        if (this.isDarkMode) {
            applyDarkMode(true);
        }
    }

    /**
     * Načíta dáta pre aktuálny mesiac
     */
    loadMonthData() {
        const data = (this.monthData[this.currentYear] &&
                     this.monthData[this.currentYear][this.currentMonth]) || [];

        data.forEach((day, index) => {
            const dayNumber = index + 1;
            populateDayInputs(this.currentYear, this.currentMonth, dayNumber, day);
            this.calculateRow(dayNumber);
        });
    }

    /**
     * Vypočíta dáta pre jeden deň
     */
    calculateRow(day) {
        const inputData = getDayInputData(this.currentYear, this.currentMonth, day);
        const dayData = calculateDayData(
            inputData.start,
            inputData.end,
            inputData.breakTime,
            this.hourlyWage,
            this.taxRate,
            this.decimalPlaces
        );

        updateDayDisplay(this.currentYear, this.currentMonth, day, dayData, this.decimalPlaces);

        return dayData;
    }

    /**
     * Vypočíta celkové štatistiky
     */
    calculateTotal() {
        const daysInMonth = getDaysInMonth(this.currentYear, this.currentMonth);
        const daysData = [];

        for (let i = 1; i <= daysInMonth; i++) {
            const dayData = this.calculateRow(i);
            daysData.push(dayData);
        }

        const stats = calculateTotalStats(daysData, this.decimalPlaces);
        updateTotalDisplay(stats);
    }

    /**
     * Uloží dáta s debounce
     */
    debouncedSave() {
        if (this.saveTimer) {
            clearTimeout(this.saveTimer);
        }

        this.saveTimer = setTimeout(() => {
            this.saveData();
        }, DEBOUNCE_DELAY);
    }

    /**
     * Uloží dáta do localStorage
     */
    saveData() {
        const daysInMonth = getDaysInMonth(this.currentYear, this.currentMonth);
        const data = [];

        for (let i = 1; i <= daysInMonth; i++) {
            const inputData = getDayInputData(this.currentYear, this.currentMonth, i);
            data.push(inputData);
        }

        if (!this.monthData[this.currentYear]) {
            this.monthData[this.currentYear] = {};
        }
        this.monthData[this.currentYear][this.currentMonth] = data;

        const success = saveAllData({
            monthData: this.monthData,
            hourlyWage: this.hourlyWage,
            taxRate: this.taxRate,
            isDarkMode: this.isDarkMode,
            decimalPlaces: this.decimalPlaces,
            employeeName: this.employeeName
        });

        if (success) {
            updateDataSizeDisplay();
            showSaveNotification();
        }
    }

    /**
     * Handler pre zmenu času
     */
    handleTimeInput(day, type) {
        const id = createDayElementId(this.currentYear, this.currentMonth, day, type);
        const input = document.getElementById(id);

        if (!input) return;

        // Formátovanie vstupu
        const formatted = formatTimeInput(input.value);
        input.value = formatted;

        // Výpočet riadku
        this.calculateRow(day);

        // Presun na ďalšie pole pri validnom čase
        if (formatted.length === 5 && validateTimeFormat(formatted)) {
            const nextType = type === 'start' ? 'end' : 'break';
            const nextId = createDayElementId(this.currentYear, this.currentMonth, day, nextType);
            focusNextElement(nextId);
        } else if (formatted.length === 5) {
            alert("Neplatný čas. Prosím, zadajte čas vo formáte HH:MM (napr. 06:30 pre 6:30).");
            input.value = '';
        }

        this.calculateTotal();
        this.debouncedSave();
    }

    /**
     * Handler pre zmenu prestávky
     */
    handleBreakInput(day) {
        this.calculateRow(day);

        const nextDay = day + 1;
        const daysInMonth = getDaysInMonth(this.currentYear, this.currentMonth);

        if (nextDay <= daysInMonth) {
            const nextId = createDayElementId(this.currentYear, this.currentMonth, nextDay, 'start');
            focusNextElement(nextId);
        }

        this.calculateTotal();
        this.debouncedSave();
    }

    /**
     * Handler pre reset riadku
     */
    handleResetRow(day) {
        resetDayDisplay(this.currentYear, this.currentMonth, day, this.decimalPlaces);
        this.calculateTotal();
        this.debouncedSave();
    }

    /**
     * Handler pre reset všetkých dát
     */
    handleResetAll() {
        if (confirm('Ste si istý, že chcete resetovať dáta pre aktuálny mesiac? Táto akcia sa nedá vrátiť späť.')) {
            if (this.monthData[this.currentYear] && this.monthData[this.currentYear][this.currentMonth]) {
                delete this.monthData[this.currentYear][this.currentMonth];
            }

            this.createTable();
            this.calculateTotal();
            this.saveData();
        }
    }

    /**
     * Handler pre prepnutie tmavého režimu
     */
    handleToggleDarkMode() {
        this.isDarkMode = !this.isDarkMode;
        applyDarkMode(this.isDarkMode);
        saveDarkMode(this.isDarkMode);
        updateDataSizeDisplay();
    }

    /**
     * Handler pre export do PDF
     */
    handleExportPDF() {
        const totalSummary = document.getElementById('totalSalary').innerText;
        exportToPDF(this.currentYear, this.currentMonth, this.employeeName, totalSummary);
    }

    /**
     * Handler pre export do Excelu
     */
    handleExportExcel() {
        exportToExcel(this.currentYear, this.currentMonth, this.employeeName);
    }

    /**
     * Handler pre odoslanie PDF
     */
    handleSendPDF() {
        const totalSummary = document.getElementById('totalSalary').innerText;
        sendPDF(this.currentYear, this.currentMonth, this.employeeName, totalSummary);
    }

    /**
     * Handler pre import z Excelu
     */
    handleImportExcel() {
        importFromExcel(
            this.currentYear,
            this.currentMonth,
            (importedData) => {
                // Úspešný import
                this.employeeName = importedData.employeeName;
                setInputValue('employeeNameInput', this.employeeName);

                // Uloženie importovaných dát
                if (!this.monthData[this.currentYear]) {
                    this.monthData[this.currentYear] = {};
                }
                this.monthData[this.currentYear][this.currentMonth] = importedData.daysData;

                // Obnovenie tabuľky
                this.createTable();
                this.calculateTotal();
                this.saveData();

                alert('Dáta boli úspešne importované z Excelu.');
            },
            (error) => {
                // Chyba pri importe
                console.error('Chyba pri importe:', error);
                alert(`Chyba pri importe dát z Excelu: ${error.message}`);
            }
        );
    }

    /**
     * Handler pre zmenu mesiaca
     */
    handleMonthChange() {
        this.currentMonth = parseInt(document.getElementById('monthSelect').value);
        console.log(`Zmena mesiaca: ${getMonthName(this.currentMonth)}`);
        this.createTable();
        this.calculateTotal();
    }

    /**
     * Handler pre zmenu roka
     */
    handleYearChange() {
        this.currentYear = parseInt(document.getElementById('yearSelect').value);
        console.log(`Zmena roka: ${this.currentYear}`);
        this.createTable();
        this.calculateTotal();
    }

    /**
     * Handler pre zmenu počtu desatinných miest
     */
    handleDecimalPlacesChange() {
        this.decimalPlaces = parseInt(document.getElementById('decimalPlacesSelect').value);
        console.log(`Zmena desatinných miest: ${this.decimalPlaces}`);

        const daysInMonth = getDaysInMonth(this.currentYear, this.currentMonth);
        for (let i = 1; i <= daysInMonth; i++) {
            this.calculateRow(i);
        }

        this.calculateTotal();
        this.debouncedSave();
    }

    /**
     * Handler pre zmenu mena pracovníka
     */
    handleEmployeeNameChange() {
        this.employeeName = document.getElementById('employeeNameInput').value.trim();
        console.log(`Zmena mena pracovníka: ${this.employeeName}`);
        this.debouncedSave();
    }

    /**
     * Handler pre zmenu nastavení (mzda, dane)
     */
    handleSettingsChange() {
        this.hourlyWage = parseFloat(document.getElementById('hourlyWageInput').value);
        this.taxRate = parseFloat(document.getElementById('taxRateInput').value) / 100;
        console.log(`Zmena nastavení: mzda=${this.hourlyWage}, dane=${this.taxRate * 100}%`);

        const daysInMonth = getDaysInMonth(this.currentYear, this.currentMonth);
        for (let i = 1; i <= daysInMonth; i++) {
            this.calculateRow(i);
        }

        this.calculateTotal();
        this.debouncedSave();
    }
}

// Spustenie aplikácie po načítaní DOM
document.addEventListener('DOMContentLoaded', () => {
    const app = new BrunosCalculator();
    app.init();
});
