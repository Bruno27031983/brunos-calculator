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
- 🛡️ **MAXIMÁLNA OCHRANA DÁT:**
  - Multi-level backup systém (localStorage + IndexedDB)
  - **Persistent Storage API** - Trvalé úložisko (nebude automaticky vymazané)
  - Automatické zálohovanie každých 5 minút
  - Manuálne zálohy na požiadanie
  - Export/Import záloh do JSON súborov
  - Obnovenie dát z ktorejkoľvek zálohy
  - Ochrana pred stratou dát pri zatvorení prehliadača
  - Prvotná záloha pri štarte aplikácie
  - Monitoring dostupného miesta a varovania

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
│       ├── ui.js          # UI a DOM manipulácia
│       ├── export.js      # Export do PDF/Excel
│       ├── indexeddb.js   # IndexedDB wrapper
│       ├── backup.js      # Multi-level backup systém
│       └── persistence.js # Persistent Storage API
├── .gitignore
└── README.md
```

## Technológie

- **HTML5** - Sémantická štruktúra
- **CSS3** - Moderný dizajn s animáciami
- **JavaScript ES6+** - Modulárna architektúra
- **jsPDF** - Generovanie PDF dokumentov
- **SheetJS (XLSX)** - Práca s Excel súbormi
- **LocalStorage API** - Primárne lokálne úložisko
- **IndexedDB API** - Sekundárne úložisko s väčšou kapacitou
- **Persistent Storage API** - Trvalé úložisko (ochrana pred automatickým mazaním)
- **Storage Estimation API** - Monitoring dostupného miesta
- **Web Share API** - Zdieľanie súborov
- **Beforeunload API** - Ochrana pred stratou dát

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

8. **IndexedDB modul**
   - Wrapper pre IndexedDB API
   - Asynchronné operácie
   - Error handling

9. **Backup modul**
   - Multi-level zálohovací systém
   - Automatické a manuálne zálohy
   - Recovery mechanizmy
   - Export/Import do súborov

10. **Persistence modul**
   - Persistent Storage API wrapper
   - Žiadosť o trvalé úložisko
   - Monitoring dostupného miesta
   - Varovania pri kritickom stave

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

## 🛡️ Systém ochrany a zálohovania dát

Aplikácia obsahuje **maximálne zabezpečenie proti strate dát** s multi-level backup systémom:

### Vrstvy ochrany:

1. **Primárne úložisko:** localStorage (rýchle, 5-10 MB limit)
2. **Sekundárne úložisko:** IndexedDB (väčšia kapacita, 50+ MB)
3. **Persistent Storage:** Trvalé úložisko (nebude automaticky vymazané prehliadačom)
4. **Súborové zálohy:** Export do JSON súborov (neobmedzené)

### Automatické zálohovanie:

- ✅ **Prvotná záloha** pri štarte aplikácie
- ✅ **Periodické zálohovanie** každých 5 minút
- ✅ **Limit záloh:** Max 10 automatických záloh (staršie sa automaticky mažú)
- ✅ **Redundancia:** Dáta sa ukladajú do localStorage **A** IndexedDB súčasne

### Ochrana pred stratou:

- 🛡️ **Beforeunload ochrana:** Varovanie pri zatvorení stránky s neuloženými zmenami
- 🛡️ **Multi-storage:** Ak zlyhá localStorage, použije sa IndexedDB
- 🛡️ **Safety backup:** Pred obnovením zálohy sa vytvára bezpečnostná kópia

### Manuálne operácie:

#### 1. Vytvorenie manuálnej zálohy
```
Kliknite: 💾 Vytvoriť zálohu
```
Vytvorí trvalú zálohu v localStorage a IndexedDB.

#### 2. Export zálohy do súboru
```
Kliknite: 📥 Exportovať zálohu
```
Stiahne JSON súbor s kompletnou zálohou všetkých dát.

#### 3. Import zálohy zo súboru
```
Kliknite: 📤 Importovať zálohu
```
Obnoví dáta z predtým exportovaného JSON súboru.

#### 4. Zobrazenie a obnovenie záloh
```
Kliknite: 📋 Zobraziť zálohy
```
Ukáže zoznam všetkých dostupných záloh s možnosťou obnovenia.

#### 5. Informácie o úložisku
```
Kliknite: 💽 Info o úložisku
```
Zobrazí:
- ✅/⚠️ Status trvalého úložiska (Persistent Storage)
- 📊 Využitie úložiska (použité/dostupné/kvóta)
- ⚠️ Varovania pri kritickom stave úložiska

### Štatistiky záloh:

Pri zobrazení záloh uvidíte:
- 📊 Celkový počet záloh
- 🔄 Počet automatických záloh
- 📝 Počet manuálnych záloh
- 💾 Celková veľkosť dát
- 📍 Umiestnenie (localStorage/IndexedDB)
- 📅 Dátum a čas vytvorenia každej zálohy

### Príklad použitia backup API:

```javascript
import { saveBackup, restoreFromBackup, listBackups } from './modules/backup.js';

// Vytvorenie zálohy
const data = {
  monthData: {...},
  hourlyWage: 10,
  // ... ostatné dáta
};

await saveBackup(data, 'my_backup');

// Zobrazenie záloh
const backups = await listBackups();
console.log(backups);

// Obnovenie zálohy
const result = await restoreFromBackup('backup_name');
if (result.success) {
  console.log('Dáta obnovené!');
}
```

### 🔒 Persistent Storage - Trvalé úložisko

Aplikácia automaticky požiada prehliadač o **Persistent Storage**, čo znamená:

**Čo to znamená?**
- 🛡️ **Ochrana pred automatickým vymazaním** - Prehliadač nebude automaticky mazať vaše dáta pri nedostatku miesta
- ✅ **Trvalé uloženie** - Dáta zostanú aj po reštarte prehliadača
- 🔐 **Priorita** - Vaše dáta budú mať vyššiu prioritu než dočasné dáta

**Kedy je Persistent Storage povolené?**
- ✅ Používateľ má stránku v záložkách
- ✅ Stránka je často navštevovaná
- ✅ Používateľ manuálne povolí notifikácie
- ✅ Aplikácia je nainštalovaná ako PWA

**Kontrola statusu:**
```
Kliknite: 💽 Info o úložisku
```

Zobrazí sa:
```
💾 INFORMÁCIE O ÚLOŽISKU

✅ Trvalé úložisko: AKTÍVNE
   Dáta sú chránené proti automatickému vymazaniu

📊 Využitie úložiska:
   Použité: 2.45 MB
   Dostupné: 1024.55 MB
   Kvóta: 1027.00 MB
   Využitie: 0.24%
```

**Ak nie je povolené:**
- Aplikácia stále funguje normálne
- Dáta sú uložené, ale môžu byť vymazané pri nedostatku miesta
- Odporúčame pravidelné exporty do JSON súborov

### Odporúčania:

1. **Pravidelne exportujte** zálohy do JSON súborov (raz týždenne)
2. **Uchovávajte súbory** na bezpečnom mieste (cloud, USB)
3. **Testujte obnovu** zálohy občas pre istotu
4. **Neodstraňujte** browser dáta bez exportu zálohy
5. **Kontrolujte úložisko** pomocou "💽 Info o úložisku" občas

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
