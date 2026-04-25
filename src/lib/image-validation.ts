export interface ImageValidationOptions {
  maxSizeBytes?: number;
  allowedFormats?: string[];
  aspectRatio?: "16:9" | "4:3" | "1:1" | "3:2";
  tolerance?: number;
}

export const ASPECT_RATIOS = {
  "16:9": { value: 16 / 9, label: "16:9 (Landscape)" },
  "4:3": { value: 4 / 3, label: "4:3 (Standard)" },
  "1:1": { value: 1, label: "1:1 (Square)" },
  "3:2": { value: 3 / 2, label: "3:2 (Classic)" },
};

export function validateImage(
  file: File,
  options: ImageValidationOptions = {}
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const maxSize = options.maxSizeBytes || 10 * 1024 * 1024; // 10MB default
  const allowed = options.allowedFormats || ["image/jpeg", "image/png", "image/webp", "image/gif"];
  const tolerance = options.tolerance || 0.05;

  // Check file size
  if (file.size > maxSize) {
    errors.push(`File size exceeds ${maxSize / 1024 / 1024}MB limit`);
  }

  // Check file type
  if (!allowed.includes(file.type)) {
    errors.push(`File type ${file.type} is not allowed`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export async function validateImageDimensions(
  file: File,
  targetAspectRatio: "16:9" | "4:3" | "1:1" | "3:2",
  tolerance: number = 0.05
): Promise<{ valid: boolean; errors: string[]; dimensions?: { width: number; height: number } }> {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        const errors: string[] = [];
        const actualRatio = img.width / img.height;
        const targetRatio = ASPECT_RATIOS[targetAspectRatio].value;

        // Check if the aspect ratio is within tolerance
        const difference = Math.abs(actualRatio - targetRatio) / targetRatio;
        if (difference > tolerance) {
          const targetLabel = ASPECT_RATIOS[targetAspectRatio].label;
          errors.push(
            `Image aspect ratio is ${actualRatio.toFixed(2)}, but ${targetLabel} is required (tolerance: ${(tolerance * 100).toFixed(0)}%)`
          );
        }

        resolve({
          valid: errors.length === 0,
          errors,
          dimensions: { width: img.width, height: img.height },
        });
      };

      img.onerror = () => {
        resolve({
          valid: false,
          errors: ["Failed to load image"],
        });
      };

      img.src = e.target?.result as string;
    };

    reader.onerror = () => {
      resolve({
        valid: false,
        errors: ["Failed to read file"],
      });
    };

    reader.readAsDataURL(file);
  });
}
