#!/usr/bin/env python3
# -*- coding: utf-8 -*-
#
#  getValuePixel.py
#  
#  Copyright 2017 Omar Ernesto Cabrera Rosero <omar@omar-asus>
#  
#  This program is free software; you can redistribute it and/or modify
#  it under the terms of the GNU General Public License as published by
#  the Free Software Foundation; either version 2 of the License, or
#  (at your option) any later version.
#  
#  This program is distributed in the hope that it will be useful,
#  but WITHOUT ANY WARRANTY; without even the implied warranty of
#  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#  GNU General Public License for more details.
#  
#  You should have received a copy of the GNU General Public License
#  along with this program; if not, write to the Free Software
#  Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,
#  MA 02110-1301, USA.
#  
#  

from PIL import Image
mapPreserve = Image.open('Lekagul Roadways.bmp').convert('RGB')

gate = 0
entrance = 0
generalGate = 0
rangerStop = 0
camping =0
print('x y gate-name')
for x in range(0, 200):
    for y in range(0, 200):
        pixel = mapPreserve.getpixel((x,y))
        if pixel==(255,255,255):
            print(x, 200-y, 'road')
        if pixel==(255,0,0):
            print(x, 200-y, 'gate{0}'.format(gate))
            gate+=1
        if pixel==(76,255,0):
            print(x, 200-y, 'entrance{0}'.format(entrance))
            entrance+=1
        if pixel==(0,255,255):
            print(x, 200-y, 'general-gate{0}'.format(generalGate))
            generalGate+=1
        if pixel==(255,216,0):
            print(x, 200-y, 'ranger-stop{0}'.format(rangerStop))
            rangerStop+=1
        if pixel==(255,106,0):
            print(x, 200-y, 'camping{0}'.format(camping))
            camping+=1	
        if pixel==(255,0,220):
            print(x, 200-y, 'ranger-base')
				
def main():
	
	return 0

if __name__ == '__main__':
	main()

