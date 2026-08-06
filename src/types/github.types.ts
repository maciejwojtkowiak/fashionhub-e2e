export interface PullRequestSummary {
  title: string;
  createdAt: string;
  author: string;
}

export interface GitHubPullItem {
  title: string;
  created_at: string;
  user: { login: string };
}
