# Apify Integration

This integration allows you to perform web scraping tasks using Apify directly within your chatbot conversations.

## Configuration

- `apiKey`: Your Apify API key.

## Actions

### Scrape Website

This action scrapes a website based on the provided input parameters.

#### Input

- `startUrls`: List of URLs to start scraping from.
- `useSitemaps`: (Optional) Whether to use sitemaps for scraping.
- `crawlerType`: (Optional) Crawler type to use for scraping.

#### Output

- `results`: Scraping results.
- `defaultDatasetId`: ID of the dataset with scraping results.
