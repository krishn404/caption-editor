"use client";

import { useState, useRef, useEffect } from "react";
import { Theme } from "../hooks/useTheme";

interface Props {
  image: string;
  onClose: () => void;
  onCropComplete: (croppedImage: string) => void;
  theme: Theme;
}

type HandlePosition = 'tl' | 'tr' | 'bl' | 'br' | 't' | 'b' | 'l' | 'r' | 'move' | null;

export default function CropModal({ image, onClose, onCropComplete, theme }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeHandle, setActiveHandle] = useState<HandlePosition>(null);
  const [cropArea, setCropArea] = useState({ x: 50, y: 50, width: 500, height: 300 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 600, height: 400 });

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      imgRef.current = img;
      
      // Calculate canvas size to fit image
      const maxWidth = 800;
      const maxHeight = 500;
      let width = img.width;
      let height = img.height;
      
      if (width > maxWidth) {
        height = (maxWidth / width) * height;
        width = maxWidth;
      }
      if (height > maxHeight) {
        width = (maxHeight / height) * width;
        height = maxHeight;
      }
      
      setCanvasSize({ width, height });
      
      // Set initial crop area to full image with some padding
      const padding = 20;
      setCropArea({
        x: padding,
        y: padding,
        width: width - padding * 2,
        height: height - padding * 2
      });
      
      setImageLoaded(true);
    };
    img.src = image;
  }, [image]);

  useEffect(() => {
    if (imageLoaded) {
      drawCanvas();
    }
  }, [cropArea, imageLoaded, canvasSize]);

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvasSize.width;
    canvas.height = canvasSize.height;

    // Draw image
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    // Draw dark overlay
    ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Clear crop area to show original image
    ctx.clearRect(cropArea.x, cropArea.y, cropArea.width, cropArea.height);
    ctx.drawImage(
      img,
      (cropArea.x / canvas.width) * img.width,
      (cropArea.y / canvas.height) * img.height,
      (cropArea.width / canvas.width) * img.width,
      (cropArea.height / canvas.height) * img.height,
      cropArea.x,
      cropArea.y,
      cropArea.width,
      cropArea.height
    );

    // Draw crop border
    ctx.strokeStyle = "#FFFFFF";
    ctx.lineWidth = 2;
    ctx.strokeRect(cropArea.x, cropArea.y, cropArea.width, cropArea.height);

    // Draw corner handles
    const handleSize = 12;
    ctx.fillStyle = "#FFFFFF";
    
    // Top-left
    ctx.fillRect(cropArea.x - handleSize / 2, cropArea.y - handleSize / 2, handleSize, handleSize);
    // Top-right
    ctx.fillRect(cropArea.x + cropArea.width - handleSize / 2, cropArea.y - handleSize / 2, handleSize, handleSize);
    // Bottom-left
    ctx.fillRect(cropArea.x - handleSize / 2, cropArea.y + cropArea.height - handleSize / 2, handleSize, handleSize);
    // Bottom-right
    ctx.fillRect(cropArea.x + cropArea.width - handleSize / 2, cropArea.y + cropArea.height - handleSize / 2, handleSize, handleSize);

    // Draw edge handles (middle of each side)
    const edgeHandleSize = 8;
    ctx.fillStyle = "#FFFFFF";
    
    // Top
    ctx.fillRect(cropArea.x + cropArea.width / 2 - edgeHandleSize / 2, cropArea.y - edgeHandleSize / 2, edgeHandleSize, edgeHandleSize);
    // Bottom
    ctx.fillRect(cropArea.x + cropArea.width / 2 - edgeHandleSize / 2, cropArea.y + cropArea.height - edgeHandleSize / 2, edgeHandleSize, edgeHandleSize);
    // Left
    ctx.fillRect(cropArea.x - edgeHandleSize / 2, cropArea.y + cropArea.height / 2 - edgeHandleSize / 2, edgeHandleSize, edgeHandleSize);
    // Right
    ctx.fillRect(cropArea.x + cropArea.width - edgeHandleSize / 2, cropArea.y + cropArea.height / 2 - edgeHandleSize / 2, edgeHandleSize, edgeHandleSize);
  };

  const getHandleAtPosition = (x: number, y: number): HandlePosition => {
    const tolerance = 15;

    // Check corners first (higher priority)
    if (Math.abs(x - cropArea.x) < tolerance && Math.abs(y - cropArea.y) < tolerance) return 'tl';
    if (Math.abs(x - (cropArea.x + cropArea.width)) < tolerance && Math.abs(y - cropArea.y) < tolerance) return 'tr';
    if (Math.abs(x - cropArea.x) < tolerance && Math.abs(y - (cropArea.y + cropArea.height)) < tolerance) return 'bl';
    if (Math.abs(x - (cropArea.x + cropArea.width)) < tolerance && Math.abs(y - (cropArea.y + cropArea.height)) < tolerance) return 'br';

    // Check edges
    const midX = cropArea.x + cropArea.width / 2;
    const midY = cropArea.y + cropArea.height / 2;
    
    if (Math.abs(x - midX) < tolerance && Math.abs(y - cropArea.y) < tolerance) return 't'; // Top edge
    if (Math.abs(x - midX) < tolerance && Math.abs(y - (cropArea.y + cropArea.height)) < tolerance) return 'b'; // Bottom edge
    if (Math.abs(x - cropArea.x) < tolerance && Math.abs(y - midY) < tolerance) return 'l'; // Left edge
    if (Math.abs(x - (cropArea.x + cropArea.width)) < tolerance && Math.abs(y - midY) < tolerance) return 'r'; // Right edge

    // Check if inside crop area (for moving)
    if (
      x >= cropArea.x &&
      x <= cropArea.x + cropArea.width &&
      y >= cropArea.y &&
      y <= cropArea.y + cropArea.height
    ) {
      return 'move';
    }

    return null;
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const handle = getHandleAtPosition(x, y);
    setActiveHandle(handle);
    setDragStart({ x, y });
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !e.touches[0]) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;
    const y = e.touches[0].clientY - rect.top;

    const handle = getHandleAtPosition(x, y);
    setActiveHandle(handle);
    setDragStart({ x, y });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !activeHandle) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const deltaX = x - dragStart.x;
    const deltaY = y - dragStart.y;

    let newCropArea = { ...cropArea };

    switch (activeHandle) {
      case 'tl':
        newCropArea.x = Math.max(0, Math.min(cropArea.x + deltaX, cropArea.x + cropArea.width - 50));
        newCropArea.y = Math.max(0, Math.min(cropArea.y + deltaY, cropArea.y + cropArea.height - 50));
        newCropArea.width = cropArea.width - (newCropArea.x - cropArea.x);
        newCropArea.height = cropArea.height - (newCropArea.y - cropArea.y);
        break;
      case 'tr':
        newCropArea.y = Math.max(0, Math.min(cropArea.y + deltaY, cropArea.y + cropArea.height - 50));
        newCropArea.width = Math.max(50, Math.min(cropArea.width + deltaX, canvas.width - cropArea.x));
        newCropArea.height = cropArea.height - (newCropArea.y - cropArea.y);
        break;
      case 'bl':
        newCropArea.x = Math.max(0, Math.min(cropArea.x + deltaX, cropArea.x + cropArea.width - 50));
        newCropArea.width = cropArea.width - (newCropArea.x - cropArea.x);
        newCropArea.height = Math.max(50, Math.min(cropArea.height + deltaY, canvas.height - cropArea.y));
        break;
      case 'br':
        newCropArea.width = Math.max(50, Math.min(cropArea.width + deltaX, canvas.width - cropArea.x));
        newCropArea.height = Math.max(50, Math.min(cropArea.height + deltaY, canvas.height - cropArea.y));
        break;
      case 't': // Top edge
        newCropArea.y = Math.max(0, Math.min(cropArea.y + deltaY, cropArea.y + cropArea.height - 50));
        newCropArea.height = cropArea.height - (newCropArea.y - cropArea.y);
        break;
      case 'b': // Bottom edge
        newCropArea.height = Math.max(50, Math.min(cropArea.height + deltaY, canvas.height - cropArea.y));
        break;
      case 'l': // Left edge
        newCropArea.x = Math.max(0, Math.min(cropArea.x + deltaX, cropArea.x + cropArea.width - 50));
        newCropArea.width = cropArea.width - (newCropArea.x - cropArea.x);
        break;
      case 'r': // Right edge
        newCropArea.width = Math.max(50, Math.min(cropArea.width + deltaX, canvas.width - cropArea.x));
        break;
      case 'move':
        newCropArea.x = Math.max(0, Math.min(cropArea.x + deltaX, canvas.width - cropArea.width));
        newCropArea.y = Math.max(0, Math.min(cropArea.y + deltaY, canvas.height - cropArea.height));
        break;
    }

    setCropArea(newCropArea);
    setDragStart({ x, y });
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !activeHandle || !e.touches[0]) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;
    const y = e.touches[0].clientY - rect.top;

    const deltaX = x - dragStart.x;
    const deltaY = y - dragStart.y;

    let newCropArea = { ...cropArea };

    switch (activeHandle) {
      case 'tl':
        newCropArea.x = Math.max(0, Math.min(cropArea.x + deltaX, cropArea.x + cropArea.width - 50));
        newCropArea.y = Math.max(0, Math.min(cropArea.y + deltaY, cropArea.y + cropArea.height - 50));
        newCropArea.width = cropArea.width - (newCropArea.x - cropArea.x);
        newCropArea.height = cropArea.height - (newCropArea.y - cropArea.y);
        break;
      case 'tr':
        newCropArea.y = Math.max(0, Math.min(cropArea.y + deltaY, cropArea.y + cropArea.height - 50));
        newCropArea.width = Math.max(50, Math.min(cropArea.width + deltaX, canvas.width - cropArea.x));
        newCropArea.height = cropArea.height - (newCropArea.y - cropArea.y);
        break;
      case 'bl':
        newCropArea.x = Math.max(0, Math.min(cropArea.x + deltaX, cropArea.x + cropArea.width - 50));
        newCropArea.width = cropArea.width - (newCropArea.x - cropArea.x);
        newCropArea.height = Math.max(50, Math.min(cropArea.height + deltaY, canvas.height - cropArea.y));
        break;
      case 'br':
        newCropArea.width = Math.max(50, Math.min(cropArea.width + deltaX, canvas.width - cropArea.x));
        newCropArea.height = Math.max(50, Math.min(cropArea.height + deltaY, canvas.height - cropArea.y));
        break;
      case 't': // Top edge
        newCropArea.y = Math.max(0, Math.min(cropArea.y + deltaY, cropArea.y + cropArea.height - 50));
        newCropArea.height = cropArea.height - (newCropArea.y - cropArea.y);
        break;
      case 'b': // Bottom edge
        newCropArea.height = Math.max(50, Math.min(cropArea.height + deltaY, canvas.height - cropArea.y));
        break;
      case 'l': // Left edge
        newCropArea.x = Math.max(0, Math.min(cropArea.x + deltaX, cropArea.x + cropArea.width - 50));
        newCropArea.width = cropArea.width - (newCropArea.x - cropArea.x);
        break;
      case 'r': // Right edge
        newCropArea.width = Math.max(50, Math.min(cropArea.width + deltaX, canvas.width - cropArea.x));
        break;
      case 'move':
        newCropArea.x = Math.max(0, Math.min(cropArea.x + deltaX, canvas.width - cropArea.width));
        newCropArea.y = Math.max(0, Math.min(cropArea.y + deltaY, canvas.height - cropArea.height));
        break;
    }

    setCropArea(newCropArea);
    setDragStart({ x, y });
  };

  const handleMouseUp = () => {
    setActiveHandle(null);
  };

  const handleCrop = () => {
    const img = imgRef.current;
    if (!img) return;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const scaleX = img.width / canvasSize.width;
    const scaleY = img.height / canvasSize.height;

    canvas.width = cropArea.width * scaleX;
    canvas.height = cropArea.height * scaleY;

    ctx.drawImage(
      img,
      cropArea.x * scaleX,
      cropArea.y * scaleY,
      cropArea.width * scaleX,
      cropArea.height * scaleY,
      0,
      0,
      canvas.width,
      canvas.height
    );

    onCropComplete(canvas.toDataURL("image/png"));
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
      <div className={`rounded-lg p-6 max-w-4xl w-full ${
        theme === 'dark' ? 'bg-neutral-900' : 'bg-white'
      }`}>
        <h2 className="text-xl font-bold mb-4">Crop Image</h2>
        
        <div className="flex justify-center">
          <canvas
            ref={canvasRef}
            className="border border-neutral-700 rounded cursor-crosshair"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleMouseUp}
            style={{ maxWidth: '100%', height: 'auto', touchAction: 'none' }}
          />
        </div>

        <p className={`text-sm mt-3 text-center ${
          theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'
        }`}>
          Drag corners to resize • Drag inside to move
        </p>

        <div className="flex gap-3 mt-6">
          <button
            onClick={handleCrop}
            className={`flex-1 px-4 py-3 rounded-lg font-semibold transition ${
              theme === 'dark'
                ? 'bg-white text-black hover:bg-neutral-200'
                : 'bg-black text-white hover:bg-neutral-800'
            }`}
          >
            Apply Crop
          </button>
          <button
            onClick={onClose}
            className={`flex-1 px-4 py-3 rounded-lg font-semibold transition ${
              theme === 'dark'
                ? 'bg-neutral-800 text-white hover:bg-neutral-700'
                : 'bg-neutral-200 text-black hover:bg-neutral-300'
            }`}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}