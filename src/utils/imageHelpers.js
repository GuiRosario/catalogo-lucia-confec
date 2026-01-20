/**
 * Compresses an image file while maintaining high quality.
 * Max dimension: 1920px
 * Quality: 0.9 (90%)
 * 
 * @param {File} file - The image file to compress
 * @returns {Promise<File>} - The compressed file or original if compression fails
 */
export const compressImage = async (file) => {
    // Skip if not an image
    if (!file.type.startsWith('image/')) return file;

    // Skip small images (< 300KB) to avoid unnecessary processing
    if (file.size < 300 * 1024) return file;

    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;

            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;
                const MAX_WIDTH = 1920;
                const MAX_HEIGHT = 1920;

                // Caculate new dimensions
                if (width > height) {
                    if (width > MAX_WIDTH) {
                        height = Math.round((height * MAX_WIDTH) / width);
                        width = MAX_WIDTH;
                    }
                } else {
                    if (height > MAX_HEIGHT) {
                        width = Math.round((width * MAX_HEIGHT) / height);
                        height = MAX_HEIGHT;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                // Decide output format (keep PNG for transparency if needed, else JPEG)
                // For simplicity and best compression for photos, we prefer JPEG unless it's a PNG which might have transparency.
                // However, standardizing on JPEG 0.9 is usually safe for product photos.
                // To be safe with transparency, we check file type.
                const outputType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
                // Note: quality param only works for image/jpeg and image/webp
                const quality = 0.9;

                canvas.toBlob(
                    (blob) => {
                        if (!blob) {
                            resolve(file); // Fallback
                            return;
                        }

                        // If compressed is somehow larger (rare), return original
                        if (blob.size > file.size) {
                            resolve(file);
                            return;
                        }

                        const compressedFile = new File([blob], file.name, {
                            type: outputType,
                            lastModified: Date.now(),
                        });
                        resolve(compressedFile);
                    },
                    outputType,
                    quality
                );
            };

            img.onerror = () => resolve(file);
        };

        reader.onerror = () => resolve(file);
    });
};
