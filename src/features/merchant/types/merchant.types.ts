import { DraftDealCard, BatchFlyerUploadInput } from '../schemas/batch-flyer.schema';

export type { DraftDealCard, BatchFlyerUploadInput };

export interface BrandStats {
  brandName: string;
  totalCards: number;
  totalViews: number;
  totalClicks: number;
  totalBookmarks: number;
  totalRedemptions: number;
}

export interface FlyerExtractionResult {
  sourceImageUrl: string;
  extractedCards: DraftDealCard[];
  processingTimeMs: number;
}
