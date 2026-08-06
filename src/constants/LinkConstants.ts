export const LinkConstants = {
  prefixesToIgnore: ["#", "mailto:", "tel:", "javascript:"],
  httpProtocol: "http:",
  httpsProtocol: "https:",
  anchorWithHrefSelector: "a[href]",
  invalidHrefLogContext: "toCheckableHttpLinks.invalidHref"
} as const;
