/**
 * Modul pre export funkcionalitu (PDF, Excel)
 */

import { PDF_SETTINGS } from './constants.js';
import { getDaysInMonth, getDayName, getMonthName } from './calculator.js';
import { getInputValue, getTextContent, createDayElementId } from './ui.js';
import { showError, showInfo } from './toast.js';

/**
 * Zozbiera dáta z tabuľky pre export
 */
function collectTableData(year, month, employeeName, includeEmptyRows = false) {
    const daysInMonth = getDaysInMonth(year, month);
    const tableData = [];

    for (let i = 1; i <= daysInMonth; i++) {
        const dayName = getDayName(year, month, i);
        const startTime = getInputValue(createDayElementId(year, month, i, 'start'));
        const endTime = getInputValue(createDayElementId(year, month, i, 'end'));
        const breakTime = getInputValue(createDayElementId(year, month, i, 'break'));
        const totalTime = getTextContent(createDayElementId(year, month, i, 'total'));
        const grossSalary = getInputValue(createDayElementId(year, month, i, 'gross'));
        const netSalary = getInputValue(createDayElementId(year, month, i, 'net'));

        // Pridaj riadok len ak má nejaké dáta, alebo ak chceme všetky riadky
        if (includeEmptyRows || startTime || endTime || breakTime) {
            tableData.push({
                day: `Deň ${i} (${dayName})`,
                startTime,
                endTime,
                breakTime,
                totalTime,
                grossSalary,
                netSalary
            });
        }
    }

    return {
        employeeName,
        tableData,
        monthName: getMonthName(month),
        year
    };
}

/**
 * Vytvorí PDF dokument z dát
 */
function createPDFDocument(data) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Nastavenie písma
    doc.addFont('https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf', PDF_SETTINGS.FONT_NAME, 'normal');
    doc.setFont(PDF_SETTINGS.FONT_NAME);

    // Hlavička
    doc.setFontSize(PDF_SETTINGS.TITLE_FONT_SIZE);
    doc.text(`Bruno's Calculator - Výkaz práce (${data.monthName} ${data.year})`, PDF_SETTINGS.MARGIN_X, PDF_SETTINGS.TITLE_Y);

    // Meno pracovníka
    doc.setFontSize(PDF_SETTINGS.SUBTITLE_FONT_SIZE);
    doc.text(`Meno pracovníka: ${data.employeeName}`, PDF_SETTINGS.MARGIN_X, PDF_SETTINGS.SUBTITLE_Y);

    // Tabuľka
    const tableBody = data.tableData.map(row => [
        row.day,
        row.startTime,
        row.endTime,
        row.breakTime,
        row.totalTime,
        row.grossSalary,
        row.netSalary
    ]);

    doc.autoTable({
        head: [['Deň', 'Príchod', 'Odchod', 'Prestávka', 'Odpracované', 'Hrubá Mzda (€)', 'Čistá Mzda (€)']],
        body: tableBody,
        startY: PDF_SETTINGS.TABLE_START_Y,
        styles: { font: PDF_SETTINGS.FONT_NAME },
        headStyles: {
            fillColor: PDF_SETTINGS.HEADER_COLOR,
            textColor: 255
        },
        alternateRowStyles: {
            fillColor: PDF_SETTINGS.ALT_ROW_COLOR
        },
        margin: { top: PDF_SETTINGS.MARGIN_TOP }
    });

    return doc;
}

/**
 * Exportuje dáta do PDF súboru
 */
export function exportToPDF(year, month, employeeName, totalSummary) {
    try {
        const data = collectTableData(year, month, employeeName, false);
        const doc = createPDFDocument(data);

        // Pridanie súčtov
        const totalY = doc.lastAutoTable.finalY + 10;
        doc.setFontSize(PDF_SETTINGS.BODY_FONT_SIZE);
        doc.text(totalSummary, PDF_SETTINGS.MARGIN_X, totalY);

        // Uloženie súboru
        const filename = `brunos-calculator-report-${data.monthName}-${data.year}.pdf`;
        doc.save(filename);

        // removed for production
        return true;
    } catch (error) {
        // removed for production
        showError('Nastala chyba pri exporte do PDF.');
        return false;
    }
}

/**
 * Exportuje dáta do Excel súboru
 */
