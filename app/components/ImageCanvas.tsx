"use client";

import React, { useRef, useEffect, useState } from "react";
import { Theme } from "../hooks/useTheme";

interface Props {
  image: string | null;
  subtitle: string;
  textColor: string;
  bgColor: string;
  opacity: number;
  filter: string;
  font: string;
  fontSize: number;
  textStroke: number;
  textStrokeColor: string;
  theme: Theme;
}

interface ImageBounds {
  width: number;
  height: number;
  offsetX: number;
  offsetY: number;
  naturalWidth: number;
  naturalHeight: number;
}

export default function ImageCanvas({
  image,
  subtitle,
  textColor,
  bgColor,
  opacity,
  filter,
  font,
  fontSize,
  textStroke,
  textStrokeColor,
  theme,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const [imageBounds, setImageBounds] = useState<ImageBounds | null>(null);
  const [containerDimensions, setContainerDimensions] = useState({ width: 900, height: 600 });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setContainerDimensions({
          width: rect.width,
          height: rect.height,
        });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  useEffect(() => {
    if (!image) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const imgAspect = img.naturalWidth / img.naturalHeight;
      const containerAspect = containerDimensions.width / containerDimensions.height;

      let renderedWidth: number;
      let renderedHeight: number;

      if (imgAspect > containerAspect) {
        renderedWidth = containerDimensions.width;
        renderedHeight = containerDimensions.width / imgAspect;
      } else {
        renderedHeight = containerDimensions.height;
        renderedWidth = containerDimensions.height * imgAspect;
      }

      const offsetX = (containerDimensions.width - renderedWidth) / 2;
      const offsetY = (containerDimensions.height - renderedHeight) / 2;

      setImageBounds({
        width: renderedWidth,
        height: renderedHeight,
        offsetX,
        offsetY,
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
      });

      drawToCanvas(img, renderedWidth, renderedHeight, offsetX, offsetY, true);
      drawToCanvas(img, img.naturalWidth, img.naturalHeight, 0, 0, false);
    };
    img.src = image;
  }, [image, subtitle, textColor, bgColor, opacity, filter, font, fontSize, textStroke, textStrokeColor, containerDimensions, theme]);

  const drawToCanvas = (
    img: HTMLImageElement,
    width: number,
    height: number,
    offsetX: number,
    offsetY: number,
    isPreview: boolean
  ) => {
    const canvas = isPreview ? previewCanvasRef.current : canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (isPreview) {
      canvas.width = containerDimensions.width;
      canvas.height = containerDimensions.height;
      ctx.fillStyle = theme === 'dark' ? 'black' : 'white';
      ctx.fillRect(0, 0, containerDimensions.width, containerDimensions.height);
    } else {
      canvas.width = width;
      canvas.height = height;
    }

    // Apply cinematic effect if selected
    if (filter === "cinematic") {
      applyCinematicEffect(ctx, img, width, height, offsetX, offsetY);
    } else {
      // Apply standard filter
      if (filter && filter !== "none") {
        ctx.filter = getCanvasFilter(filter);
      } else {
        ctx.filter = "none";
      }
      ctx.drawImage(img, offsetX, offsetY, width, height);
      ctx.filter = "none";
    }

    if (subtitle) {
      drawsubtitle(ctx, width, height, offsetX, offsetY, isPreview);
    }
  };

  const applyCinematicEffect = (
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  width: number,
  height: number,
  offsetX: number,
  offsetY: number
) => {
  // Step 1: Draw base image with high contrast and saturation
  ctx.filter = "contrast(1.4) saturate(1.3) brightness(0.95)";
  ctx.drawImage(img, offsetX, offsetY, width, height);
  ctx.filter = "none";

  // Step 2: Get image data for color grading
  const imageData = ctx.getImageData(offsetX, offsetY, width, height);
  const data = imageData.data;

  // Step 3: Color grading - boost reds/oranges, add teal to shadows
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    // Calculate luminance
    const luminance = 0.299 * r + 0.587 * g + 0.114 * b;

    // Boost reds/oranges in highlights and midtones
    if (luminance > 80) {
      data[i] = Math.min(255, r * 1.2); // Boost red
      data[i + 1] = Math.min(255, g * 1.1); // Slight boost green
    }

    // Add teal/green to shadows
    if (luminance < 80) {
      data[i + 1] = Math.min(255, g * 1.15); // Boost green in shadows
      data[i + 2] = Math.min(255, b * 1.2); // Boost blue in shadows
    }

    // Crush blacks (make dark areas darker)
    if (luminance < 30) {
      data[i] = Math.max(0, r * 0.7);
      data[i + 1] = Math.max(0, g * 0.7);
      data[i + 2] = Math.max(0, b * 0.7);
    }
  }

  ctx.putImageData(imageData, offsetX, offsetY);

  // Step 4: Add halation/bloom effect (glow around bright areas)
  // Create temporary canvas for bloom
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = width;
  tempCanvas.height = height;
  const tempCtx = tempCanvas.getContext('2d');
  
  if (tempCtx) {
    // Copy current image to temp canvas
    tempCtx.drawImage(ctx.canvas, offsetX, offsetY, width, height, 0, 0, width, height);
    
    // Apply bloom effect
    ctx.globalCompositeOperation = "screen";
    ctx.filter = "blur(20px) brightness(1.5)";
    ctx.globalAlpha = 0.3;
    ctx.drawImage(tempCanvas, 0, 0, width, height, offsetX, offsetY, width, height);
    ctx.globalAlpha = 1;
    ctx.filter = "none";
    ctx.globalCompositeOperation = "source-over";
  }

  // Step 5: Add vignette
  const centerX = offsetX + width / 2;
  const centerY = offsetY + height / 2;
  const radius = Math.max(width, height) * 0.7;

  const gradient = ctx.createRadialGradient(centerX, centerY, radius * 0.3, centerX, centerY, radius);
  gradient.addColorStop(0, "rgba(0, 0, 0, 0)");
  gradient.addColorStop(0.7, "rgba(0, 0, 0, 0)");
  gradient.addColorStop(1, "rgba(0, 0, 0, 0.5)");

  ctx.fillStyle = gradient;
  ctx.fillRect(offsetX, offsetY, width, height);
};

