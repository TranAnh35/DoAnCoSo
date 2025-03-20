// hooks/useImageUpload.ts
import { useCallback } from 'react';

export const useImageUpload = (onImageChange: (file: File, preview: string) => void) => {
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => onImageChange(file, reader.result as string);
        reader.readAsDataURL(file);
      }
    },
    [onImageChange]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => onImageChange(file, reader.result as string);
        reader.readAsDataURL(file);
      }
    },
    [onImageChange]
  );

  return { handleDrop, handleChange };
};