export function exportToExcel(year, month, employeeName) {
    try {
        const data = collectTableData(year, month, employeeName, true);

        // Príprava dát pre Excel
        const excelData = [
            [`Meno pracovníka: ${data.employeeName}`],
            [],
            ['Deň', 'Príchod', 'Odchod', 'Prestávka', 'Odpracované', 'Hrubá Mzda (€)', 'Čistá Mzda (€)']
        ];

        data.tableData.forEach(row => {
            excelData.push([
                row.day,
                row.startTime,
                row.endTime,
                row.breakTime,
                row.totalTime,
                row.grossSalary,
                row.netSalary
            ]);
        });

        // Vytvorenie workbooku
        const ws = XLSX.utils.aoa_to_sheet(excelData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Výkaz práce");

        // Uloženie súboru
        const filename = `brunos-calculator-report-${data.monthName}-${data.year}.xlsx`;
        XLSX.writeFile(wb, filename);

        // removed for production
        return true;
    } catch (error) {
        // removed for production
        showError('Nastala chyba pri exporte do Excelu.');
        return false;
    }
}

/**
 * Odošle PDF cez Web Share API
 */
export function sendPDF(year, month, employeeName, totalSummary) {
    try {
        const data = collectTableData(year, month, employeeName, false);
        const doc = createPDFDocument(data);

        // Pridanie súčtov
        const totalY = doc.lastAutoTable.finalY + 10;
        doc.setFontSize(PDF_SETTINGS.BODY_FONT_SIZE);
        doc.text(totalSummary, PDF_SETTINGS.MARGIN_X, totalY);

        // Vytvorenie Blob a File objektu
        const pdfBlob = doc.output('blob');
        const filename = `brunos-calculator-report-${data.monthName}-${data.year}.pdf`;
        const pdfFile = new File([pdfBlob], filename, { type: 'application/pdf' });

        // Kontrola podpory Web Share API
        if (navigator.canShare && navigator.canShare({ files: [pdfFile] })) {
            navigator.share({
                files: [pdfFile],
                title: `Bruno's Calculator Report`,
                text: `Pozrite si výkaz práce za ${data.monthName} ${data.year}`
            })
            .then(() => {
                // removed for production
            })
            .catch(error => {
                // removed for production
                showError('Nastala chyba pri odosielaní PDF.');
            });
            return true;
        } else {
            showInfo('Funkcia zdieľania súborov nie je podporovaná vo vašom prehliadači.');
            return false;
        }
    } catch (error) {
        // removed for production
        showError('Nastala chyba pri vytváraní PDF.');
        return false;
    }
}

/**
 * Importuje dáta z Excel súboru
 */
export function importFromExcel(year, month, onSuccess, onError) {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.xlsx, .xls';

    fileInput.onchange = (event) => {
        const file = event.target.files[0];
        if (!file) {
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });

                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];
                const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

                // removed for production

                // Validácia dát
                if (jsonData.length < 4) {
                    throw new Error('Excel súbor neobsahuje dostatok údajov.');
                }

                // Načítanie mena pracovníka
                const employeeNameRow = jsonData[0];
                if (!employeeNameRow[0] || !employeeNameRow[0].toString().startsWith('Meno pracovníka:')) {
                    throw new Error('Excel súbor má nesprávnu štruktúru alebo chýba meno pracovníka.');
                }

                const importedEmployeeName = employeeNameRow[0].toString().replace('Meno pracovníka: ', '').trim();

                // Validácia hlavičiek
                const headers = jsonData[2];
                const expectedHeaders = ['Deň', 'Príchod', 'Odchod', 'Prestávka', 'Odpracované', 'Hrubá Mzda (€)', 'Čistá Mzda (€)'];
                const isValid = expectedHeaders.every((header, index) => header === jsonData[2][index]);

                if (!isValid) {
                    throw new Error('Excel súbor má nesprávnu štruktúru hlavičiek.');
                }

                // Spracovanie dátových riadkov
                const daysInMonth = getDaysInMonth(year, month);
                const importedData = Array.from({ length: daysInMonth }, () => ({
                    start: '',
                    end: '',
                    breakTime: '',
                    gross: '0.00',
                    net: '0.00'
                }));

                for (let i = 3; i < jsonData.length; i++) {
                    const row = jsonData[i];
                    if (row.length < 7) {
                        // removed for production
                        continue;
                    }

                    const dayInfo = row[0];
                    const dayMatch = dayInfo.toString().match(/(?:Deň )?(\d+) \((.+)\)/);
                    if (!dayMatch) {
                        // removed for production
                        continue;
                    }

                    const day = parseInt(dayMatch[1]);
                    if (isNaN(day) || day < 1 || day > daysInMonth) {
                        // removed for production
                        continue;
                    }

                    importedData[day - 1] = {
                        start: row[1] || '',
                        end: row[2] || '',
                        breakTime: row[3] || '',
                        gross: parseFloat(row[5]) ? parseFloat(row[5]).toFixed(2) : '0.00',
                        net: parseFloat(row[6]) ? parseFloat(row[6]).toFixed(2) : '0.00'
                    };
                }

                // Callback s úspešne načítanými dátami
                if (onSuccess) {
                    onSuccess({
                        employeeName: importedEmployeeName,
                        daysData: importedData
                    });
                }

                // removed for production
            } catch (error) {
                // removed for production
                if (onError) {
                    onError(error);
                } else {
                    showError(`Chyba pri importe dát z Excelu: ${error.message}`);
                }
            }
        };

        reader.readAsArrayBuffer(file);
    };

    fileInput.click();
}
