#!/usr/bin/env python3
"""Generovanie PWA ikon s fialovým pozadím a bielym B"""

from PIL import Image, ImageDraw, ImageFont
import os

def create_rounded_rectangle_mask(size, radius):
    """Vytvorí masku pre zaoblené rohy"""
    mask = Image.new('L', (size, size), 0)
    draw = ImageDraw.Draw(mask)
    draw.rounded_rectangle([(0, 0), (size, size)], radius=radius, fill=255)
    return mask

def generate_icon(size, filename):
    """Vygeneruje ikonu danej veľkosti"""
    # Vytvorenie obrázka s fialovým pozadím
    img = Image.new('RGB', (size, size), '#7B2CBF')
    draw = ImageDraw.Draw(img)

    # Aplikovanie zaoblených rohov
    radius = size // 8
    mask = create_rounded_rectangle_mask(size, radius)

    # Vytvorenie výsledného obrázka so zaoblenými rohmi
    output = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    output.paste(img, (0, 0))
    output.putalpha(mask)

    # Pridanie bieleho textu "B"
    try:
        # Pokus o použitie systémového fontu
        font_size = int(size * 0.625)
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", font_size)
    except:
        # Fallback na default font
        font = ImageFont.load_default()

    # Vykreslenie textu
    text = "B"

    # Získanie veľkosti textu
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]

    # Vycentrovanie textu
    position = ((size - text_width) // 2 - bbox[0],
                (size - text_height) // 2 - bbox[1])

    # Vytvorenie nového draw objektu pre output
    draw_output = ImageDraw.Draw(output)
    draw_output.text(position, text, fill='white', font=font)

    # Uloženie
    output.save(filename, 'PNG')
    print(f"✓ Vytvorené: {filename}")

# Generovanie ikon
try:
    os.chdir('/home/user/brunos-calculator')
    generate_icon(192, 'icon-192.png')
    generate_icon(512, 'icon-512.png')
    print("\n✓ Všetky ikony úspešne vygenerované!")
except Exception as e:
    print(f"Chyba: {e}")
    print("Skúste otvoriť generate-icons.html v prehliadači.")
