import React, { useState, useEffect, useRef } from 'react';
import { FaTimes, FaCheck } from 'react-icons/fa';

interface ColorPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onColorSelect: (color: { hex: string; name: string }) => void;
  currentColor: { hex: string; name: string };
}

const ColorPicker: React.FC<ColorPickerProps> = ({ isOpen, onClose, onColorSelect, currentColor }) => {
  const [color, setColor] = useState(currentColor.hex);
  const [colorName, setColorName] = useState(currentColor.name);
  const [hue, setHue] = useState(0);
  const [saturation, setSaturation] = useState(100);
  const [lightness, setLightness] = useState(50);
  const [alpha, setAlpha] = useState(1);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDragging = useRef(false);
  const dragType = useRef<'main' | 'hue' | 'alpha' | null>(null);

  // Predefined colors
  const predefinedColors = [
    { hex: '#006666', name: 'Dark Teal' },
    { hex: '#00CCCC', name: 'Light Teal' },
    { hex: '#FFD700', name: 'Golden Yellow' },
    { hex: '#FFA500', name: 'Light Orange' },
    { hex: '#FF7F50', name: 'Coral' },
    { hex: '#FF0000', name: 'Red' },
    { hex: '#000080', name: 'Dark Blue' },
    { hex: '#0000FF', name: 'Medium Blue' },
    { hex: '#0080FF', name: 'Bright Blue' },
    { hex: '#87CEEB', name: 'Light Blue' },
    { hex: '#00FFFF', name: 'Light Cyan' },
    { hex: '#87CEFA', name: 'Light Sky Blue' }
  ];

  // Convert HSL to Hex
  const hslToHex = (h: number, s: number, l: number): string => {
    h = h / 360;
    s = s / 100;
    l = l / 100;

    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h * 6) % 2 - 1));
    const m = l - c / 2;
    let r = 0, g = 0, b = 0;

    if (0 <= h && h < 1) {
      r = c; g = x; b = 0;
    } else if (1 <= h && h < 2) {
      r = x; g = c; b = 0;
    } else if (2 <= h && h < 3) {
      r = 0; g = c; b = x;
    } else if (3 <= h && h < 4) {
      r = 0; g = x; b = c;
    } else if (4 <= h && h < 5) {
      r = x; g = 0; b = c;
    } else if (5 <= h && h < 6) {
      r = c; g = 0; b = x;
    }

    const rHex = Math.round((r + m) * 255).toString(16).padStart(2, '0');
    const gHex = Math.round((g + m) * 255).toString(16).padStart(2, '0');
    const bHex = Math.round((b + m) * 255).toString(16).padStart(2, '0');

    return `#${rHex}${gHex}${bHex}`;
  };

  // Convert Hex to HSL
  const hexToHsl = (hex: string): { h: number; s: number; l: number } => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return { h: h * 360, s: s * 100, l: l * 100 };
  };

  // Update color when HSL changes
  useEffect(() => {
    const newHex = hslToHex(hue, saturation, lightness);
    setColor(newHex);
  }, [hue, saturation, lightness]);

  // Update HSL when color changes externally
  useEffect(() => {
    if (currentColor.hex !== color) {
      const hsl = hexToHsl(currentColor.hex);
      setHue(hsl.h);
      setSaturation(hsl.s);
      setLightness(hsl.l);
      setColor(currentColor.hex);
      setColorName(currentColor.name);
    }
  }, [currentColor]);

  // Draw main color area
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Create gradient
    const gradient = ctx.createLinearGradient(0, 0, width, 0);
    gradient.addColorStop(0, 'white');
    gradient.addColorStop(1, `hsl(${hue}, 100%, 50%)`);

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Add black to white gradient overlay
    const overlayGradient = ctx.createLinearGradient(0, 0, 0, height);
    overlayGradient.addColorStop(0, 'transparent');
    overlayGradient.addColorStop(1, 'black');

    ctx.fillStyle = overlayGradient;
    ctx.fillRect(0, 0, width, height);
  }, [hue]);

  const handleMainAreaClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const width = rect.width;
    const height = rect.height;
    
    const newSaturation = Math.round((x / width) * 100);
    const newLightness = Math.round(((height - y) / height) * 100);
    
    setSaturation(Math.max(0, Math.min(100, newSaturation)));
    setLightness(Math.max(0, Math.min(100, newLightness)));
  };

  const handleMainAreaMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isDragging.current = true;
    dragType.current = 'main';
    handleMainAreaClick(e);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging.current || !canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    
    if (dragType.current === 'main') {
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const width = rect.width;
      const height = rect.height;
      
      const newSaturation = Math.round((x / width) * 100);
      const newLightness = Math.round(((height - y) / height) * 100);
      
      setSaturation(Math.max(0, Math.min(100, newSaturation)));
      setLightness(Math.max(0, Math.min(100, newLightness)));
    }
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    dragType.current = null;
  };

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-card rounded-lg p-6 max-w-md w-full mx-4 border border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Choose Color</h3>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <FaTimes />
          </button>
        </div>
        
        <div className="space-y-4">
          {/* Main Color Selection Area */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Color Selection</label>
            <div className="relative">
              <canvas
                ref={canvasRef}
                width={300}
                height={200}
                className="w-full h-48 rounded-lg cursor-crosshair border border-border"
                onClick={handleMainAreaClick}
                onMouseDown={handleMainAreaMouseDown}
              />
              {/* Color selector indicator */}
              <div
                className="absolute w-3 h-3 border-2 border-white rounded-full pointer-events-none shadow-lg"
                style={{
                  left: `${(saturation / 100) * 100}%`,
                  top: `${((100 - lightness) / 100) * 100}%`,
                  transform: 'translate(-50%, -50%)'
                }}
              />
            </div>
          </div>

          {/* Hue Slider */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Hue</label>
            <div className="relative">
              <div className="h-8 rounded-lg bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 border border-border">
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={hue}
                  onChange={(e) => setHue(parseInt(e.target.value))}
                  className="w-full h-full opacity-0 cursor-pointer"
                />
                <div
                  className="absolute top-1/2 w-4 h-4 bg-white rounded-full border-2 border-white shadow-lg pointer-events-none transform -translate-y-1/2"
                  style={{ left: `${(hue / 360) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Alpha Slider */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Opacity</label>
            <div className="relative">
              <div 
                className="h-8 rounded-lg border border-border"
                style={{
                  background: `linear-gradient(to right, transparent 0%, ${color} 100%)`,
                  backgroundImage: `repeating-conic-gradient(#ccc 0deg 90deg, transparent 90deg 180deg)`
                }}
              >
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={alpha}
                  onChange={(e) => setAlpha(parseFloat(e.target.value))}
                  className="w-full h-full opacity-0 cursor-pointer"
                />
                <div
                  className="absolute top-1/2 w-4 h-4 bg-white rounded-full border-2 border-white shadow-lg pointer-events-none transform -translate-y-1/2"
                  style={{ left: `${alpha * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Selected Color Preview and Name Input */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Color</label>
              <div className="flex items-center space-x-3">
                <div
                  className="w-12 h-12 rounded-full border-2 border-border shadow-sm"
                  style={{ backgroundColor: color }}
                />
                <input
                  type="text"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="flex-1 px-3 py-2 border border-border rounded-md bg-input text-foreground font-mono text-sm"
                  placeholder="#000000"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Color Name</label>
              <input
                type="text"
                value={colorName}
                onChange={(e) => setColorName(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground"
                placeholder="e.g., Deep Blue"
              />
            </div>
          </div>

          {/* Predefined Colors */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Predefined Colors</label>
            <div className="grid grid-cols-6 gap-2">
              {predefinedColors.map((colorOption) => (
                <button
                  key={colorOption.hex}
                  onClick={() => {
                    setColor(colorOption.hex);
                    setColorName(colorOption.name);
                    const hsl = hexToHsl(colorOption.hex);
                    setHue(hsl.h);
                    setSaturation(hsl.s);
                    setLightness(hsl.l);
                  }}
                  className="w-8 h-8 rounded-full border-2 border-border hover:border-primary transition-colors shadow-sm"
                  style={{ backgroundColor: colorOption.hex }}
                  title={colorOption.name}
                />
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-border rounded-md text-muted-foreground hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onColorSelect({ hex: color, name: colorName });
                onClose();
              }}
              className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors flex items-center justify-center space-x-2"
            >
              <FaCheck />
              <span>Select Color</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColorPicker;
