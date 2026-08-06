import { CsvConstants } from "../constants/CsvConstants";
import { exportContent } from "../utils/export.utils";
import { Logger } from "../utils/logger";

export class FileSteps {
  public async savePullRequestsCsv(csvContent: string): Promise<string | undefined> {
    const exportResult = await exportContent({
      content: csvContent,
      defaultDirectory: CsvConstants.outputDirectory,
      defaultFileName: CsvConstants.outputFileName,
      encoding: CsvConstants.outputEncoding
    });

    Logger.info("fileSteps.pullRequestsCsv.exported", exportResult);
    return exportResult.localPath;
  }
}
