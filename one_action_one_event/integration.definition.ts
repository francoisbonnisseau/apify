import { conversation, IntegrationDefinition , z } from '@botpress/sdk'
import { name, integrationName } from './package.json'

const conversationIdDescription = 'ID of the conversation : {{event.conversationId}}'
const startUrlsDescription = 'Array of URLs to start crawling from. One or more URLs of pages where the crawler will start. By default, the Actor will also crawl sub-pages of these URLs. For example, for start URL https://example.com/blog, it will crawl also https://example.com/blog/post or https://example.com/blog/article. The Include URLs (globs) option overrides this automation behavior.'
const useSitemapsDescription = 'Whether to use sitemaps for crawling. Defaults to false.'
const crawlerTypeDescription = 'Type of crawler to use. Defaults to "playwright:adaptive".'

export default new IntegrationDefinition({
  name: integrationName ?? name,
  version: '1.1.9',
  icon: 'icon.svg',
  title: 'Apify Web Scraping',
  description: 'Integrate Apify to perform web scraping directly within your chatbot conversations',
  readme: 'hub.md',
  configuration: {
    schema: z.object({
      apiKey: z.string().describe('Apify API Key'),
    }),
  },
  channels: {},
  actions: {
    scrapeWebsite: {
      title: 'Scrape Website',
      description: 'Scrape a website or a page using Apify',
      input: {
        schema: z.object({
          conversationId: z.string().describe(conversationIdDescription), 
          startUrls: z.string().describe(startUrlsDescription), //z.array(z.string()).describe(startUrlsDescription)
          //z.array(z.object({url: z.string()})          )
          useSitemaps: z.boolean().optional().describe(useSitemapsDescription),
          crawlerType: z.string().optional().describe(crawlerTypeDescription),
        }),
      },
      output: {
        schema: z.object({
          runId: z.string(),
        }),
      },
    },
    // fetchData: {
    //   title: 'Fetch Data',
    //   description: 'Fetch scraped data using the dataset ID',
    //   input: {
    //     schema: z.object({
    //       datasetId: z.string(),
    //     }),
    //   },
    //   output: {
    //     schema: z.object({
    //       results: z.array(z.any()),
    //     }),
    //   },
    // },
  },
  events: {
    scrapingCompleted: {
      title: 'Apify Scraping Completed',
      description: 'This event is triggered when an Apify scraping task is completed.',
      schema: z.object({
        conversation: z.object({
          id: z.string().describe('ID of the conversation'),
        }),
        data: z.object({
          defaultDatasetId: z.string(),
          results: z.record(z.unknown()),
        }),
      }).passthrough(),
        // conversation: z.object({
        //   id: z.string().describe('ID of the conversation'),
        // }),
        // runId: z.string().describe('ID of the Apify run'),
        // defaultDatasetId: z.string().describe('ID of the dataset'),
        // results: z.array(z.any()).describe('Scraped results')
    },
  },
})