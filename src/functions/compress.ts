import {Dirent} from "node:fs";
import {
    join
} from 'node:path';
import {
    access,
    mkdir,
    opendir,
    readFile
} from 'node:fs/promises';
import sharp from 'sharp';

import {
    simpleLogger
} from "../utility/simple-logger.js";
import {isFileAnImage} from "../utility/file-functions.js";

interface CompressInput {
    /**
     * Directory that contains the images we want to compress.
     */
    inputPath: string;
    /**
     * Directory to dump the compressed images out to.
     */
    outputPath: string;
}

/**
 * Compresses all images in a directory.
 *
 * @remarks
 *  Uses the [sharp](https://sharp.pixelplumbing.com/) library to convert image to a JPEG, performing compression at the
 *  same time. Will attempt to output each image into the specified directory.
 */
async function compress(input: CompressInput): Promise<void> {
    // Check input directory is accessible.
    simpleLogger.info('Validating input directory access...');
    await access(input.inputPath);

    // Create output directory.
    simpleLogger.info('Preparing output directory...');
    await prepareOutputDirectory(input.outputPath);

    // Iterate input directory and process the files.
    simpleLogger.info('Begin processing input files...');
    const dir = await opendir(input.inputPath);

    for await (const itm of dir) {
        if (!itm.isFile() || !isFileAnImage(itm.name)) {
            continue;
        }

        simpleLogger.info(`Attempting compression of image. [${itm.name}]`);
        await compressImage(itm, input.outputPath);
    }

    simpleLogger.info('Completed processing input files!');
}

/**
 * Attempts to generate the output directory.
 *
 * @remarks
 *  Will ignore error that indicates the directory already exists. Otherwise, will throw a generic error to kill the
 *  process.
 */
async function prepareOutputDirectory(path: string): Promise<void> {
    // Check directory exists or create it if not
    try {
        await mkdir(path, { recursive: true });

    // eslint-disable-next-line
    }catch (e: any) {
        if (Object.prototype.hasOwnProperty.call(e, 'code') && e.code.toLowerCase() !== "eexist") {
            throw new Error("Failed to create output directory!", {
                cause: e         
            });
        }

        simpleLogger.info('Output directory exists. Continuing...');
    }
}

/**
 * Compresses the image by opening the file and processing with Sharp's
 * [jpeg](https://sharp.pixelplumbing.com/api-output#jpeg) method.
 */
async function compressImage(image: Dirent, outPath: string): Promise<void> {
    try {
        const file = await readFile(join(image.path, image.name));
        const fileNameWithoutExt = image.name.split('.')[0];

        await sharp(file).jpeg({mozjpeg: true}).toFile(`${outPath}/${fileNameWithoutExt}.jpg`);

    // eslint-disable-next-line
    } catch (e: any) {
        simpleLogger.warn(`Failed processing file: ${image.name}. Skipping...`);
        simpleLogger.debug(`Error: ${e?.message}`);
    }
}

export {
    compress,
    CompressInput
};

