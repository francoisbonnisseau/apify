import axios from 'axios'
import * as sdk from '@botpress/sdk';
import * as bp from '.botpress';
import { ApifyClient, Actor } from 'apify-client';
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

export function getSimpleApiConfig(apiKey: string) {
  const client = new ApifyClient({ token: apiKey });
  return client;
}

export async function callApifyActor(client: ApifyClient, input: any) {
  // Replace 'aYG0l9s7dbB7j3gbS' with your specific actor ID
  const run = await client.actor('apify/website-content-crawler').call(input);
  const { items } = await client.dataset(run.defaultDatasetId).listItems();
  return { results: items, defaultDatasetId: run.defaultDatasetId };
}

export async function createWebhook(args: ActionArgs){
  args.logger.forBot().info(`Subscribing to Apify webhook`)
      
  const webhookUrl = `https://webhook.botpress.cloud/${args.ctx.webhookId}`
  args.logger.forBot().info(`Webhook URL: ${webhookUrl}`)


  // Define the webhooks configuration

  const data = {
    isAdHoc: false,
    requestUrl: webhookUrl,
    eventTypes: [
      "ACTOR.RUN.SUCCEEDED"
    ],
    condition: {
      actorId: "aYG0l9s7dbB7j3gbS"
    },
    payloadTemplate: `{"conversationId": "${args.input.conversationId}}", "resource":{{resource}}}`
  };

  axios.post('https://api.apify.com/v2/webhooks', data, {
    headers: {
      Authorization: `Bearer ${args.ctx.configuration.apiKey}`,
      'Content-Type': 'application/json'
    }
  })
  .then(response => {
    args.logger.forBot().info('API call to Apify (webhook subscription) successful:', response.data);
    //update webhook with webhookID !
    const webhookId = response.data.data.id
    args.logger.forBot().info(`Webhook ID: ${webhookId}`)

    const dataUpdate = {
      payloadTemplate: `{"webhookId":"${webhookId}","conversationId": "${args.input.conversationId}}", "resource":{{resource}}}`
    };
  
    axios.put(`https://api.apify.com/v2/webhooks/${webhookId}`, dataUpdate, {
      headers: {
        Authorization: `Bearer ${args.ctx.configuration.apiKey}`,
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      args.logger.forBot().info('API call to Apify (webhook update) successful:', response.data);
    })
    .catch(error => {
      args.logger.forBot().error('Failed to make API call (webhook update) to Apify:', error);
    });
  })
  .catch(error => {
    args.logger.forBot().error('Failed to make API call (webhook subscription) to Apify:', error);
  });

  
}

export async function deleteWebhook(apiKey: String, webhookId: String){
    try{
      await axios.delete(`https://api.apify.com/v2/webhooks/${webhookId}`, {
        headers: {
          Authorization: `Bearer ${apiKey}`
        }
      });
    }
    catch(e:any){
      throw new sdk.RuntimeError('Failed to make API call (webhook deletion) to Apify:', e);
    }
}
