import { expect, type APIRequestContext } from "@playwright/test";
import { CsvConstants } from "../constants/CsvConstants";
import { GitHubConstants } from "../constants/GitHubConstants";
import { TextConstants } from "../constants/TextConstants";
import type { GitHubPullItem, PullRequestSummary } from "../types/github.types";
import { Logger } from "../utils/logger";
import { RegexPatterns } from "../constants/RegexPatterns";

export class GitHubApiSteps {
  public constructor(private readonly request: APIRequestContext) {}

  public createPullRequestsCsv(summaries: PullRequestSummary[]): string {
    const csvRows = summaries.map((row) =>
      [row.title, row.createdAt, row.author]
        .map((value) => `${TextConstants.doubleQuote}${value.replace(RegexPatterns.doubleQuote, `${TextConstants.doubleQuote}${TextConstants.doubleQuote}`)}${TextConstants.doubleQuote}`)
        .join(TextConstants.comma)
    );

    return [CsvConstants.headers.join(TextConstants.comma), ...csvRows].join(TextConstants.newline);
  }

  public async fetchOpenPullRequestSummaries(
    pullsApiUrl: string,
    perPage: number = GitHubConstants.perPage
  ): Promise<PullRequestSummary[]> {
    const summaries: PullRequestSummary[] = [];
    let pageNumber = 1;
    const normalizedPullsApiUrl = pullsApiUrl.trim();

    while (true) {
      const response = await this.fetchPullRequestPage(normalizedPullsApiUrl, pageNumber, perPage);

      if (response.status() === 403) {
        Logger.warn("githubApi.rateLimit", "Received 403 from GitHub API. Skipping PR export for this run.");
        break;
      }

      expect(response.status()).toBe(200);

      const items = (await response.json()) as GitHubPullItem[];
      if (items.length === 0) {
        break;
      }

      summaries.push(...this.mapPullItemsToSummaries(items));

      pageNumber += 1;
    }

    Logger.info("githubApi.openPullRequestsCount", summaries.length);
    return summaries;
  }

  private async fetchPullRequestPage(pullsApiUrl: string, pageNumber: number, perPage: number) {
    return this.request.get(pullsApiUrl, {
      params: {
        state: GitHubConstants.openState,
        per_page: perPage,
        page: pageNumber
      },
      headers: this.buildGitHubHeaders(),
      failOnStatusCode: false
    });
  }

  private mapPullItemsToSummaries(items: GitHubPullItem[]): PullRequestSummary[] {
    return items.map((item) => ({
      title: item.title,
      createdAt: item.created_at,
      author: item.user?.login
    }));
  }

  private buildGitHubHeaders(): Record<string, string> {
    const token = process.env.GITHUB_TOKEN?.trim();

    return {
      Accept: GitHubConstants.acceptHeader,
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    };
  }
}
