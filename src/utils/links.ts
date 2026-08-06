import { LinkConstants } from "../constants/LinkConstants";

export function toCheckableHttpLinks(rawHrefs: string[], currentPageUrl: string): string[] {
  return [
    ...new Set(
      rawHrefs
        .filter((href) => href?.trim())
        .filter(
          (href) =>
            !LinkConstants.prefixesToIgnore.some((prefix) =>
              href.toLowerCase().startsWith(prefix)
            )
        )
        .flatMap((href) => {
          try {
            const url = new URL(href, currentPageUrl);

            return [LinkConstants.httpProtocol, LinkConstants.httpsProtocol].includes(
              url.protocol
            )
              ? [url.toString()]
              : [];
          } catch {
            return [];
          }
        })
    ),
  ];
}