'use client';

import React, { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import * as Dialog from '@radix-ui/react-dialog';
import { dealFiltersAtom } from '@/features/subscriptions/atoms/subscription-atoms';
import { ChannelType, SelectedRegionItem } from '@/features/deals/types/deal.types';
import { TAIWAN_REGIONS } from '@/features/regions/data/taiwan-districts';
import { 
  X, 
  SlidersHorizontal, 
  MapPin, 
  Store, 
  RotateCcw, 
  Check, 
  Calendar,
  Trash2
} from 'lucide-react';
import { useMobileNative } from '@/shared/hooks/use-mobile-native';

interface DealFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DealFilterModal: React.FC<DealFilterModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [filters, setFilters] = useAtom(dealFiltersAtom);
  const { triggerHaptic } = useMobileNative();

  // 本地暫存狀態 (專注於通路、地區標籤多選與日期排序)
  const [tempChannel, setTempChannel] = useState<ChannelType>(filters.channelType || 'all');
  const [tempRegions, setTempRegions] = useState<SelectedRegionItem[]>([]);
  const [tempSortBy, setTempSortBy] = useState<'latest' | 'discount' | 'popular' | 'expiring'>(filters.sortBy || 'latest');

  // 地區選擇器的縣市 Tab 狀態
  const [activeCityTab, setActiveCityTab] = useState<string>('台北市');

  useEffect(() => {
    if (isOpen) {
      setTempChannel(filters.channelType || 'all');
      let initialRegs: SelectedRegionItem[] = [];
      if (filters.selectedRegions && filters.selectedRegions.length > 0) {
        initialRegs = [...filters.selectedRegions];
      } else if (filters.selectedCity && filters.selectedCity !== '全部地區') {
        initialRegs = [{ city: filters.selectedCity, district: filters.selectedDistrict || null }];
      }
      setTempRegions(initialRegs);
      setTempSortBy(filters.sortBy || 'latest');
      if (initialRegs.length > 0 && initialRegs[0].city !== '全部地區') {
        setActiveCityTab(initialRegs[0].city);
      }
    }
  }, [isOpen, filters]);

  const SORTS = [
    { label: '✨ 最新發布 (日期)', value: 'latest' as const, desc: '依情報發布時間最新排序' },
    { label: '⏳ 即將截止 (期限)', value: 'expiring' as const, desc: '進行中快要到期優先把握' },
    { label: '🔥 最多按讚 (熱門)', value: 'popular' as const, desc: '社群讚數最高推薦' },
    { label: '💰 最大降幅 (折數)', value: 'discount' as const, desc: '打折比例最高・越便宜越前' },
  ];

  const isRegionSelected = (city: string, district: string | null): boolean => {
    return tempRegions.some((r) => r.city === city && r.district === district);
  };

  const handleToggleRegion = (city: string, district: string | null) => {
    triggerHaptic('light');
    if (district === null) {
      // 點擊「全區門市」
      const isCurrentlySelected = isRegionSelected(city, null);
      if (isCurrentlySelected) {
        // 取消全區
        setTempRegions((prev) => prev.filter((r) => r.city !== city));
      } else {
        // 選取全區：自動清除同縣市底下所有個別行政區，僅保留全區
        setTempRegions((prev) => [
          ...prev.filter((r) => r.city !== city),
          { city, district: null },
        ]);
      }
    } else {
      // 點擊特定行政區：若已選全區則忽略
      if (isRegionSelected(city, null)) return;

      const exists = isRegionSelected(city, district);
      if (exists) {
        setTempRegions((prev) => prev.filter((r) => !(r.city === city && r.district === district)));
      } else {
        setTempRegions((prev) => [...prev, { city, district }]);
      }
    }
  };

  const handleRemoveRegion = (city: string, district: string | null) => {
    triggerHaptic('light');
    setTempRegions((prev) => prev.filter((r) => !(r.city === city && r.district === district)));
  };

  const handleClearAllRegions = () => {
    triggerHaptic('medium');
    setTempRegions([]);
  };

  const handleReset = () => {
    triggerHaptic('medium');
    setTempChannel('all');
    setTempRegions([]);
    setTempSortBy('latest');
  };

  const handleApply = () => {
    triggerHaptic('success');
    const firstRegion = tempRegions[0];
    setFilters((prev) => ({
      ...prev,
      channelType: tempChannel,
      selectedCity: tempRegions.length === 0 ? '全部地區' : (firstRegion.district ? `${firstRegion.city} ${firstRegion.district}` : firstRegion.city),
      selectedDistrict: tempRegions.length === 1 ? firstRegion.district : null,
      selectedRegions: tempRegions,
      sortBy: tempSortBy,
    }));
    onClose();
  };

  // 計算已生效自訂條件數量
  const activeFilterCount = [
    tempChannel !== 'all',
    tempRegions.length > 0,
    tempSortBy !== 'latest',
  ].filter(Boolean).length;

  const currentDistricts = TAIWAN_REGIONS.find((r) => r.city === activeCityTab)?.districts || [];

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <Dialog.Portal>
        {/* 背景遮罩 */}
        <Dialog.Overlay className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm animate-fadeIn" />

        {/* 內容主體 */}
        <Dialog.Content 
          aria-describedby="dialog-filter-desc"
          className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[calc(100%-2rem)] max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[88vh] animate-scaleUp focus:outline-none"
        >
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-500 text-white flex items-center justify-center shadow-md">
                <SlidersHorizontal className="w-5 h-5" />
              </div>
              <div>
                <Dialog.Title className="text-lg font-black text-slate-900">
                  進階情報篩選
                </Dialog.Title>
                <Dialog.Description id="dialog-filter-desc" className="text-xs text-slate-500 font-medium mt-0.5">
                  自訂通路模式、探索商圈與排序日期；主題品項由上方標籤一鍵聚合！
                </Dialog.Description>
              </div>
            </div>
            <Dialog.Close asChild>
              <button
                type="button"
                className="w-8 h-8 rounded-full bg-slate-200/70 hover:bg-slate-300 text-slate-600 flex items-center justify-center transition-all active:scale-90 cursor-pointer"
                title="關閉"
              >
                <X className="w-4 h-4" />
              </button>
            </Dialog.Close>
          </div>

          {/* 滾動篩選區塊 */}
          <div className="overflow-y-auto p-5 sm:p-6 space-y-6 flex-1 divide-y divide-slate-100">
            {/* 1. 通路模式 (線上電商 / 實體門市) */}
            <div className="space-y-3">
              <label className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Store className="w-3.5 h-3.5 text-rose-500" />
                <span>1. 通路類型 (Channel)</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'all' as ChannelType, label: '全部通路', desc: '線上與實體' },
                  { value: 'online' as ChannelType, label: '🛍️ 線上電商', desc: 'Momo/蝦皮等' },
                  { value: 'offline' as ChannelType, label: '🏪 實體門市', desc: '全台實體店家' },
                ].map((item) => {
                  const isSelected = tempChannel === item.value;
                  return (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => {
                        triggerHaptic('light');
                        setTempChannel(item.value);
                      }}
                      className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-rose-50 border-rose-400 text-rose-700 font-bold shadow-xs'
                          : 'bg-slate-50/70 hover:bg-slate-100 border-slate-200/70 text-slate-700'
                      }`}
                    >
                      <span className="text-xs sm:text-sm block">{item.label}</span>
                      <span className="text-[10px] text-slate-400 block mt-0.5 font-normal">
                        {item.desc}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. 探索地區商圈 (Tag 多選器 + 縣市行政區) */}
            <div className="pt-5 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-rose-500" />
                  <span>2. 探索地區商圈 (Location)</span>
                </label>

                {tempRegions.length > 0 && (
                  <button
                    type="button"
                    onClick={handleClearAllRegions}
                    className="text-[11px] font-bold text-rose-500 hover:text-rose-600 flex items-center gap-1 transition-all cursor-pointer active:scale-95 px-2 py-0.5 rounded-lg hover:bg-rose-50"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>全部清空 ({tempRegions.length})</span>
                  </button>
                )}
              </div>

              {/* 目前已選取的地區 Tag 多選器 */}
              <div className="flex flex-wrap items-center gap-1.5 min-h-[42px] p-2.5 bg-slate-50 rounded-2xl border border-slate-200/80">
                {tempRegions.length === 0 ? (
                  <div className="flex items-center gap-2 text-xs text-slate-400 font-medium px-2 py-1 select-none">
                    <span className="w-2 h-2 rounded-full bg-slate-300"></span>
                    <span>預設為「全部地區」（點選下方縣市/行政區加入標籤）</span>
                  </div>
                ) : (
                  tempRegions.map((reg, idx) => {
                    const isOnline = reg.city === '全台線上';
                    const tagLabel = isOnline
                      ? (reg.district ? `🌐 線上 · ${reg.district}` : '🌐 全台線上')
                      : (reg.district ? `📍 ${reg.city} · ${reg.district}` : `📍 ${reg.city} (全區)`);

                    return (
                      <span
                        key={`${reg.city}-${reg.district || 'all'}-${idx}`}
                        className="inline-flex items-center gap-1.5 text-xs font-bold pl-2.5 pr-1.5 py-1 rounded-xl bg-slate-900 text-white shadow-xs animate-fadeIn group"
                      >
                        <span>{tagLabel}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveRegion(reg.city, reg.district)}
                          className="w-4 h-4 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center text-[10px] transition-colors cursor-pointer"
                          title={`移除 ${tagLabel}`}
                        >
                          <X className="w-2.5 h-2.5" />
                        </button>
                      </span>
                    );
                  })
                )}
              </div>

              {/* 縣市分頁 + 行政區網格 */}
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/70 space-y-2.5">
                <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1 border-b border-slate-200/60">
                  {TAIWAN_REGIONS.map((reg) => {
                    const isTabActive = activeCityTab === reg.city;
                    const citySelectedCount = tempRegions.filter((r) => r.city === reg.city).length;
                    return (
                      <button
                        key={reg.city}
                        type="button"
                        onClick={() => {
                          triggerHaptic('light');
                          setActiveCityTab(reg.city);
                        }}
                        className={`text-xs px-2.5 py-1 rounded-full whitespace-nowrap font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                          isTabActive
                            ? 'bg-rose-500 text-white shadow-xs'
                            : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/70'
                        }`}
                      >
                        <span>{reg.city}</span>
                        {citySelectedCount > 0 && !isTabActive && (
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5 max-h-36 overflow-y-auto no-scrollbar py-1">
                  {(() => {
                    const isAllCitySelected = isRegionSelected(activeCityTab, null);
                    const allCityLabel = activeCityTab === '全台線上' ? '全台線上 (所有電商通路)' : `${activeCityTab} (全區門市)`;
                    return (
                      <button
                        type="button"
                        onClick={() => handleToggleRegion(activeCityTab, null)}
                        className={`text-xs p-1.5 rounded-xl text-center font-semibold transition-all col-span-3 sm:col-span-4 cursor-pointer flex items-center justify-center gap-1.5 ${
                          isAllCitySelected
                            ? 'bg-rose-500 text-white font-bold shadow-xs'
                            : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200/50'
                        }`}
                      >
                        {isAllCitySelected && <Check className="w-3.5 h-3.5" />}
                        <span>{allCityLabel}</span>
                      </button>
                    );
                  })()}

                  {(() => {
                    const isAllCitySelected = isRegionSelected(activeCityTab, null);
                    return currentDistricts.map((dist) => {
                      const isDistSelected = isRegionSelected(activeCityTab, dist);
                      return (
                        <button
                          key={dist}
                          type="button"
                          disabled={isAllCitySelected}
                          onClick={() => handleToggleRegion(activeCityTab, dist)}
                          className={`text-xs p-1.5 rounded-xl text-center transition-all flex items-center justify-center gap-1 ${
                            isAllCitySelected
                              ? 'bg-slate-100/70 text-slate-400 border border-slate-200/40 cursor-not-allowed opacity-60'
                              : isDistSelected
                              ? 'bg-rose-500 text-white font-bold shadow-xs cursor-pointer'
                              : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200/50 cursor-pointer'
                          }`}
                          title={isAllCitySelected ? `已選取「${activeCityTab} (全區門市)」，已自動涵蓋所有行政區` : dist}
                        >
                          {isDistSelected && !isAllCitySelected && <Check className="w-3 h-3 flex-shrink-0" />}
                          <span className="truncate">{dist}</span>
                        </button>
                      );
                    });
                  })()}
                </div>
              </div>
            </div>

            {/* 3. 排序方式與日期 */}
            <div className="pt-5 space-y-3">
              <label className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-rose-500" />
                <span>3. 日期與排序 (Date & Sort)</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {SORTS.map((s) => {
                  const isSelected = tempSortBy === s.value;
                  return (
                    <button
                      key={s.value}
                      type="button"
                      onClick={() => {
                        triggerHaptic('light');
                        setTempSortBy(s.value);
                      }}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                          : 'bg-slate-50/70 hover:bg-slate-100 text-slate-700 border-slate-200/70'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs sm:text-sm font-bold">{s.label}</span>
                        {isSelected && <Check className="w-4 h-4 text-emerald-400" />}
                      </div>
                      <span className={`text-[11px] block mt-0.5 ${isSelected ? 'text-slate-300' : 'text-slate-400'}`}>
                        {s.desc}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Footer 動作按鈕 */}
          <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleReset}
              className="text-xs font-bold px-4 py-2.5 rounded-full text-slate-500 hover:text-slate-800 hover:bg-slate-200/80 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>重置全部</span>
            </button>

            <button
              type="button"
              onClick={handleApply}
              className="text-xs sm:text-sm font-extrabold px-6 py-2.5 rounded-full bg-rose-500 hover:bg-rose-600 text-white shadow-md transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 ml-auto"
            >
              <span>套用篩選設定</span>
              {activeFilterCount > 0 && <span>({activeFilterCount})</span>}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
