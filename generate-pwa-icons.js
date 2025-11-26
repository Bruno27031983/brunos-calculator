#!/usr/bin/env node

// Generovanie PWA ikon pomocou Canvas API
const fs = require('fs');
const { createCanvas } = require('canvas');

function generateIcon(size, filename) {
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');

    // Fialové pozadie so zaoblenými rohmi
    ctx.fillStyle = '#7B2CBF';
    roundRect(ctx, 0, 0, size, size, size / 8);
    ctx.fill();

    // Veľké biele B v strede
    ctx.fillStyle = 'white';
    ctx.font = `bold ${size * 0.625}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('B', size / 2, size / 2);

    // Uloženie do PNG súboru
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(filename, buffer);
    console.log(`✓ Vytvorené: ${filename}`);
}

function roundRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
}

// Generovanie oboch ikon
try {
    generateIcon(192, 'icon-192.png');
    generateIcon(512, 'icon-512.png');
    console.log('\n✓ Všetky ikony úspešne vygenerované!');
} catch (error) {
    console.error('Chyba pri generovaní ikon:', error.message);
    console.log('\nPokúsim sa použiť alternatívnu metódu...');

    // Alternatívna metóda bez canvas package
    const { exec } = require('child_process');
    console.log('Otvor generate-icons.html v prehliadači a stiahni ikony manuálne.');
    process.exit(1);
}
