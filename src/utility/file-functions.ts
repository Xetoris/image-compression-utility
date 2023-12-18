/**
 * List of file extensions for images.
 *
 * @remarks
 *  See [Mozilla's List](https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Image_types)
 */
const imageFileFormats = [
    'apng',
    'avif',
    'gif',
    'jpg',
    'jpeg',
    'jfif',
    'pjpeg',
    'pjp',
    'png',
    'svg',
    'webp',
];

/**
 * Determines if the file is a known image type.
 *
 * @remarks
 *  Compares the file extension to a list of known image types.
 */
function isFileAnImage(file: string): boolean {
    return imageFileFormats.find(x => x === file.toLowerCase().split('.')[1].trim()) !== undefined;
}

export {
    isFileAnImage
};