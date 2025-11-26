#!/bin/bash
echo "Otvor generate-icons.html v prehliadači a stiahni ikony pomocou tlačidiel."
echo "Alebo použi tento príkaz ak máš nainštalovaný ImageMagick:"
echo ""
echo "convert -size 192x192 xc:'#7B2CBF' -gravity center -pointsize 120 -font DejaVu-Sans-Bold -fill white -annotate +0+0 'B' -draw 'roundrectangle 0,0 191,191 24,24' icon-192.png"
echo "convert -size 512x512 xc:'#7B2CBF' -gravity center -pointsize 320 -font DejaVu-Sans-Bold -fill white -annotate +0+0 'B' -draw 'roundrectangle 0,0 511,511 64,64' icon-512.png"
