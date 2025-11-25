/**
 * Modul pre validáciu a sanitizáciu vstupov
 */

/**
 * Sanitizuje text - odstraňuje potenciálne nebezpečné znaky
 */
export function sanitizeText(text) {
    if (typeof text !== 'string') {
        return '';
    }

    // Odstránenie nebezpečných znakov
    return text
        .trim()
        .replace(/[<>]/g, '') // Odstránenie < a > pre XSS ochranu
        .replace(/[\x00-\x1F\x7F]/g, '') // Odstránenie control characters
        .substring(0, 255); // Limit 255 znakov
}

/**
 * Sanitizuje meno zamestnanca
 */
export function sanitizeEmployeeName(name) {
    if (typeof name !== 'string') {
        return '';
    }

    // Povoliť len písmená, číslice, medzery, a základné interpunkciu
    return name
        .trim()
        .replace(/[<>{}[\]\\]/g, '') // Odstránenie potenciálne nebezpečných znakov
        .replace(/\s+/g, ' ') // Normalizácia medzier
        .substring(0, 100); // Max 100 znakov pre meno
}

/**
 * Validuje hodinovú mzdu
 */
export function validateHourlyWage(wage) {
    const num = parseFloat(wage);

    if (isNaN(num)) {
        return { valid: false, error: 'Hodinová mzda musí byť číslo' };
    }

    if (num < 0) {
        return { valid: false, error: 'Hodinová mzda nemôže byť záporná' };
    }

    if (num > 1000) {
        return { valid: false, error: 'Hodinová mzda je príliš vysoká (max 1000 €)' };
    }

    return { valid: true, value: num };
}

/**
 * Validuje daňovú sadzbu
 */
export function validateTaxRate(rate) {
    const num = parseFloat(rate);

    if (isNaN(num)) {
        return { valid: false, error: 'Daňová sadzba musí byť číslo' };
    }

    if (num < 0) {
        return { valid: false, error: 'Daňová sadzba nemôže byť záporná' };
    }

    if (num > 100) {
        return { valid: false, error: 'Daňová sadzba nemôže byť väčšia ako 100%' };
    }

    return { valid: true, value: num };
}

/**
 * Validuje čas prestávky
 */
export function validateBreakTime(breakTime) {
    const num = parseFloat(breakTime);

    if (isNaN(num)) {
        return { valid: false, error: 'Prestávka musí byť číslo' };
    }

    if (num < 0) {
        return { valid: false, error: 'Prestávka nemôže byť záporná' };
    }

    if (num > 12) {
        return { valid: false, error: 'Prestávka nemôže byť viac ako 12 hodín' };
    }

    return { valid: true, value: num };
}

/**
 * Validuje formát času (HH:MM)
 */
export function validateTimeFormat(time) {
    if (!time) {
        return { valid: true, value: '' }; // Prázdny čas je OK
    }

    const timeRegex = /^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/;

    if (!timeRegex.test(time)) {
        return { valid: false, error: 'Neplatný formát času. Použite HH:MM (napr. 08:30)' };
    }

    const [hours, minutes] = time.split(':').map(Number);

    if (hours > 23) {
        return { valid: false, error: 'Hodiny musia byť 0-23' };
    }

    if (minutes > 59) {
        return { valid: false, error: 'Minúty musia byť 0-59' };
    }

    return { valid: true, value: time };
}

/**
 * Validuje rozsah pracovného času
 */
export function validateWorkingHours(startTime, endTime, breakTime = 0) {
    // Validácia formátu
    const startValidation = validateTimeFormat(startTime);
    if (!startValidation.valid) {
        return startValidation;
    }

    const endValidation = validateTimeFormat(endTime);
    if (!endValidation.valid) {
        return endValidation;
    }

    // Ak sú oba časy prázdne, je to OK
    if (!startTime && !endTime) {
        return { valid: true };
    }

    // Ak je len jeden čas zadaný, je to chyba
    if (!startTime || !endTime) {
        return { valid: false, error: 'Musíte zadať aj čas príchodu aj odchodu' };
    }

    // Konverzia na minúty
    const [startHours, startMinutes] = startTime.split(':').map(Number);
    const [endHours, endMinutes] = endTime.split(':').map(Number);

    const startMinutesTotal = startHours * 60 + startMinutes;
    let endMinutesTotal = endHours * 60 + endMinutes;

    // Podpora práce cez polnoc
    if (endMinutesTotal < startMinutesTotal) {
        endMinutesTotal += 24 * 60;
    }

    const workMinutes = endMinutesTotal - startMinutesTotal;
    const workHours = workMinutes / 60;

    // Validácia prestávky
    if (breakTime < 0) {
        return { valid: false, error: 'Prestávka nemôže byť záporná' };
    }

    if (breakTime >= workHours) {
        return { valid: false, error: 'Prestávka nemôže byť dlhšia alebo rovnaká ako pracovný čas' };
    }

    const netWorkHours = workHours - breakTime;

    // Validácia maximálneho pracovného času
    if (netWorkHours > 16) {
        return { valid: false, error: 'Pracovný čas nemôže presiahnuť 16 hodín za deň' };
    }

    if (netWorkHours < 0) {
        return { valid: false, error: 'Pracovný čas nemôže byť záporný' };
    }

    return {
        valid: true,
        workMinutes: workMinutes,
        netWorkHours: netWorkHours
    };
}

/**
 * Validuje HTML content - odstráni nebezpečné tagy a atribúty
 */
export function sanitizeHTML(html) {
    if (typeof html !== 'string') {
        return '';
    }

    // Whitelist povolených tagov (len pre text)
    const allowedTags = ['b', 'i', 'em', 'strong', 'u', 'br', 'p', 'span'];

    // Vytvorenie dočasného elementu
    const temp = document.createElement('div');
    temp.textContent = html; // textContent automaticky escapuje HTML

    return temp.innerHTML;
}

/**
 * Validuje číselný vstup v rozsahu
 */
export function validateNumberInRange(value, min, max, fieldName = 'Hodnota') {
    const num = parseFloat(value);

    if (isNaN(num)) {
        return { valid: false, error: `${fieldName} musí byť číslo` };
    }

    if (num < min) {
        return { valid: false, error: `${fieldName} nemôže byť menšia ako ${min}` };
    }

    if (num > max) {
        return { valid: false, error: `${fieldName} nemôže byť väčšia ako ${max}` };
    }

    return { valid: true, value: num };
}

/**
 * Validuje desatinné miesta
 */
export function validateDecimalPlaces(places) {
    const num = parseInt(places);

    if (isNaN(num)) {
        return { valid: false, error: 'Počet desatinných miest musí byť číslo' };
    }

    if (num < 0 || num > 4) {
        return { valid: false, error: 'Počet desatinných miest musí byť 0-4' };
    }

    return { valid: true, value: num };
}

/**
 * Escapuje špeciálne znaky pre použitie v HTML
 */
export function escapeHTML(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Validuje email adresu
 */
export function validateEmail(email) {
    if (!email) {
        return { valid: true, value: '' }; // Email je voliteľný
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        return { valid: false, error: 'Neplatný formát emailovej adresy' };
    }

    if (email.length > 254) {
        return { valid: false, error: 'Email je príliš dlhý' };
    }

    return { valid: true, value: email.toLowerCase() };
}
