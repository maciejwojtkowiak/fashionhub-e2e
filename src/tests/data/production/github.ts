export default {
  expected: {
    minOpenPullRequests: 0
  },
  request: {
    perPage: 100,
    pullsApiUrl: "https://api.github.com/repos/appwrite/appwrite/pulls"
  }
} as const;
