import Link from 'next/link';
import { ArrowLeft, ShoppingBag } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mb-4">
        <ShoppingBag className="w-8 h-8" />
      </div>
      <h1 className="text-2xl font-black text-slate-900 mb-2">找不到此特價頁面</h1>
      <p className="text-sm text-slate-500 max-w-md mb-6">
        您所尋找的優惠情報可能已過期或下架，歡迎回到首頁探索最新熱門促銷！
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm transition-all active:scale-95 shadow-xs"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>返回特價情報首頁</span>
      </Link>
    </div>
  );
}
