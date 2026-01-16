"use client";

import { useState } from "react";
import CaptionInput from "./components/CaptionInput";
import ColorPicker from "./components/ColorPicker";
import OpacitySlider from "./components/OpacitySlider";
import ImageUploader from "./components/ImageUploader";
import ImageCanvas from "./components/ImageCanvas";
import FilterPreviews from "./components/FilterPreviews";
import DummyFilterPreviews from "./components/DummyFilterPreviews";
import ExportButton from "./components/ExportButton";
import FontPicker from "./components/FontPicker";
import FontSizeSlider from "./components/FontSizeSlider";
import ResetButton from "./components/ResetButton";
import TextStrokeControls from "./components/TextStroke";
import ThemeToggle from "./components/ThemeToggle";
import Presets from "./components/Presets";
import CropRotateControls from "./components/CropRotateControls";
import CropModal from "./components/CropModal";
import { useTheme } from "./hooks/useTheme";
import { useMediaQuery } from "./hooks/useMediaQuery";

export default function Page() {
  const [subtitle, setsubtitle] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [textColor, setTextColor] = useState("#FFFFFF");
  const [bgColor, setBgColor] = useState("#000000");
  const [opacity, setOpacity] = useState(0);
  const [filter, setFilter] = useState("none");
  const [font, setFont] = useState("Arial, sans-serif");
  const [fontSize, setFontSize] = useState(28);
  const [textStroke, setTextStroke] = useState(3);
  const [textStrokeColor, setTextStrokeColor] = useState("#000000");
  const [showCropModal, setShowCropModal] = useState(false);

  const { theme, toggleTheme } = useTheme();
  const isMobile = useMediaQuery("(max-width: 768px)");

  const handleReset = () => {
    setImage(null);
    setsubtitle("");
    setTextColor("#FFFFFF");
    setBgColor("#000000");
    setOpacity(0);
    setFilter("none");
    setFont("Arial, sans-serif");
    setFontSize(28);
    setTextStroke(3);
    setTextStrokeColor("#000000");
  };

  const handleSetImage = (file: string | null) => {
    setImage(file);
  };

  const handlePresetSelect = (settings: {
    textColor: string;
    bgColor: string;
    opacity: number;
    textStroke: number;
    textStrokeColor: string;
    font?: string;
    fontSize?: number;
  }) => {
    setTextColor(settings.textColor);
    setBgColor(settings.bgColor);
    setOpacity(settings.opacity);
    setTextStroke(settings.textStroke);
    setTextStrokeColor(settings.textStrokeColor);
    
    if (settings.font) {
      setFont(settings.font);
    }
    if (settings.fontSize) {
      setFontSize(settings.fontSize);
    }
  };

  // Rotate image 90 degrees clockwise
  const handleRotate = () => {
    if (!image) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Swap width and height for 90-degree rotation
      canvas.width = img.height;
      canvas.height = img.width;

      // Rotate 90 degrees clockwise
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((90 * Math.PI) / 180);
      ctx.drawImage(img, -img.width / 2, -img.height / 2);

      setImage(canvas.toDataURL("image/png"));
    };
    img.src = image;
  };

  // Open crop modal
  const handleCrop = () => {
    setShowCropModal(true);
  };

  // Handle crop complete
  const handleCropComplete = (croppedImage: string) => {
    setImage(croppedImage);
  };

  // Desktop Layout
  if (!isMobile) {
    return (
      <div className={`flex h-screen overflow-hidden ${
        theme === 'dark' 
          ? 'dark bg-black text-white' 
          : 'light bg-white text-black'
      }`}>
        {/* LEFT PANEL - Fixed width, won't shrink */}
        <div className={`w-96 flex-shrink-0 overflow-y-auto p-5 space-y-6 border-r ${
          theme === 'dark'
            ? 'border-neutral-800 bg-[#0d0d0d]'
            : 'border-neutral-200 bg-neutral-50'
        }`}>
          <div className="pb-4">
            <h1 className="text-xl font-bold">subtlyy</h1>
          </div>

          <Presets onPresetSelect={handlePresetSelect} theme={theme} />

          <CaptionInput subtitle={subtitle} setSubtitle={setsubtitle} theme={theme} />

          <ColorPicker 
            title="TEXT COLOR" 
            value={textColor} 
            onChange={setTextColor}
            theme={theme}
          />
          
          <TextStrokeControls
            textStroke={textStroke}
            setTextStroke={setTextStroke}
            textStrokeColor={textStrokeColor}
            setTextStrokeColor={setTextStrokeColor}
            theme={theme}
          />

          <ColorPicker 
            title="BACKGROUND COLOR" 
            value={bgColor} 
            onChange={setBgColor}
            theme={theme}
          />

          <OpacitySlider opacity={opacity} setOpacity={setOpacity} theme={theme} />
          
          <FontSizeSlider fontSize={fontSize} setFontSize={setFontSize} theme={theme} />
          
          <FontPicker font={font} setFont={setFont} theme={theme} />
        </div>

        {/* RIGHT PANEL - Takes remaining space */}
        <div className="flex-1 min-w-0 flex flex-col">
          <div className={`flex items-center justify-end p-4 border-b ${
            theme === 'dark'
              ? 'border-neutral-800 bg-[#0d0d0d]'
              : 'border-neutral-200 bg-neutral-50'
          }`}>
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
          </div>

          <div className="flex-1 overflow-hidden relative" style={{ maxHeight: 'calc(100vh - 240px)' }}>
            {!image ? (
              <ImageUploader setImage={handleSetImage} theme={theme} />
            ) : (
              <div className="relative w-full h-full">
                {/* Action Buttons - Positioned absolutely OUTSIDE canvas */}
                <div 
                  className="absolute top-0 right-0 z-50 p-4 flex gap-2"
                  style={{ pointerEvents: 'auto' }}
                >
                  <CropRotateControls onRotate={handleRotate} onCrop={handleCrop} theme={theme} />
                  <ResetButton onReset={handleReset} theme={theme} compact />
                  <ExportButton theme={theme} />
                </div>

                {/* Canvas */}
                <ImageCanvas
                  image={image}
                  subtitle={subtitle}
                  textColor={textColor}
                  bgColor={bgColor}
                  opacity={opacity}
                  filter={filter}
                  font={font}
                  fontSize={fontSize}
                  textStroke={textStroke}
                  textStrokeColor={textStrokeColor}
                  theme={theme}
                />
              </div>
            )}
          </div>

          {!image ? (
            <DummyFilterPreviews theme={theme} />
          ) : (
            <FilterPreviews
              image={image}
              currentFilter={filter}
              onFilterSelect={setFilter}
              theme={theme}
            />
          )}
        </div>

        {/* Crop Modal */}
        {showCropModal && image && (
          <CropModal
            image={image}
            onClose={() => setShowCropModal(false)}
            onCropComplete={handleCropComplete}
            theme={theme}
          />
        )}
      </div>
    );
  }

  // Mobile Layout
  return (
    <>
      <div className={`flex flex-col h-screen overflow-hidden ${
        theme === 'dark' 
          ? 'bg-black text-white' 
          : 'bg-white text-black'
      }`}>
        <div className={`flex items-center justify-between p-4 ${
          theme === 'dark'
            ? 'bg-[#0d0d0d]'
            : 'bg-neutral-50'
        }`}>
          <h1 className="text-lg font-bold">subtitle Editor</h1>
          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
        </div>

        <div className="flex-shrink-0 relative" style={{ height: '40vh' }}>
          {!image ? (
            <ImageUploader setImage={handleSetImage} theme={theme} />
          ) : (
            <div className="relative w-full h-full">
              {/* Action Buttons - Positioned absolutely OUTSIDE canvas */}
              <div 
                className="absolute top-0 right-0 z-50 p-4 flex gap-2"
                style={{ pointerEvents: 'auto' }}
              >
                <CropRotateControls onRotate={handleRotate} onCrop={handleCrop} theme={theme} />
                <ResetButton onReset={handleReset} theme={theme} compact />
                <ExportButton theme={theme} />
              </div>

              {/* Canvas */}
              <ImageCanvas
                image={image}
                subtitle={subtitle}
                textColor={textColor}
                bgColor={bgColor}
                opacity={opacity}
                filter={filter}
                font={font}
                fontSize={fontSize}
                textStroke={textStroke}
                textStrokeColor={textStrokeColor}
                theme={theme}
              />
            </div>
          )}
        </div>

        {!image ? (
          <DummyFilterPreviews theme={theme} />
        ) : (
          <FilterPreviews
            image={image}
            currentFilter={filter}
            onFilterSelect={setFilter}
            theme={theme}
          />
        )}

        {image && (
          <div className="flex-1 overflow-y-auto">
            <div className={`p-4 space-y-6 ${
              theme === 'dark'
                ? 'bg-[#0d0d0d]'
                : 'bg-neutral-50'
            }`}>
              <Presets onPresetSelect={handlePresetSelect} theme={theme} />

              <CaptionInput subtitle={subtitle} setSubtitle={setsubtitle} theme={theme} />

              <ColorPicker 
                title="TEXT COLOR" 
                value={textColor} 
                onChange={setTextColor}
                theme={theme}
              />
              
              <TextStrokeControls
                textStroke={textStroke}
                setTextStroke={setTextStroke}
                textStrokeColor={textStrokeColor}
                setTextStrokeColor={setTextStrokeColor}
                theme={theme}
              />

              <ColorPicker 
                title="BACKGROUND COLOR" 
                value={bgColor} 
                onChange={setBgColor}
                theme={theme}
              />

              <OpacitySlider opacity={opacity} setOpacity={setOpacity} theme={theme} />
              
              <FontSizeSlider fontSize={fontSize} setFontSize={setFontSize} theme={theme} />
              
              <FontPicker font={font} setFont={setFont} theme={theme} />
            </div>
          </div>
        )}
      </div>

      {/* Crop Modal - Rendered outside main container to avoid overflow-hidden clipping */}
      {showCropModal && image && (
        <CropModal
          image={image}
          onClose={() => setShowCropModal(false)}
          onCropComplete={handleCropComplete}
          theme={theme}
        />
      )}
    </>
  );
}