import { LinkConstants } from "../constants/LinkConstants";
import { Logger } from "./logger";

export function toCheckableHttpLinks(rawHrefs: string[], currentPageUrl: string): string[] {
  const resolved: string[] = [];

  for (const hrefRaw of rawHrefs) {
    const href = hrefRaw?.trim();
    if (!href) {
      continue;
    }

    if (LinkConstants.prefixesToIgnore.some((prefix) => href.toLowerCase().startsWith(prefix))) {
      continue;
    }

    try {
      const absolute = new URL(href, currentPageUrl);
      if (absolute.protocol === LinkConstants.httpProtocol || absolute.protocol === LinkConstants.httpsProtocol) {
        resolved.push(absolute.toString());
      }
    } catch (error) {
      Logger.warn(LinkConstants.invalidHrefLogContext, { href, currentPageUrl, error });
    }
  }

  return [...new Set(resolved)];
}
