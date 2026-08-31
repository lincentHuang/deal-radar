'use client';

import React, { useState } from 'react';
import { redeemDealVoucherAction } from '@/features/deals/server/deal.actions';
import { BubbleButton } from '@/shared/components/ui/bubble-button';
import { QrCode, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useMobileNative } from '@/shared/hooks/use-mobile-native';

export const MerchantQrScanner: React.FC = () => {
  const [voucherCode, setVoucherCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string; redeemedAt?: string } | null>(null);
  const { triggerHaptic } = useMobileNative();

  const handleRedeem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!voucherCode.trim()) return;

    setIsVerifying(true);
    setResult(null);

    // 模擬調用 Server Action 核銷
    const res = await redeemDealVoucherAction('deal-starbucks-bogo', voucherCode);

    setIsVerifying(false);
    setResult(res);

    if (res.success) {
      triggerHaptic('success');
      try {
        confetti({
          particleCount: 90,
          spread: 65,
          origin: { y: 0.6 },
        });
      } catch (e) {}
    } else {
      triggerHaptic('warning');
    }
  };

  const handleQuickFill = (code: string) => {
    triggerHaptic('light');
    setVoucherCode(code);
  };

  return (
    <div className="bg-white rounded-bubble-lg p-6 sm:p-8 border border-slate-100 shadow-bubble">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
          <QrCode className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-900">門市現場核銷小工具</h3>
          <p className="text-xs text-slate-500">輸入消費者出示的 6 位兌換序號或條碼進行即時驗證與扣額</p>
        </div>
      </div>

      <form onSubmit={handleRedeem} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            兌換序號 / 條碼輸入
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={voucherCode}
              onChange={(e) => setVoucherCode(e.target.value)}
              placeholder="例如：DEAL-8829-PX"
              className="flex-1 text-sm font-mono px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-white uppercase"
            />
            <BubbleButton
              type="submit"
              variant="mint"
              size="md"
              isLoading={isVerifying}
              disabled={isVerifying || !voucherCode.trim()}
            >
              {isVerifying ? '核銷中...' : '確認核銷'}
            </BubbleButton>
          </div>
        </div>

        {/* 快速測試序號按鈕 */}
        <div className="flex items-center gap-2 text-xs text-slate-500 pt-1">
          <span>快捷填入測試碼：</span>
          <button
            type="button"
            onClick={() => handleQuickFill('DEAL-8829-PX')}
            className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md hover:bg-emerald-100 font-mono font-medium"
          >
            DEAL-8829-PX
          </button>
          <button
            type="button"
            onClick={() => handleQuickFill('VOUCHER-2026')}
            className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md hover:bg-emerald-100 font-mono font-medium"
          >
            VOUCHER-2026
          </button>
        </div>

        {/* 核銷結果展示 */}
        {result && (
          <div
            className={`p-4 rounded-2xl text-xs flex items-start gap-3 mt-4 animate-fadeIn ${
              result.success
                ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                : 'bg-rose-50 text-rose-900 border border-rose-200'
            }`}
          >
            {result.success ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
            )}
            <div>
              <div className="font-bold text-sm">{result.message}</div>
              {result.redeemedAt && (
                <div className="text-[11px] text-slate-500 mt-1">
                  核銷時間戳記：{result.redeemedAt}
                </div>
              )}
            </div>
          </div>
        )}
      </form>
    </div>
  );
};
