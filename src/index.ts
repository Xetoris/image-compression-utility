import {program} from "commander";
import {randomUUID} from "crypto";
import {resolve} from "node:path";

import {compress} from "./functions/compress.js";
import {simpleLogger} from "./utility/simple-logger.js";

interface CliOptions {
    outPath: string;
    loggerLevel: string;
}

program
    .name("image-compressor")
    .description("Utility for compressing images")
    .version("0.0.1");

program
    .command("compress")
    .description("Attempts to compress an image.")
    .argument("<path>", "Path to the source image.")
    .option(
        "-o, --out-path <path>",
        "Path to write the compressed images out to.",
        resolve(process.cwd(), `./executions/${randomUUID().replaceAll("-", "")}`)
    )
    .option(
        "-l, --logger-level <value>",
        "Defines the logger level.",
        'warn'
    )
    .action(async (sourcePath: string, options: CliOptions) => {
        simpleLogger.level = options.loggerLevel;

        await compress({
            inputPath: resolve(sourcePath),
            outputPath: resolve(options.outPath)
        });
    });

await program.parseAsync();