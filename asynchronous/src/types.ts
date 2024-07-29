
import * as bp from '.botpress'
type ValueOf<T> = T[keyof T]
export type ActionArgs = Parameters<ValueOf<bp.IntegrationProps['actions']>>[0]

// export interface ScrapeWebsiteInput {
//     startUrls: Array<{ url: string }>;
//     useSitemaps?: boolean;
//     crawlerType?: string;
//     // Add other fields as needed
//   }

export interface ApifyActorResponse {
  items: Record<string | number, unknown>[];
  defaultDatasetId: string;
}