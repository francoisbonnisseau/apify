import * as sdk from '@botpress/sdk'
import * as bp from '.botpress'

import { getApiConfig, buildApiData } from './client';
// import { ActionArgs, ScrapeWebsiteOutput } from './types';

type ScrapeWebsiteOutput = bp.actions.scrapeWebsite.output.Output

export default new bp.Integration({
  register: async () => {},
  unregister: async () => {},
  actions: {
    scrapeWebsite : async (args): Promise<ScrapeWebsiteOutput> => {
      args.logger.forBot().info('Starting web scraping');

      const client = getApiConfig(args);
      const input = buildApiData(args);

      try {
        // Run the Apify actor and wait for it to finish
        const run = await client.actor('apify/website-content-crawler').call(input);

        // Fetch and print Actor results from the run's dataset
        const { items } = await client.dataset(run.defaultDatasetId).listItems();

        return { results: items, defaultDatasetId: run.defaultDatasetId };
      } catch (error: any) {
        args.logger.forBot().error('Error during scraping', error.message);
        throw new sdk.RuntimeError('Unexpected error during API call', error);
      }

      // Adding a return statement to handle all code paths
      // return { results: [], defaultDatasetId: '' };
    },
  },
  channels: {},
  handler: async () => {},
});
