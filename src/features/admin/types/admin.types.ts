import { 
  CrawlerTargetConfigInput, 
  CrawlerScheduleConfigInput, 
  CreateCrawlerTargetInput,
  BatchUpdateCrawlerScheduleInput,
  CrawlerScheduleMode 
} from '../schemas/admin.schema';

export type { CrawlerScheduleMode, CreateCrawlerTargetInput, BatchUpdateCrawlerScheduleInput };

export type CrawlerEngineType = 
  | 'gemini_multimodal' 
  | 'dom_selector' 
  | 'social_stream' 
  | 'media_deep_crawl';

export interface CrawlerRuleConfig {
  engine?: CrawlerEngineType;
  maxItems?: number;
  includeKeywords?: string[];
  excludeKeywords?: string[];
  customPrompt?: string;
  domSelectors?: {
    itemSelector?: string;
    titleSelector?: string;
    contentSelector?: string;
    imageSelector?: string;
  };
  description?: string;
}

export function parseTargetCrawlRule(ruleStr?: string | null): CrawlerRuleConfig {
  if (!ruleStr) return {};
  try {
    const parsed = JSON.parse(ruleStr);
    if (typeof parsed === 'object' && parsed !== null) {
      return parsed as CrawlerRuleConfig;
    }
  } catch {
    return { description: ruleStr };
  }
  return { description: ruleStr };
}

export function serializeTargetCrawlRule(config: CrawlerRuleConfig): string {
  return JSON.stringify(config);
}

export interface CrawlerTargetConfig extends CrawlerTargetConfigInput {}

export interface CrawlerScheduleConfig extends CrawlerScheduleConfigInput {}

export interface CrawlerJobLog {
  id: string;
  timestamp: string;
  targetId?: string;
  targetName?: string;
  type: 'manual' | 'scheduled' | 'auto_purge';
  status: 'started' | 'success' | 'failed';
  crawledCount: number;
  insertedCount: number;
  message: string;
  details?: Record<string, any> | null;
}

export type CrawlerProgressEventType = 
  | 'init' 
  | 'target_start' 
  | 'step' 
  | 'target_success' 
  | 'target_error' 
  | 'complete' 
  | 'error';

export interface CrawlerProgressEvent {
  type: CrawlerProgressEventType;
  timestamp: string;
  message: string;
  targetId?: string;
  targetName?: string;
  targetLogo?: string;
  targetIndex?: number;
  totalTargets?: number;
  currentStep?: 'connecting' | 'fetching_posts' | 'gemini_ai_parsing' | 'db_upsert' | 'complete';
  stepProgress?: number; // 0 - 100
  crawledCount?: number;
  insertedCount?: number;
  updatedCount?: number;
  purgedCount?: number;
  deals?: SmartDeal[];
  error?: string;
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



