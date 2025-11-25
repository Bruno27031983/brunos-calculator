# Bruno's Calculator

Webová aplikácia pre evidenciu pracovného času a výpočet miezd.

## Prehľad

Bruno's Calculator je jednoduchá, ale výkonná aplikácia určená na sledovanie pracovného času, výpočet hrubej a čistej mzdy, a export výkazov práce do PDF a Excel formátov.

## Funkcie

- ✅ Sledovanie pracovného času (príchod, odchod, prestávky)
- ✅ Automatický výpočet odpracovaných hodín
- ✅ Výpočet hrubej a čistej mzdy
- ✅ Export do PDF a Excel
- ✅ Zdieľanie výkazov cez Web Share API
- ✅ Import dát z Excel súborov
- ✅ Tmavý režim
- ✅ Lokálne uloženie dát (localStorage)
- ✅ Responsívny dizajn

## Štruktúra projektu

```
brunos-calculator/
├── index.html              # Hlavný HTML súbor
├── css/
│   └── styles.css         # Všetky štýly aplikácie
├── js/
│   ├── app.js            # Hlavný aplikačný modul
│   └── modules/
│       ├── constants.js  # Konštanty a konfigurácia
│       ├── storage.js    # Práca s localStorage
│       ├── calculator.js # Výpočtové funkcie
│       ├── ui.js        # UI a DOM manipulácia
│       └── export.js    # Export do PDF/Excel
├── .gitignore
└── README.md
```

## Technológie

- **HTML5** - Sémantická štruktúra
- **CSS3** - Moderný dizajn s animáciami
- **JavaScript ES6+** - Modulárna architektúra
- **jsPDF** - Generovanie PDF dokumentov
- **SheetJS (XLSX)** - Práca s Excel súbormi
- **LocalStorage API** - Lokálne úložisko dát
- **Web Share API** - Zdieľanie súborov

## Refaktoring a vylepšenia

### Predošlý stav
- Jeden monolitický HTML súbor (1300+ riadkov)
- Všetok kód inline (CSS aj JavaScript)
- Žiadna modulárna štruktúra
- Ťažko udržiavateľný kód

### Aktuálny stav
- Čistá modulárna architektúra
- Separácia zodpovedností (Separation of Concerns)
- Opätovne použiteľné moduly
- Lepšia čitateľnosť a udržiavateľnosť
- DRY princíp (Don't Repeat Yourself)
- Konštanty namiesto magických čísel

### Vylepšenia kvality kódu

1. **Modularizácia**
   - Rozdelenie kódu do logických modulov
   - ES6 import/export syntax
   - Každý modul má jasnú zodpovednosť

2. **Konštanty**
   - Centralizované konštanty v `constants.js`
   - Žiadne magické čísla v kóde
   - Ľahká konfigurácia

3. **Storage modul**
   - Abstrakcia nad localStorage API
   - Centralizovaná správa dát
   - Error handling

4. **Calculator modul**
   - Čisté funkcie bez side effects
   - Validácia vstupov
   - Jednotná logika výpočtov

5. **UI modul**
   - Separácia UI logiky od business logiky
   - Pomocné funkcie pre DOM manipuláciu
   - Znovupoužiteľné komponenty

6. **Export modul**
   - Izolovaná export logika
   - Podpora pre viaceré formáty
   - Callback-based architektúra

7. **App modul**
   - Hlavná aplikačná trieda
   - Event handling
   - State management
   - Lifecycle management

## Inštalácia a spustenie

### Lokálne spustenie

Keďže ide o čistú front-end aplikáciu, stačí otvoriť `index.html` v prehliadači:

```bash
# Jednoduchý HTTP server (Python 3)
python3 -m http.server 8000

# Alebo použite live-server (npm)
npx live-server
```

Potom otvorte `http://localhost:8000` v prehliadači.

### Produkčné nasadenie

Aplikáciu je možné nasadiť na:
- GitHub Pages
- Netlify
- Vercel
- Akýkoľvek statický hosting

## Použitie

1. **Zadajte meno pracovníka**
2. **Nastavte hodinovú mzdu a daňovú sadzbu**
3. **Vyberte mesiac a rok**
4. **Vyplňte časy príchodov a odchodov**
5. **Aplikácia automaticky vypočíta:**
   - Odpracované hodiny
   - Hrubú mzdu
   - Čistú mzdu
   - Celkové štatistiky

## Príklady použitia modulov

### Import modulu

```javascript
import { calculateDayData } from './modules/calculator.js';

const result = calculateDayData('08:00', '16:00', 0.5, 10, 0.02, 2);
console.log(result);
// { totalMinutes: 450, displayTime: "7h 30m (7.50 h)", grossSalary: "75.00", netSalary: "73.50" }
```

### Storage operácie

```javascript
import { saveWorkDaysData, loadWorkDaysData } from './modules/storage.js';

// Uloženie
saveWorkDaysData({ 2025: { 0: [...] } });

// Načítanie
const data = loadWorkDaysData();
```

## Kompatibilita

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobilné prehliadače (iOS Safari, Chrome Mobile)

## Licencia

Vytvoril a financoval Bruno.

## Podpora

Pre hlásenie chýb alebo návrhy na vylepšenia otvorte issue v GitHub repozitári.
