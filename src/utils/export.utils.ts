import fs from "node:fs";
import path from "node:path";
import { Logger } from "./logger";

type ExportTarget = "local";

type ExportResult = {
  localPath?: string;
};

type ExportRequest = {
  content: string;
  defaultDirectory: string;
  defaultFileName: string;
  encoding: BufferEncoding;
};

type ExportOptions = {
  target?: ExportTarget;
  outputDirectory?: string;
  outputFileName?: string;
};

export async function exportContent(
  request: ExportRequest,
  options?: ExportOptions
): Promise<ExportResult> {
  const target = parseExportTarget(options?.target ?? process.env.EXPORT_TARGET);

  switch (target) {
    case "local":
      return {
        localPath: exportToLocalFile(request, {
          outputDirectory: options?.outputDirectory,
          outputFileName: options?.outputFileName
        })
      };
    default:
      throw new Error(`Unsupported export target: ${String(target)}`);
  }
}

function parseExportTarget(rawTarget?: string): ExportTarget {
  if (!rawTarget || rawTarget.trim() === "") {
    return "local";
  }

  const target = rawTarget.trim().toLowerCase();
  if (target === "local") {
    return target;
  }

  throw new Error("Invalid EXPORT_TARGET. Use LOCAL (or local).");
}

function exportToLocalFile(
  request: ExportRequest,
  options?: { outputDirectory?: string; outputFileName?: string }
): string {
  const outputDirectory = path.resolve(
    process.cwd(),
    request.defaultDirectory || options?.outputDirectory?.trim() || process.env.EXPORT_OUTPUT_DIR?.trim() || "."
  );
  const outputFileName =
    request.defaultFileName || options?.outputFileName?.trim() || process.env.EXPORT_OUTPUT_FILE_NAME?.trim() || "export.txt";

  fs.mkdirSync(outputDirectory, { recursive: true });

  const outputPath = path.join(outputDirectory, outputFileName);
  fs.writeFileSync(outputPath, request.content, request.encoding);

  Logger.info("export.local.path", outputPath);
  return outputPath;
}
