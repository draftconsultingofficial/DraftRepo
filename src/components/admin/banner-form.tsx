"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import Cropper from "react-easy-crop";
import type { Area } from "react-easy-crop";
import { saveBannerAction } from "@/server/banner-actions";
import { useRouter } from "next/navigation";
import { ASPECT_RATIOS } from "@/lib/image-validation";

type BannerShape = {
  _id?: string;
  title?: string;
  description?: string;
  link?: string;
  imagePath?: string;
  startDate?: Date;
  endDate?: Date;
  isActive?: boolean;
  position?: number;
  aspectRatio?: "16:9" | "4:3" | "1:1";
};

export function BannerForm({ banner }: { banner?: BannerShape }) {
  const [imageDimensions, setImageDimensions] = useState<string>("");
  const [validationError, setValidationError] = useState<string>("");
  // Fixed aspect ratio (16:9) for all uploads to keep site uniform
  const [selectedRatio] = useState<"16:9">("16:9");
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const [cropOpen, setCropOpen] = useState(false);
  const [crop, setCrop] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedArea, setCroppedArea] = useState<Area | null>(null);
  const originalFileRef = useRef<File | null>(null);
  const router = useRouter();

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setValidationError("");

    // store original and open cropper for consistent aspect
    originalFileRef.current = file;

    // create preview
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewSrc(String(reader.result));
      setCropOpen(true);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    // if cropping applied, replace file
    if (croppedArea && previewSrc && originalFileRef.current) {
      try {
        const blob = await getCroppedImg(previewSrc, croppedArea);
        const croppedFile = new File([blob], originalFileRef.current.name, { type: blob.type });
        formData.set("image", croppedFile);
      } catch (err) {
        console.error("Failed to crop image", err);
      }
    }

    try {
      const result = (await saveBannerAction(formData)) as { success?: boolean };
      if (result?.success) {
        router.push("/admin/banners");
      }
    } catch (err) {
      console.error(err);
      setValidationError("Failed to save banner. Check server logs.");
    }
  };

  const onCropComplete = useCallback((_: Area, areaPixels: Area) => {
    setCroppedArea(areaPixels);
  }, []);

  const applyCropToPreview = async () => {
    setCropOpen(false);
    if (croppedArea && previewSrc) {
      setImageDimensions(`${Math.round(croppedArea.width)}x${Math.round(croppedArea.height)}`);
    }
  };

  // helper to get cropped image as blob
  async function getCroppedImg(imageSrc: string, pixelCrop: Area): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const img = new window.Image();
      img.setAttribute("crossOrigin", "anonymous");
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = pixelCrop.width;
        canvas.height = pixelCrop.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("Failed to get canvas context"));
        ctx.drawImage(
          img,
          pixelCrop.x,
          pixelCrop.y,
          pixelCrop.width,
          pixelCrop.height,
          0,
          0,
          pixelCrop.width,
          pixelCrop.height,
        );
        canvas.toBlob((blob) => {
          if (!blob) return reject(new Error("Canvas is empty"));
          resolve(blob);
        }, "image/jpeg", 0.92);
      };
      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = imageSrc;
    });
  }

  return (
    <form onSubmit={handleSubmit} className="admin-card space-y-8 p-8">
      <input type="hidden" name="bannerId" value={banner?._id || ""} />
      <input type="hidden" name="existingImagePath" value={banner?.imagePath || ""} />

      {validationError && (
        <div className="rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-800">
          {validationError}
        </div>
      )}

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Banner Details</h2>
        
        <div className="space-y-2">
          <label className="text-sm font-semibold">Banner Title *</label>
          <input
            className="field"
            name="title"
            defaultValue={banner?.title}
            placeholder="e.g., Summer Hiring Campaign"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold">Description (optional)</label>
          <textarea
            className="field"
            name="description"
            defaultValue={banner?.description}
            placeholder="Brief description visible on banner"
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold">Call-to-Action Link (optional)</label>
          <input
            className="field"
            name="link"
            type="url"
            defaultValue={banner?.link}
            placeholder="https://..."
          />
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Image Settings</h2>

        <input type="hidden" name="aspectRatio" value="16:9" />
        <p className="text-xs text-gray-600">Aspect ratio: 16:9 (enforced)</p>

        <div className="space-y-2">
          <label className="text-sm font-semibold">Banner Image *</label>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
            className="field file:mr-3 file:rounded-lg file:border-0 file:bg-blue-600 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-white"
          />
          {imageDimensions && (
            <p className="text-xs text-green-600">✓ Image dimensions: {imageDimensions}</p>
          )}
          {previewSrc && (
              <div className="mt-4">
              <p className="text-xs text-gray-600 mb-2">Preview (crop before saving)</p>
              <div className="rounded overflow-hidden border border-gray-200">
                <Image
                  src={previewSrc}
                  alt="preview"
                  width={600}
                  height={224}
                  className="w-full h-auto object-cover max-h-56"
                  unoptimized
                />
              </div>
            </div>
          )}
          {cropOpen && previewSrc && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
              <div className="w-full max-w-4xl bg-white rounded-lg overflow-hidden">
                <div className="relative h-96 bg-black">
                  <Cropper
                    image={previewSrc}
                    crop={crop}
                    zoom={zoom}
                    aspect={ASPECT_RATIOS[selectedRatio].value}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={onCropComplete}
                  />
                </div>
                <div className="p-4 flex items-center gap-4 justify-end">
                  <button type="button" className="button-outline" onClick={() => { setCropOpen(false); setPreviewSrc(null); originalFileRef.current = null; }}>
                    Cancel
                  </button>
                  <button type="button" className="button-primary" onClick={applyCropToPreview}>
                    Apply Crop
                  </button>
                </div>
              </div>
            </div>
          )}
          {banner?.imagePath && !imageDimensions && (
              <div className="rounded-lg overflow-hidden border border-gray-200 mt-4 relative h-32">
              <Image
                src={banner.imagePath}
                alt={banner.title || "Banner"}
                fill
                sizes="320px"
                className="object-cover"
              />
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Schedule</h2>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-semibold">Start Date *</label>
            <input
              type="datetime-local"
              name="startDate"
              defaultValue={
                banner?.startDate
                  ? new Date(banner.startDate).toISOString().slice(0, 16)
                  : ""
              }
              className="field"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold">End Date *</label>
            <input
              type="datetime-local"
              name="endDate"
              defaultValue={
                banner?.endDate
                  ? new Date(banner.endDate).toISOString().slice(0, 16)
                  : ""
              }
              className="field"
              required
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Display Settings</h2>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-semibold">Display Position</label>
            <input
              type="number"
              name="position"
              defaultValue={banner?.position || 0}
              min="0"
              className="field"
            />
            <p className="text-xs text-gray-600">Lower numbers appear first</p>
          </div>

          <label className="flex items-center gap-3 rounded-lg border border-gray-300 bg-gray-50 px-4 py-3">
            <input
              type="checkbox"
              name="isActive"
              defaultChecked={banner?.isActive ?? true}
              className="rounded border-gray-300"
            />
            <span className="text-sm font-medium text-gray-900">Active</span>
          </label>
        </div>
      </div>

      <button type="submit" className="button-primary">
        {banner ? "Update Banner" : "Create Banner"}
      </button>
    </form>
  );
}
