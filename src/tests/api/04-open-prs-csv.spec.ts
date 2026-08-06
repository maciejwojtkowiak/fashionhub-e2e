import { expect, test } from "@playwright/test";
import { FileSteps } from "../../steps/FileSteps";
import { GitHubApiSteps } from "../../steps/GitHubApiSteps";
import { TestDataUtils } from "../../utils/testDataUtils";

type GitHubTestData = {
  expected: {
    minOpenPullRequests: number;
  };
  request: {
    perPage: number;
    pullsApiUrl: string;
  };
};

test.describe("TC4 - Open PR list in CSV", () => {
  test("export open PRs with name, created date and author", async ({ request }) => {
    const github = await TestDataUtils.getTestData<GitHubTestData>("github");
    const gitHubApiSteps = new GitHubApiSteps(request);
    const fileSteps = new FileSteps();
    const pullRequestSummaries = await gitHubApiSteps.fetchOpenPullRequestSummaries(
      github.request.pullsApiUrl,
      github.request.perPage
    );
    expect(pullRequestSummaries.length, "No open PRs returned by GitHub API.").toBeGreaterThan(
      github.expected.minOpenPullRequests
    );
    const pullRequestsCsv = gitHubApiSteps.createPullRequestsCsv(pullRequestSummaries);
    await fileSteps.savePullRequestsCsv(pullRequestsCsv);
  });
});
