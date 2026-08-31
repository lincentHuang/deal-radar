'use client';

import { useState, useEffect, useCallback } from 'react';

/**
 * 跨端原生功能適配 Hook (支援 Web Fallback 與 Capacitor Native 擴充)
 */
export function useMobileNative() {
  const [isNative, setIsNative] = useState<boolean>(false);

  useEffect(() => {
    // 偵測是否運行在 Capacitor 原生環境
    if (typeof window !== 'undefined' && (window as any).Capacitor) {
      setIsNative(true);
    }
  }, []);

  // 原生觸覺反饋 (Haptics Vibration with Web Fallback)
  const triggerHaptic = useCallback((type: 'light' | 'medium' | 'success' | 'warning' | 'error' = 'light') => {
    if (typeof window === 'undefined') return;

    try {
      if ('vibrate' in navigator) {
        switch (type) {
          case 'light':
            navigator.vibrate(10);
            break;
          case 'medium':
            navigator.vibrate(25);
            break;
          case 'success':
            navigator.vibrate([15, 30, 20]);
            break;
          case 'warning':
            navigator.vibrate([30, 40, 30]);
            break;
          case 'error':
            navigator.vibrate([50, 50, 50]);
            break;
        }
      }
    } catch (e) {
      // 忽略不支援裝置的錯誤
    }
  }, []);

  // 跨端剪貼簿
  const copyToClipboard = useCallback(async (text: string): Promise<boolean> => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(text);
        triggerHaptic('success');
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, [triggerHaptic]);

  // 跨端分享 (Web Share API)
  const shareContent = useCallback(async (data: { title: string; text: string; url: string }): Promise<boolean> => {
    try {
      if (typeof navigator !== 'undefined' && navigator.share) {
        await navigator.share(data);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, []);

  return {
    isNative,
    triggerHaptic,
    copyToClipboard,
    shareContent,
  };
}
