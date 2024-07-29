import { IntegrationDefinition , z } from '@botpress/sdk'
import { name, integrationName } from './package.json'

const startUrlsDescription = 'Array of URLs to start crawling from. One or more URLs of pages where the crawler will start. By default, the Actor will also crawl sub-pages of these URLs. For example, for start URL https://example.com/blog, it will crawl also https://example.com/blog/post or https://example.com/blog/article. The Include URLs (globs) option overrides this automation behavior.'
const useSitemapsDescription = 'Whether to use sitemaps for crawling. Defaults to false.'
const crawlerTypeDescription = 'Type of crawler to use. Defaults to "playwright:adaptive".'

export default new IntegrationDefinition({
  name: integrationName ?? name,
  version: '1.0.3',
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
          startUrls: z.string().describe(startUrlsDescription), //z.array(z.string()).describe(startUrlsDescription)
          //z.array(z.object({url: z.string()})          )
          useSitemaps: z.boolean().optional().describe(useSitemapsDescription),
          crawlerType: z.string().optional().describe(crawlerTypeDescription),
        }),
      },
      output: {
        schema: z.object({
          results: z.array(z.any()),
          defaultDatasetId: z.string(),
        }),
      },
    },
  },
})