// NEW: Add grainy filter function
const applyGrainyEffect = (
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  width: number,
  height: number,
  offsetX: number,
  offsetY: number
) => {
  // Step 1: Draw base image with pale/desaturated colors
  ctx.filter = "saturate(0.6) brightness(1.1) contrast(0.9)";
  ctx.drawImage(img, offsetX, offsetY, width, height);
  ctx.filter = "none";

  // Step 2: Get image data to add grain
  const imageData = ctx.getImageData(offsetX, offsetY, width, height);
  const data = imageData.data;

  // Step 3: Add film grain noise
  for (let i = 0; i < data.length; i += 4) {
    // Generate random noise (-15 to +15)
    const noise = (Math.random() - 0.5) * 30;
    
    // Apply noise to RGB channels
    data[i] = Math.max(0, Math.min(255, data[i] + noise));     // R
    data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise)); // G
    data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise)); // B
  }

  ctx.putImageData(imageData, offsetX, offsetY);

  // Step 4: Add subtle vignette for vintage feel
  const centerX = offsetX + width / 2;
  const centerY = offsetY + height / 2;
  const radius = Math.max(width, height) * 0.8;

  const gradient = ctx.createRadialGradient(centerX, centerY, radius * 0.3, centerX, centerY, radius);
  gradient.addColorStop(0, "rgba(0, 0, 0, 0)");
  gradient.addColorStop(0.8, "rgba(0, 0, 0, 0)");
  gradient.addColorStop(1, "rgba(0, 0, 0, 0.3)");

  ctx.fillStyle = gradient;
  ctx.fillRect(offsetX, offsetY, width, height);
};
  const getCanvasFilter = (filterClass: string): string => {
    const filterMap: Record<string, string> = {
      none: "none",
      grayscale: "grayscale(100%)",
      sepia: "sepia(100%)",
      blur: "blur(4px)",
      brightness: "brightness(1.2)",
      contrast: "contrast(1.2)",
      saturate: "saturate(1.5)",
      invert: "invert(100%)",
    };
    return filterMap[filterClass] || "none";
  };


  const drawsubtitle = (
  ctx: CanvasRenderingContext2D,
  renderedWidth: number,
  renderedHeight: number,
  offsetX: number,
  offsetY: number,
  isPreview: boolean
) => {
  const scale = isPreview ? 1 : (renderedWidth / containerDimensions.width);
  const paddingX = 16 * scale;
  const paddingY = 8 * scale;
  const bottomMargin = 12 * scale;
  const scaledFontSize = fontSize * scale;

  // FIXED: Apply font properly
  // Check if font is Roboto and apply bold italic
  if (font.includes('Roboto')) {
    ctx.font = `italic bold ${scaledFontSize}px Roboto, sans-serif`;
  } else {
    ctx.font = `${scaledFontSize}px ${font}`;
  }
  
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";

  const maxWidth = renderedWidth * 0.9;
  const lines = processTextWithLineBreaks(ctx, subtitle, maxWidth);
  const lineHeight = scaledFontSize * 1.2;
  const textHeight = lines.length * lineHeight;

  const textWidths = lines.map((line) => ctx.measureText(line).width);
  const maxTextWidth = Math.max(...textWidths);
  
  const bgWidth = maxTextWidth + paddingX * 2;
  const bgHeight = textHeight + paddingY * 2;

  const bgX = offsetX + renderedWidth / 2 - bgWidth / 2;
  const bgY = offsetY + renderedHeight - bottomMargin - bgHeight;

  if (opacity > 0) {
    const bgHex = Math.floor((opacity / 100) * 255)
      .toString(16)
      .padStart(2, "0");
    ctx.fillStyle = bgColor + bgHex;
    ctx.fillRect(bgX, bgY, bgWidth, bgHeight);
  }

  lines.forEach((line, i) => {
    const textX = offsetX + renderedWidth / 2;
    const textY = bgY + paddingY + (i + 0.8) * lineHeight;

    if (textStroke > 0) {
      ctx.strokeStyle = textStrokeColor;
      ctx.lineWidth = textStroke * scale;
      ctx.lineJoin = "round";
      ctx.miterLimit = 2;
      ctx.strokeText(line, textX, textY);
    }

    ctx.fillStyle = textColor;
    ctx.fillText(line, textX, textY);
  });
};

  const processTextWithLineBreaks = (
    ctx: CanvasRenderingContext2D,
    text: string,
    maxWidth: number
  ): string[] => {
    const allLines: string[] = [];
    const paragraphs = text.split("\n");

    paragraphs.forEach((paragraph) => {
      if (paragraph.trim() === "") {
        allLines.push("");
      } else {
        const wrappedLines = wrapText(ctx, paragraph, maxWidth);
        allLines.push(...wrappedLines);
      }
    });

    return allLines;
  };

  const wrapText = (
    ctx: CanvasRenderingContext2D,
    text: string,
    maxWidth: number
  ): string[] => {
    const words = text.split(" ");
    const lines: string[] = [];
    let currentLine = "";

    words.forEach((word) => {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const metrics = ctx.measureText(testLine);

      if (metrics.width > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    });

    if (currentLine) {
      lines.push(currentLine);
    }

    return lines;
  };

  return (
    <div
      id="export-container"
      ref={containerRef}
      className={`w-full h-full flex items-center justify-center p-6 ${
        theme === 'dark' ? 'bg-black' : 'bg-white'
      }`}
      style={{ pointerEvents: 'none'}}
    >
      <canvas
        ref={previewCanvasRef}
        className="max-w-full max-h-full"
        style={{ pointerEvents: 'none'}}
      />
      
      <canvas
        ref={canvasRef}
        id="export-canvas"
        style={{ display: 'none' }}
      />
    </div>
  );
}