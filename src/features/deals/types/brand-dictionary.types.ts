export interface BrandMappingEntry {
  standardName: string;
  standardTag: string;
  aliases: string[];
  category?: 'food' | 'grocery' | 'tech' | 'fashion' | 'entertainment' | 'travel';
}
