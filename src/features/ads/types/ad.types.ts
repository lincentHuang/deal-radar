import { CreateAdCampaignInput } from '../schemas/ad-campaign.schema';

export type { CreateAdCampaignInput };
export type AdPlacement = 'hero_banner' | 'feed_native' | 'category_sticky';
export type AdBiddingModel = 'cpm' | 'cpc';
export type AdCampaignStatus = 'active' | 'pending' | 'paused' | 'completed';

export interface AdCampaign extends CreateAdCampaignInput {
  id: string;
  totalBudget: number;
  spentBudget: number;
  impressions: number;
  clicks: number;
  ctr: number; // Click-Through Rate (%)
  status: AdCampaignStatus;
  createdAt: string;
}

export interface TrafficEstimate {
  estimatedImpressions: { min: number; max: number };
  estimatedClicks: { min: number; max: number };
  estimatedAvgCtr: number; // e.g. 3.2%
  unitCost: number; // e.g. NT$ 120 / CPM or NT$ 3.5 / CPC
  totalBudget: number;
}
