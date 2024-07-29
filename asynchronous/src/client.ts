import { ApifyClient } from 'apify-client';
import { ActionArgs } from './types';

export function buildApiData(args: ActionArgs) {
  const startUrls = args.input.startUrls;
  const useSitemaps = args.input.useSitemaps || false;
  const crawlerType = args.input.crawlerType || 'playwright:adaptive';
  
  return {
    "startUrls": [
      {
          "url": startUrls
      }
    ],
    "useSitemaps": useSitemaps,
    "crawlerType": crawlerType,
    // Add other necessary parameters with default values if needed
    "maxCrawlDepth": 20,
    "maxCrawlPages": 9999999,
    "initialConcurrency": 0,
    "maxConcurrency": 200,
    "initialCookies": [],
    "proxyConfiguration": {
      "useApifyProxy": true
    },
    "maxSessionRotations": 10,
    "maxRequestRetries": 5,
    "requestTimeoutSecs": 60,
    "minFileDownloadSpeedKBps": 128,
    "dynamicContentWaitSecs": 10,
    "maxScrollHeightPixels": 5000,
    "removeElementsCssSelector": `nav, footer, script, style, noscript, svg,
        [role="alert"],
        [role="banner"],
        [role="dialog"],
        [role="alertdialog"],
        [role="region"][aria-label*="skip" i],
        [aria-modal="true"]`,
    "removeCookieWarnings": true,
    "expandIframes": true,
    "clickElementsCssSelector": "[aria-expanded=\"false\"]",
    "htmlTransformer": "readableText",
    "readableTextCharThreshold": 100,
    "aggressivePrune": false,
    "debugMode": false,
    "debugLog": false,
    "saveHtml": false,
    "saveHtmlAsFile": false,
    "saveMarkdown": true,
    "saveFiles": false,
    "saveScreenshots": false,
    "maxResults": 9999999,
    "clientSideMinChangePercentage": 15,
    "renderingTypeDetectionPercentage": 10
  };
}

export function getApiConfig(args: ActionArgs) {
  const apiKey = args.ctx.configuration.apiKey;
  const client = new ApifyClient({ token: apiKey });
  return client;
}

export async function callApifyActor(client: ApifyClient, input: any) {
  // Replace 'aYG0l9s7dbB7j3gbS' with your specific actor ID
  const run = await client.actor('apify/website-content-crawler').call(input);
  const { items } = await client.dataset(run.defaultDatasetId).listItems();
  return { results: items, defaultDatasetId: run.defaultDatasetId };
}
