import * as sdk from '@botpress/sdk'
import * as bp from '.botpress'


import { getApiConfig, buildApiData, getSimpleApiConfig, createWebhook, deleteWebhook } from './client';
import { apifyWebhookEventSchema } from './types';

type ScrapeWebsiteOutput = bp.actions.scrapeWebsite.output.Output

export default new bp.Integration({
  register: async () => {},
  unregister: async () => {},
  actions: {
    scrapeWebsite : async (args): Promise<ScrapeWebsiteOutput> => {
      args.logger.forBot().info('Starting web scraping');

      const client = getApiConfig(args);
      const input = buildApiData(args);

      //create webhook
      await createWebhook(args);

      try {
        // Run the Apify actor
        const run = await client.actor('apify/website-content-crawler').start(input);
        return { runId: run.defaultDatasetId };
        // return {runId: 'test'};
      } catch (error: any) {
        args.logger.forBot().error('Error during scraping', error.message);
        throw new sdk.RuntimeError('Unexpected error during API call', error);
      }
    },
  },
  channels: {},
  handler: async ({ ctx, logger, client, req })  => {
    const bodyObject = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
    logger.forBot().info('Received webhook event from Apify:', bodyObject);

    const clientApify = getSimpleApiConfig(ctx.configuration.apiKey);

    //apify doc : https://docs.apify.com/platform/integrations/webhooks/events
    try {
      // Fetch actor run details
      const runDataset = clientApify.dataset(bodyObject.resource.defaultDatasetId);
      const results = await runDataset.listItems();


      const eventData = {
        defaultDatasetId: bodyObject.resource.defaultDatasetId,
        results: results
      }
      
      try{
        // Create an event in Botpress with the scraping results
        const event = {
          type: 'scrapingCompleted',
          payload: {
            conversation: {
              id: bodyObject.conversationId
            },
            data: eventData
          }
        };

        await client.createEvent(event as any);

        logger.forBot().debug('Apify scraping completed event created successfully.', event)

        //delete Webhook
        const webhookUrl = `https://webhook.botpress.cloud/${ctx.webhookId}`
        try{
          await deleteWebhook(ctx.configuration.apiKey, webhookUrl)
          logger.forBot().info('Webhook deleted successfully.')
        }
        catch (error) {
          logger.forBot().error('Failed to delete webhook:', error)
        }
      }
      catch (error) {
        logger.forBot().error('Failed to create event:', error)
      }
      
    } catch (error) {
      logger.forBot().error('Failed to fetch results:', error)
    }
  }
});
