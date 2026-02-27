/**
 * Share Utility for Miga
 * Uses Web Share API if available, falls back to download.
 */

export async function shareImage(base64Data, title, text, filename = 'miga-share.png') {
    // 1. Convert base64 to File object if sharing is supported
    if (navigator.share && navigator.canShare) {
        try {
            const blob = await (await fetch(base64Data)).blob();
            const file = new File([blob], filename, { type: blob.type });

            if (navigator.canShare({ files: [file] })) {
                await navigator.share({
                    files: [file],
                    title: title,
                    text: text,
                });
                return { success: true, method: 'api' };
            }
        } catch (error) {
            console.error('Error sharing through Web Share API:', error);
            // Fallback to download if sharing fails
        }
    }

    // 2. Fallback: Download the image
    const link = document.createElement('a');
    link.href = base64Data;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return { success: true, method: 'download' };
}
