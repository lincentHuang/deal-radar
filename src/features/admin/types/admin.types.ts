import { 
  CrawlerTargetConfigInput, 
  CrawlerScheduleConfigInput, 
  CreateCrawlerTargetInput,
  BatchUpdateCrawlerScheduleInput,
  CrawlerScheduleMode 
} from '../schemas/admin.schema';

export type { CrawlerScheduleMode, CreateCrawlerTargetInput, BatchUpdateCrawlerScheduleInput };

export interface CrawlerTargetConfig extends CrawlerTargetConfigInput {}

export interface CrawlerScheduleConfig extends CrawlerScheduleConfigInput {}

export interface CrawlerJobLog {
  id: string;
  timestamp: string;
  targetId?: string;
  targetName?: string;
  type: 'manual' | 'scheduled';
  status: 'started' | 'success' | 'failed';
  crawledCount: number;
  insertedCount: number;
  message: string;
}

import { SmartDeal } from '@/features/deals/types/deal.types';

export interface CrawlerExecutionResult {
  success: boolean;
  message: string;
  crawledCount: number;
  insertedCount: number;
  updatedCount: number;
  purgedCount: number;
  totalCount: number;
  createdDeals: SmartDeal[];
  updatedDeals: SmartDeal[];
  targetNames: string[];
}

export interface AdminStats {
  totalDeals: number;
  hotDeals: number;
  flashDeals: number;
  totalMerchants: number;
  activeCampaigns: number;
  crawlerTargetsCount: number;
  enabledTargetsCount: number;
}



