'use client';

import React, { useState } from 'react';
import { useAtom } from 'jotai';
import { dealFiltersAtom } from '@/features/subscriptions/atoms/subscription-atoms';
import { TAIWAN_REGIONS } from '@/features/regions/data/taiwan-districts';
import { MapPin, ChevronDown, Check, Globe } from 'lucide-react';
import { useMobileNative } from '@/shared/hooks/use-mobile-native';

export const RegionFilterBar: React.FC = () => {
  const [filters, setFilters] = useAtom(dealFiltersAtom);
  const [isOpen, setIsOpen] = useState(false);
  const [tempCity, setTempCity] = useState(filters.selectedCity || '台北市');
  const { triggerHaptic } = useMobileNative();

  const QUICK_REGIONS = [
    { label: '🔥 全部地區', city: '全部地區', district: null },
    { label: '🌐 全台線上', city: '全台線上', district: null },
    { label: '📍 台北信義', city: '台北市', district: '信義區' },
    { label: '📍 台中西區', city: '台中市', district: '西區' },
    { label: '📍 新北板橋', city: '新北市', district: '板橋區' },
    { label: '📍 高雄左營', city: '高雄市', district: '左營區' },
  ];

  const handleQuickSelect = (city: string, district: string | null) => {
    triggerHaptic('light');
    setFilters((prev) => ({
      ...prev,
      selectedCity: city,
      selectedDistrict: district,
    }));
  };

  const handleApplyDropdown = (city: string, district: string | null) => {
    triggerHaptic('medium');
    setFilters((prev) => ({
      ...prev,
      selectedCity: city,
      selectedDistrict: district,
    }));
    setIsOpen(false);
  };

  const selectedDistrictsList = TAIWAN_REGIONS.find((r) => r.city === tempCity)?.districts || [];

  return (
    <div className="w-full relative mb-4">
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {/* 區域下拉選單按鈕 */}
        <div className="relative flex-shrink-0">
          <button
            type="button"
            onClick={() => {
              triggerHaptic('light');
              setIsOpen(!isOpen);
            }}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              filters.selectedCity !== '全部地區'
                ? 'bg-rose-500 text-white border-rose-500 shadow-sm'
                : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 shadow-sm'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>
              {filters.selectedCity === '全部地區'
                ? '切換區域'
                : `${filters.selectedCity} ${filters.selectedDistrict || '全區'}`}
            </span>
            <ChevronDown className="w-3 h-3 opacity-80" />
          </button>

          {/* 彈出式級聯區域選擇器 */}
          {isOpen && (
            <div className="absolute top-full left-0 mt-2 w-72 sm:w-80 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 z-40 animate-fadeIn">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-3">
                <span className="text-xs font-bold text-slate-800">選擇探索區域</span>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="text-xs text-slate-400 hover:text-slate-600"
                >
                  關閉
                </button>
              </div>

              {/* 縣市分頁 */}
              <div className="flex gap-1 overflow-x-auto no-scrollbar pb-2 mb-2 border-b border-slate-50">
                {TAIWAN_REGIONS.map((reg) => (
                  <button
                    key={reg.city}
                    type="button"
                    onClick={() => {
                      triggerHaptic('light');
                      setTempCity(reg.city);
                    }}
                    className={`text-xs px-2.5 py-1 rounded-full whitespace-nowrap font-medium transition-all ${
                      tempCity === reg.city
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {reg.city}
                  </button>
                ))}
              </div>

              {/* 行政區清單 */}
              <div className="grid grid-cols-3 gap-1.5 max-h-48 overflow-y-auto no-scrollbar py-1">
                <button
                  type="button"
                  onClick={() => handleApplyDropdown(tempCity, null)}
                  className={`text-xs p-1.5 rounded-lg text-center font-medium transition-all col-span-3 ${
                    filters.selectedCity === tempCity && filters.selectedDistrict === null
                      ? 'bg-rose-100 text-rose-700 font-bold border border-rose-200'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  {tempCity} (全區)
                </button>
                {selectedDistrictsList.map((dist) => {
                  const isSelected =
                    filters.selectedCity === tempCity && filters.selectedDistrict === dist;
                  return (
                    <button
                      key={dist}
                      type="button"
                      onClick={() => handleApplyDropdown(tempCity, dist)}
                      className={`text-xs p-1.5 rounded-lg text-center transition-all ${
                        isSelected
                          ? 'bg-rose-500 text-white font-semibold'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-600'
                      }`}
                    >
                      {dist}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* 快速熱門泡泡 Pills */}
        {QUICK_REGIONS.map((item) => {
          const isActive =
            filters.selectedCity === item.city &&
            filters.selectedDistrict === item.district;

          return (
            <button
              key={item.label}
              type="button"
              onClick={() => handleQuickSelect(item.city, item.district)}
              className={`flex-shrink-0 text-xs px-3.5 py-1.5 rounded-full font-medium transition-all duration-200 active:scale-95 ${
                isActive
                  ? 'bg-slate-900 text-white shadow-sm font-semibold'
                  : 'bg-white/90 hover:bg-slate-100 text-slate-600 border border-slate-200/80'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
