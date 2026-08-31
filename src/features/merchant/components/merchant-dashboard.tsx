'use client';

import React, { useState } from 'react';
import { SmartDeal } from '@/features/deals/types/deal.types';
import { AdCampaign } from '@/features/ads/types/ad.types';
import { MerchantBrandDealsManager } from './merchant-brand-deals-manager';
import { MerchantBatchDmUploader } from './merchant-batch-dm-uploader';
import { MerchantAdCampaignCreator } from '@/features/ads/components/merchant-ad-campaign-creator';
import { MerchantAdCampaignList } from '@/features/ads/components/merchant-ad-campaign-list';
import { MerchantQrScanner } from './merchant-qr-scanner';
import { 
  Store, 
  FileUp, 
  Megaphone, 
  QrCode, 
  Layers, 
  Sparkles, 
  ShieldCheck, 
  ArrowLeft, 
  Check, 
  ChevronDown 
} from 'lucide-react';
import Link from 'next/link';
import { useMobileNative } from '@/shared/hooks/use-mobile-native';
import { useRouter } from 'next/navigation';

interface MerchantDashboardProps {
  allDeals: SmartDeal[];
  allCampaigns: AdCampaign[];
}

type MerchantTab = 'deals' | 'batch_dm' | 'ads' | 'voucher';

const PRESET_BRANDS = [
  '星巴克 Starbucks',
  '全家 FamilyMart',
  '7-ELEVEN',
  '全聯福利中心 PX MART',
  '麥當勞 McDonald\'s',
  '迷客夏 Milksha',
];

export const MerchantDashboard: React.FC<MerchantDashboardProps> = ({
  allDeals,
  allCampaigns,
}) => {
  const [selectedBrand, setSelectedBrand] = useState<string>(PRESET_BRANDS[0]);
  const [activeTab, setActiveTab] = useState<MerchantTab>('deals');
  const [isCustomBrand, setIsCustomBrand] = useState<boolean>(false);
  const [customBrandInput, setCustomBrandInput] = useState<string>('');
  const { triggerHaptic } = useMobileNative();
  const router = useRouter();

  const handleTabChange = (tab: MerchantTab) => {
    triggerHaptic('light');
    setActiveTab(tab);
  };

  const handleBrandSelect = (brand: string) => {
    triggerHaptic('light');
    setSelectedBrand(brand);
    setIsCustomBrand(false);
  };

  const handleCustomBrandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customBrandInput.trim()) return;
    triggerHaptic('medium');
    setSelectedBrand(customBrandInput.trim());
    setIsCustomBrand(false);
  };

  // 篩選當前品牌的特價卡片與廣告
  const currentBrandDeals = allDeals.filter((d) => 
    d.merchant.name.toLowerCase().includes(selectedBrand.toLowerCase()) ||
    selectedBrand.toLowerCase().includes(d.merchant.name.toLowerCase())
  );

  const currentBrandCampaigns = allCampaigns.filter((c) =>
    c.merchantName.toLowerCase().includes(selectedBrand.toLowerCase()) ||
    selectedBrand.toLowerCase().includes(c.merchantName.toLowerCase())
  );

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* 品牌快速切換器與身份欄 */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-bold">
            <Store className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-black text-white">{selectedBrand}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                已認證品牌
              </span>
            </div>
            <span className="text-[11px] text-slate-400">目前管理中特價活動：{currentBrandDeals.length} 檔</span>
          </div>
        </div>

        {/* 品牌快速切換按鈕 */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-bold text-slate-400 flex-shrink-0">切換品牌：</span>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 max-w-full">
            {PRESET_BRANDS.slice(0, 4).map((brand) => (
              <button
                key={brand}
                type="button"
                onClick={() => handleBrandSelect(brand)}
                className={`px-3 py-1.5 rounded-full text-xs font-extrabold transition-all cursor-pointer flex-shrink-0 ${
                  selectedBrand === brand
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                }`}
              >
                {brand}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 品牌主要 Tab 切換導覽 */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-1 overflow-x-auto">
        <button
          type="button"
          onClick={() => handleTabChange('deals')}
          className={`flex items-center gap-2 px-4 py-3 rounded-2xl text-xs sm:text-sm font-extrabold transition-all flex-shrink-0 cursor-pointer ${
            activeTab === 'deals'
              ? 'bg-slate-900 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/60'
          }`}
        >
          <Store className="w-4 h-4" />
          <span>品牌特價卡片 ({currentBrandDeals.length})</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange('batch_dm')}
          className={`flex items-center gap-2 px-4 py-3 rounded-2xl text-xs sm:text-sm font-extrabold transition-all flex-shrink-0 cursor-pointer ${
            activeTab === 'batch_dm'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/60'
          }`}
        >
          <FileUp className="w-4 h-4" />
          <span>📄 DM 海報批量製卡 (AI 快速拆解)</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange('ads')}
          className={`flex items-center gap-2 px-4 py-3 rounded-2xl text-xs sm:text-sm font-extrabold transition-all flex-shrink-0 cursor-pointer ${
            activeTab === 'ads'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/60'
          }`}
        >
          <Megaphone className="w-4 h-4" />
          <span>📢 廣告版面購買 & 流量投放</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange('voucher')}
          className={`flex items-center gap-2 px-4 py-3 rounded-2xl text-xs sm:text-sm font-extrabold transition-all flex-shrink-0 cursor-pointer ${
            activeTab === 'voucher'
              ? 'bg-slate-900 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/60'
          }`}
        >
          <QrCode className="w-4 h-4" />
          <span>門市核銷工具</span>
        </button>
      </div>

      {/* 4 大 Tab 內容裝配 */}
      {activeTab === 'deals' && (
        <MerchantBrandDealsManager
          brandName={selectedBrand}
          brandDeals={currentBrandDeals}
          onDealsChange={() => router.refresh()}
        />
      )}

      {activeTab === 'batch_dm' && (
        <MerchantBatchDmUploader
          brandName={selectedBrand}
          onPublished={() => {
            router.refresh();
            setActiveTab('deals');
          }}
        />
      )}

      {activeTab === 'ads' && (
        <div className="space-y-8">
          <MerchantAdCampaignCreator
            brandName={selectedBrand}
            onCampaignCreated={() => router.refresh()}
          />
          <MerchantAdCampaignList
            brandName={selectedBrand}
            campaigns={currentBrandCampaigns}
            onRefresh={() => router.refresh()}
          />
        </div>
      )}

      {activeTab === 'voucher' && (
        <div className="max-w-2xl mx-auto">
          <MerchantQrScanner />
        </div>
      )}
    </div>
  );
};
