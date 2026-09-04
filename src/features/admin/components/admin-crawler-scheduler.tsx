'use client';

import React, { useState, useEffect } from 'react';
import { 
  CrawlerTargetConfig, 
  CrawlerScheduleConfig, 
  CrawlerJobLog, 
  CrawlerScheduleMode,
  CrawlerExecutionResult,
  CrawlerRuleConfig,
  CrawlerEngineType,
  parseTargetCrawlRule,
  serializeTargetCrawlRule
} from '../types/admin.types';
import { CrawlerResultModal } from './crawler-result-modal';
import { CrawlerProgressModal } from './crawler-progress-modal';
import { 
  updateCrawlerTargetAction, 
  updateCrawlerScheduleAction, 
  triggerManualCrawlAction,
  createCrawlerTargetAction,
  updateCrawlerTargetDetailsAction,
  batchUpdateCrawlerTargetsAction,
  deleteCrawlerTargetAction,
  batchDeleteCrawlerTargetsAction,
  restoreDefaultCrawlerTargetsAction,
  crawlSingleBlogArticleAction,
  reorderCrawlerTargetsAction,
  batchToggleBrandGroupAction,
  batchSetBrandGroupAction,
  getTargetDealsStatsAction,
  updateBrandGroupIconAction,
  fetchFacebookAvatarAction
} from '../server/admin.actions';
import { 
  Bot, 
  Clock, 
  Play, 
  RefreshCw, 
  Check, 
  AlertCircle, 
  Terminal, 
  Globe, 
  Sliders, 
  Sparkles, 
  Store,
  Zap,
  Plus,
  Edit3,
  Trash2,
  X,
  CheckSquare,
  Square,
  Layers,
  Settings2,
  Calendar,
  BookOpen,
  Search,
  ExternalLink,
  RotateCcw,
  Cpu,
  FileCode,
  Tag,
  Filter,
  Code,
  Info,
  GripVertical,
  ArrowUpDown,
  FolderKanban,
  ChevronDown,
  ChevronRight,
  SlidersHorizontal,
  ListFilter,
  MessageSquare,
  Users
} from 'lucide-react';
import { useMobileNative } from '@/shared/hooks/use-mobile-native';
import Image from 'next/image';
import { SmartDeal } from '@/features/deals/types/deal.types';

interface AdminCrawlerSchedulerProps {
  initialTargets: CrawlerTargetConfig[];
  initialSchedule: CrawlerScheduleConfig;
  initialLogs: CrawlerJobLog[];
  initialBrandGroupIcons?: Record<string, string>;
  onRefresh?: () => void;
  onViewDealsTab?: () => void;
}

export const AdminCrawlerScheduler: React.FC<AdminCrawlerSchedulerProps> = ({
  initialTargets,
  initialSchedule,
  initialLogs,
  initialBrandGroupIcons,
  onRefresh,
  onViewDealsTab,
}) => {
  const [targets, setTargets] = useState<CrawlerTargetConfig[]>(initialTargets);
  const [schedule, setSchedule] = useState<CrawlerScheduleConfig>(initialSchedule);
  const [logs, setLogs] = useState<CrawlerJobLog[]>(initialLogs);
  const [brandGroupIcons, setBrandGroupIcons] = useState<Record<string, string>>(initialBrandGroupIcons || {});
  
  // 品牌群組 Icon 設定 Modal 狀態
  const [editingGroupIconBrand, setEditingGroupIconBrand] = useState<string | null>(null);
  const [groupIconInput, setGroupIconInput] = useState<string>('');
  const [isFetchingFbAvatar, setIsFetchingFbAvatar] = useState<boolean>(false);
  const [isSavingGroupIcon, setIsSavingGroupIcon] = useState<boolean>(false);
  const [isFetchingSingleTargetFbAvatar, setIsFetchingSingleTargetFbAvatar] = useState<boolean>(false);

  const [selectedTargetIds, setSelectedTargetIds] = useState<string[]>([]);
  const [targetTypeFilter, setTargetTypeFilter] = useState<'all' | 'fanpage' | 'official_web' | 'blog_media' | 'community'>('all');
  
  // 多維度排序 (Sort) 與進階篩選 (Filter) 狀態
  const [sortBy, setSortBy] = useState<'custom' | 'name-asc' | 'name-desc' | 'status' | 'crawled' | 'recent' | 'brand'>('custom');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'enabled' | 'disabled'>('all');
  const [brandFilter, setBrandFilter] = useState<string>('all');

  // 拖曳排序 (Drag & Drop) 狀態
  const [draggedTargetId, setDraggedTargetId] = useState<string | null>(null);
  const [dragOverTargetId, setDragOverTargetId] = useState<string | null>(null);
  const [isSavingOrder, setIsSavingOrder] = useState<boolean>(false);

  // 品牌群組折疊狀態與新增站點預填品牌
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});
  const [defaultBrandGroupForAdd, setDefaultBrandGroupForAdd] = useState<string>('');
  const [customBrandInput, setCustomBrandInput] = useState<boolean>(false);
  const [customBrandName, setCustomBrandName] = useState<string>('');
  const [addTargetBrandGroup, setAddTargetBrandGroup] = useState<string>('');
  
  // 食尚玩家 / 部落格單篇網址快速採集器狀態
  const [singleArticleUrl, setSingleArticleUrl] = useState<string>('https://supertaste.tvbs.com.tw/food/360820');
  const [isCrawlingSingleArticle, setIsCrawlingSingleArticle] = useState<boolean>(false);
  
  // 狀態與彈窗
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [runningTargetId, setRunningTargetId] = useState<string | null>(null);
  const [extractedPreviewDeals, setExtractedPreviewDeals] = useState<SmartDeal[]>([]);
  const [crawlerExecutionResult, setCrawlerExecutionResult] = useState<CrawlerExecutionResult | null>(null);
  const [isResultModalOpen, setIsResultModalOpen] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [isAddTargetModalOpen, setIsAddTargetModalOpen] = useState<boolean>(false);
  
  const [editingTarget, setEditingTarget] = useState<CrawlerTargetConfig | null>(null);
  const [editTab, setEditTab] = useState<'basic' | 'schedule' | 'logic' | 'deals'>('basic');
  const [editingRuleConfig, setEditingRuleConfig] = useState<CrawlerRuleConfig>({});
  const [targetDealsData, setTargetDealsData] = useState<{
    totalCrawled: number;
    activeCount: number;
    expiredCount: number;
    activeDeals: SmartDeal[];
    expiredDeals: SmartDeal[];
  } | null>(null);
  const [isLoadingTargetDeals, setIsLoadingTargetDeals] = useState<boolean>(false);
  const [showExpiredDeals, setShowExpiredDeals] = useState<boolean>(false);
  const [isRestoringDefaults, setIsRestoringDefaults] = useState<boolean>(false);
  const [isBatchDeleting, setIsBatchDeleting] = useState<boolean>(false);
  
  const [isBatchScheduleModalOpen, setIsBatchScheduleModalOpen] = useState<boolean>(false);
  const [isBatchGroupModalOpen, setIsBatchGroupModalOpen] = useState<boolean>(false);
  const [batchSelectedGroup, setBatchSelectedGroup] = useState<string>('');
  const [batchCustomGroupName, setBatchCustomGroupName] = useState<string>('');
  const [isSavingBatchGroup, setIsSavingBatchGroup] = useState<boolean>(false);

  // 🚀 即時爬蟲視覺化處理狀況 Modal 狀態
  const [isProgressModalOpen, setIsProgressModalOpen] = useState<boolean>(false);
  const [progressModalParams, setProgressModalParams] = useState<{
    targetIds?: string[] | string;
    articleUrl?: string;
  } | null>(null);
  const [progressModalScopeLabel, setProgressModalScopeLabel] = useState<string>('全通路站點');

  // 同步外部傳入的最新資料 (當父層 refresh 時即時更新)
  useEffect(() => {
    setTargets(initialTargets);
  }, [initialTargets]);

  useEffect(() => {
    setSchedule(initialSchedule);
  }, [initialSchedule]);

  useEffect(() => {
    setLogs(initialLogs);
  }, [initialLogs]);

  useEffect(() => {
    if (initialBrandGroupIcons) {
      setBrandGroupIcons(initialBrandGroupIcons);
    }
  }, [initialBrandGroupIcons]);

  // 批量排程設定表單狀態
  const [batchScheduleMode, setBatchScheduleMode] = useState<CrawlerScheduleMode>('inherit');
  const [batchCustomTimes, setBatchCustomTimes] = useState<string>('09:00, 15:00');
  const [batchIntervalMinutes, setBatchIntervalMinutes] = useState<number>(60);

  const { triggerHaptic } = useMobileNative();

  const showFeedback = (text: string, type: 'success' | 'error' = 'success') => {
    setFeedback({ text, type });
    setTimeout(() => setFeedback(null), 4000);
  };

  // 全選 / 取消全選
  const handleToggleSelectAll = () => {
    triggerHaptic('light');
    if (selectedTargetIds.length === targets.length) {
      setSelectedTargetIds([]);
    } else {
      setSelectedTargetIds(targets.map((t) => t.id));
    }
  };

  const handleToggleSelectOne = (targetId: string) => {
    triggerHaptic('light');
    if (selectedTargetIds.includes(targetId)) {
      setSelectedTargetIds(selectedTargetIds.filter((id) => id !== targetId));
    } else {
      setSelectedTargetIds([...selectedTargetIds, targetId]);
    }
  };

  // 單站開關
  const handleToggleTarget = async (targetId: string, currentEnabled: boolean) => {
    triggerHaptic('light');
    const res = await updateCrawlerTargetAction(targetId, !currentEnabled);
    if (res.success && res.target) {
      setTargets((prev) => prev.map((t) => (t.id === targetId ? res.target! : t)));
      showFeedback(`已${!currentEnabled ? '啟用' : '停用'}【${res.target.name}】爬蟲`);
      onRefresh?.();
    }
  };

  // 批量啟用 / 批量停用
  const handleBatchToggleEnabled = async (enabled: boolean) => {
    if (selectedTargetIds.length === 0) return;
    triggerHaptic('medium');
    const res = await batchUpdateCrawlerTargetsAction(selectedTargetIds, { enabled });
    if (res.success) {
      setTargets((prev) =>
        prev.map((t) => (selectedTargetIds.includes(t.id) ? { ...t, enabled } : t))
      );
      showFeedback(`已批量將 ${res.updatedCount} 個站點設定為：${enabled ? '啟用' : '停用'}`);
      onRefresh?.();
    }
  };

  // 批量設定排程提交
  const handleBatchScheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedTargetIds.length === 0) return;

    triggerHaptic('medium');
    const times = batchCustomTimes.split(/[,，、\s]/).map((s) => s.trim()).filter(Boolean);
    const res = await batchUpdateCrawlerTargetsAction(selectedTargetIds, {
      scheduleMode: batchScheduleMode,
      customScheduleTimes: times,
      customIntervalMinutes: batchIntervalMinutes,
    });

    if (res.success) {
      setTargets((prev) =>
        prev.map((t) =>
          selectedTargetIds.includes(t.id)
            ? {
                ...t,
                scheduleMode: batchScheduleMode,
                customScheduleTimes: times,
                customIntervalMinutes: batchIntervalMinutes,
              }
            : t
        )
      );
      setIsBatchScheduleModalOpen(false);
      showFeedback(`🎉 已成功為 ${res.updatedCount} 個站點更新排程設定！`);
      onRefresh?.();
    }
  };

  // 批量設定所選站點的品牌群組
  const handleSaveBatchGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedTargetIds.length === 0) return;

    let targetGroup: string | null = null;
    if (batchSelectedGroup === '__none__') {
      targetGroup = null;
    } else if (batchSelectedGroup === '__custom__') {
      if (!batchCustomGroupName.trim()) {
        showFeedback('請輸入欲建立的品牌群組名稱', 'error');
        return;
      }
      targetGroup = batchCustomGroupName.trim();
    } else {
      targetGroup = batchSelectedGroup.trim() || null;
    }

    triggerHaptic('medium');
    setIsSavingBatchGroup(true);
    const res = await batchSetBrandGroupAction(selectedTargetIds, targetGroup);
    setIsSavingBatchGroup(false);

    if (res.success) {
      setTargets((prev) =>
        prev.map((t) =>
          selectedTargetIds.includes(t.id)
            ? { ...t, brandGroup: targetGroup || undefined }
            : t
        )
      );
      setIsBatchGroupModalOpen(false);
      showFeedback(res.message);
      onRefresh?.();
    } else {
      showFeedback(res.message || '批量設定群組失敗', 'error');
    }
  };

  // 載入特定站點的情報成效與線上優惠清單
  const fetchTargetDeals = async (targetId: string) => {
    setIsLoadingTargetDeals(true);
    const res = await getTargetDealsStatsAction(targetId);
    if (res.success && res.data) {
      setTargetDealsData(res.data);
    }
    setIsLoadingTargetDeals(false);
  };

  // 開啟品牌群組 Icon 設定 Modal
  const handleOpenGroupIconModal = (brandName: string, defaultIcon?: string) => {
    triggerHaptic('light');
    setEditingGroupIconBrand(brandName);
    setGroupIconInput(brandGroupIcons[brandName] || defaultIcon || '');
  };

  // 為當前編輯的群組自動從 FB 粉絲團擷取最新官方頭像
  const handleFetchFbAvatarForGroup = async () => {
    if (!editingGroupIconBrand) return;
    const brandTargets = targets.filter((t) => t.brandGroup === editingGroupIconBrand);
    const fbTarget = brandTargets.find((t) => t.url.includes('facebook.com')) || brandTargets[0];
    if (!fbTarget) {
      showFeedback('此群組內尚未加入任何 Facebook 粉絲團網址', 'error');
      return;
    }

    setIsFetchingFbAvatar(true);
    const res = await fetchFacebookAvatarAction(fbTarget.url);
    setIsFetchingFbAvatar(false);

    if (res.success && res.avatarUrl) {
      setGroupIconInput(res.avatarUrl);
      showFeedback(`🎉 成功從【${fbTarget.name}】取得官方 FB 大頭貼！`);
    } else {
      showFeedback(res.message || '無法取得 FB 頭像，請確認粉絲團網址', 'error');
    }
  };

  // 儲存品牌群組專屬 Icon
  const handleSaveGroupIcon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGroupIconBrand) return;

    triggerHaptic('medium');
    setIsSavingGroupIcon(true);
    const res = await updateBrandGroupIconAction(editingGroupIconBrand, groupIconInput.trim() || null);
    setIsSavingGroupIcon(false);

    if (res.success) {
      setBrandGroupIcons((prev) => {
        const next = { ...prev };
        if (groupIconInput.trim()) {
          next[editingGroupIconBrand] = groupIconInput.trim();
        } else {
          delete next[editingGroupIconBrand];
        }
        return next;
      });
      setEditingGroupIconBrand(null);
      showFeedback(res.message);
      onRefresh?.();
    } else {
      showFeedback(res.message || '儲存群組 Icon 失敗', 'error');
    }
  };

  // 開啟詳細編輯彈窗 (解析 crawlRule 並載入情報紀錄)
  const handleOpenEditModal = (target: CrawlerTargetConfig) => {
    triggerHaptic('light');
    setEditingTarget({ ...target });
    setEditingRuleConfig(parseTargetCrawlRule(target.crawlRule));
    setEditTab('basic');
    setTargetDealsData(null);
    setShowExpiredDeals(false);
    fetchTargetDeals(target.id);
  };

  // 單站詳細編輯提交 (包含基本設定、排程與爬蟲邏輯)
  const handleSaveEditingTarget = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTarget) return;

    triggerHaptic('medium');
    const serializedRule = serializeTargetCrawlRule(editingRuleConfig);

    const res = await updateCrawlerTargetDetailsAction(editingTarget.id, {
      name: editingTarget.name,
      url: editingTarget.url,
      logo: editingTarget.logo,
      targetType: editingTarget.targetType,
      defaultCategory: editingTarget.defaultCategory,
      scheduleMode: editingTarget.scheduleMode,
      customScheduleTimes: editingTarget.customScheduleTimes,
      customIntervalMinutes: editingTarget.customIntervalMinutes,
      enabled: editingTarget.enabled,
      crawlRule: serializedRule,
      brandGroup: editingTarget.brandGroup,
    });

    if (res.success && res.target) {
      setTargets((prev) => prev.map((t) => (t.id === editingTarget.id ? res.target! : t)));
      setEditingTarget(null);
      showFeedback(`🎉 已成功儲存【${editingTarget.name}】站點設定與爬蟲邏輯！`);
      onRefresh?.();
    } else {
      showFeedback(res.message || '更新失敗', 'error');
    }
  };

  // 新增站點提交
  const handleCreateTargetSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    triggerHaptic('medium');
    const formData = new FormData(e.currentTarget);
    const res = await createCrawlerTargetAction(formData);

    if (res.success && res.target) {
      setTargets([res.target, ...targets]);
      setIsAddTargetModalOpen(false);
      showFeedback(res.message);
      onRefresh?.();
    } else {
      showFeedback(res.message || '新增站點失敗', 'error');
    }
  };

  // 刪除爬蟲目標站點 (支援所有站點刪除)
  const handleDeleteTarget = async (targetId: string, name: string) => {
    if (!confirm(`確定要刪除爬蟲目標站點【${name}】嗎？\n\n（若誤刪官方推薦站點，後續可隨時點擊「恢復預設推薦」補回）`)) {
      return;
    }
    triggerHaptic('warning');
    const res = await deleteCrawlerTargetAction(targetId, name);
    if (res.success) {
      setTargets((prev) => prev.filter((t) => t.id !== targetId));
      setSelectedTargetIds((prev) => prev.filter((id) => id !== targetId));
      showFeedback(`已成功刪除站點【${name}】`);
      onRefresh?.();
    } else {
      showFeedback(res.message, 'error');
    }
  };

  // 批量刪除已選取之爬蟲站點
  const handleBatchDelete = async () => {
    if (selectedTargetIds.length === 0) return;
    if (!confirm(`確定要批量刪除選取的 ${selectedTargetIds.length} 個爬蟲目標站點嗎？\n\n（若含官方預設推薦站點，後續可一鍵補回）`)) {
      return;
    }
    triggerHaptic('warning');
    setIsBatchDeleting(true);
    const res = await batchDeleteCrawlerTargetsAction(selectedTargetIds);
    setIsBatchDeleting(false);
    if (res.success) {
      setTargets((prev) => prev.filter((t) => !selectedTargetIds.includes(t.id)));
      setSelectedTargetIds([]);
      showFeedback(res.message);
      onRefresh?.();
    } else {
      showFeedback(res.message, 'error');
    }
  };

  // 一鍵恢復官方預設推薦站點
  const handleRestoreDefaults = async () => {
    if (!confirm('確定要補齊官方預設推薦站點嗎？\n\n此操作會自動檢查並補回被刪除的官方通路，不會影響您已建立的自訂站點。')) {
      return;
    }
    triggerHaptic('medium');
    setIsRestoringDefaults(true);
    const res = await restoreDefaultCrawlerTargetsAction();
    setIsRestoringDefaults(false);
    showFeedback(res.message, res.success ? 'success' : 'error');
    onRefresh?.();
  };

  // 全域排程時間儲存
  const handleSaveGlobalSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    triggerHaptic('medium');
    const res = await updateCrawlerScheduleAction(schedule);
    if (res.success) {
      showFeedback('全域排程設定已儲存！');
      onRefresh?.();
    }
  };

  // 觸發即時爬蟲（啟動即時視覺化處理狀況 Modal）
  const handleTriggerCrawl = (targetIds?: string | string[]) => {
    triggerHaptic('warning');
    let scopeLabel = '⚡ 全通路全量站點智慧採集';
    if (Array.isArray(targetIds)) {
      const names = targets.filter((t) => targetIds.includes(t.id)).map((t) => t.name).slice(0, 3).join('、');
      scopeLabel = `批量採集 ${targetIds.length} 個站點：${names}${targetIds.length > 3 ? '...' : ''}`;
    } else if (targetIds && targetIds !== 'all') {
      const found = targets.find((t) => t.id === targetIds);
      scopeLabel = `單站即時採集：${found?.name || targetIds}`;
    }

    setProgressModalScopeLabel(scopeLabel);
    setProgressModalParams({ targetIds });
    setIsProgressModalOpen(true);
  };

  // 單篇食尚玩家 / 部落格文章即時抓取（啟動即時視覺化處理狀況 Modal）
  const handleCrawlSingleArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!singleArticleUrl.trim()) return;
    triggerHaptic('warning');
    setProgressModalScopeLabel(`📰 食尚玩家 / 部落格單篇即時採集：${singleArticleUrl.trim()}`);
    setProgressModalParams({ articleUrl: singleArticleUrl.trim() });
    setIsProgressModalOpen(true);
  };

  const PRESET_BRAND_GROUPS = [
    '7-ELEVEN',
    '全家 FamilyMart',
    '萊爾富 Hi-Life',
    'OK超商 OKmart',
    '全聯福利中心',
    '量販賣場',
    '手搖',
    '速食',
    '餐廳',
    '咖啡甜點',
    '美妝',
    '服飾時尚',
    '3C家電',
    '生活情報',
  ];

  // 取得現有所有品牌群組清單 (結合現有與預設)
  const existingBrandGroups = React.useMemo(() => {
    const set = new Set<string>();
    PRESET_BRAND_GROUPS.forEach((b) => set.add(b));
    targets.forEach((t) => {
      if (t.brandGroup) set.add(t.brandGroup);
    });
    return Array.from(set);
  }, [targets]);

  // 實際存在於站點中的品牌群組列表 (供 Filter 篩選選單使用)
  const activeBrandGroupsInTargets = React.useMemo(() => {
    const set = new Set<string>();
    targets.forEach((t) => {
      if (t.brandGroup?.trim()) {
        set.add(t.brandGroup.trim());
      }
    });
    return Array.from(set);
  }, [targets]);

  // 拖曳排序處理
  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', id);
    setDraggedTargetId(id);
  };

  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverTargetId !== id) {
      setDragOverTargetId(id);
    }
  };

  const handleDragLeave = () => {
    setDragOverTargetId(null);
  };

  const handleDrop = async (e: React.DragEvent, dropUnitId: string) => {
    e.preventDefault();
    setDragOverTargetId(null);
    const draggedId = draggedTargetId || e.dataTransfer.getData('text/plain');
    if (!draggedId || draggedId === dropUnitId) {
      setDraggedTargetId(null);
      return;
    }

    // 1. 若拖曳的是 displayUnits（整個群組或獨立項目間移動）
    const currentUnits = [...displayUnits];
    const oldUnitIndex = currentUnits.findIndex((u) => u.id === draggedId);
    const newUnitIndex = currentUnits.findIndex((u) => u.id === dropUnitId);

    if (oldUnitIndex !== -1 && newUnitIndex !== -1) {
      const [moved] = currentUnits.splice(oldUnitIndex, 1);
      currentUnits.splice(newUnitIndex, 0, moved);

      // 展開所有 target ID
      const orderedTargetIds: string[] = [];
      currentUnits.forEach((unit) => {
        if (unit.type === 'group') {
          orderedTargetIds.push(...unit.items.map((t) => t.id));
        } else {
          orderedTargetIds.push(unit.target.id);
        }
      });

      // 保持未被篩選到的其他站點順序
      const orderedIdSet = new Set(orderedTargetIds);
      const remainingTargets = targets.filter((t) => !orderedIdSet.has(t.id));
      const finalTargets = [
        ...orderedTargetIds.map((id) => targets.find((t) => t.id === id)!),
        ...remainingTargets,
      ].map((t, idx) => ({ ...t, sortOrder: idx }));

      setTargets(finalTargets);
      setSortBy('custom');
      setDraggedTargetId(null);
      triggerHaptic('medium');

      setIsSavingOrder(true);
      const res = await reorderCrawlerTargetsAction(finalTargets.map((t) => t.id));
      setIsSavingOrder(false);

      if (res.success) {
        showFeedback('🎉 站點排序已更新並儲存！');
        onRefresh?.();
      } else {
        showFeedback(res.message || '儲存排序失敗', 'error');
      }
      return;
    }

    // 2. 若是在群組內部單項拖曳或者單項直接拖曳到單項
    const oldTargetIndex = targets.findIndex((t) => t.id === draggedId);
    const newTargetIndex = targets.findIndex((t) => t.id === dropUnitId);

    if (oldTargetIndex !== -1 && newTargetIndex !== -1) {
      const reordered = [...targets];
      const [moved] = reordered.splice(oldTargetIndex, 1);
      reordered.splice(newTargetIndex, 0, moved);

      const updated = reordered.map((t, index) => ({
        ...t,
        sortOrder: index,
      }));

      setTargets(updated);
      setSortBy('custom');
      setDraggedTargetId(null);
      triggerHaptic('medium');

      setIsSavingOrder(true);
      const res = await reorderCrawlerTargetsAction(updated.map((t) => t.id));
      setIsSavingOrder(false);

      if (res.success) {
        showFeedback('🎉 站點排序已更新並儲存！');
        onRefresh?.();
      } else {
        showFeedback(res.message || '儲存排序失敗', 'error');
      }
    }
  };

  const handleDragEnd = () => {
    setDraggedTargetId(null);
    setDragOverTargetId(null);
  };

  // 品牌群組整組切換啟用/停用
  const handleToggleBrandGroup = async (brandGroup: string, enabled: boolean) => {
    triggerHaptic('medium');
    const res = await batchToggleBrandGroupAction(brandGroup, enabled);
    if (res.success) {
      setTargets((prev) =>
        prev.map((t) => (t.brandGroup?.trim() === brandGroup ? { ...t, enabled } : t))
      );
      showFeedback(res.message);
      onRefresh?.();
    } else {
      showFeedback(res.message || '操作失敗', 'error');
    }
  };

  // 品牌群組整組一鍵立即抓取
  const handleTriggerCrawlBrandGroup = (brandGroup: string) => {
    const groupTargets = targets.filter((t) => t.brandGroup?.trim() === brandGroup);
    const targetIds = groupTargets.map((t) => t.id);
    if (targetIds.length === 0) return;
    handleTriggerCrawl(targetIds);
  };

  // 折疊 / 展開特定品牌群組
  const toggleGroupCollapse = (brandGroup: string) => {
    triggerHaptic('light');
    setCollapsedGroups((prev) => ({
      ...prev,
      [brandGroup]: !prev[brandGroup],
    }));
  };

  // 開啟「為指定品牌群組新增來源」Modal
  const handleOpenAddTargetForBrand = (brandGroup?: string) => {
    triggerHaptic('light');
    if (brandGroup) {
      setAddTargetBrandGroup(brandGroup);
      setCustomBrandInput(false);
      setCustomBrandName('');
    } else {
      setAddTargetBrandGroup('');
      setCustomBrandInput(false);
      setCustomBrandName('');
    }
    setIsAddTargetModalOpen(true);
  };

  // 一鍵重設所有篩選
  const handleResetFilters = () => {
    triggerHaptic('light');
    setSearchQuery('');
    setTargetTypeFilter('all');
    setStatusFilter('all');
    setBrandFilter('all');
    setSortBy('custom');
  };

  const hasActiveFilters = Boolean(
    searchQuery.trim() ||
    targetTypeFilter !== 'all' ||
    statusFilter !== 'all' ||
    brandFilter !== 'all' ||
    sortBy !== 'custom'
  );

  // 複合條件篩選與多維度排序
  const filteredTargets = React.useMemo(() => {
    return targets
      .filter((t) => {
        // 關鍵字搜尋
        if (searchQuery.trim()) {
          const q = searchQuery.trim().toLowerCase();
          const matchName = t.name.toLowerCase().includes(q);
          const matchUrl = t.url.toLowerCase().includes(q);
          const matchBrand = (t.brandGroup || '').toLowerCase().includes(q);
          const matchRule = (t.crawlRule || '').toLowerCase().includes(q);
          if (!matchName && !matchUrl && !matchBrand && !matchRule) return false;
        }
        // 來源型態過濾
        if (targetTypeFilter !== 'all') {
          if (targetTypeFilter === 'blog_media') {
            if (t.targetType !== 'blog_media' && !t.url.includes('supertaste')) return false;
          } else if (t.targetType !== targetTypeFilter) {
            return false;
          }
        }
        // 監控狀態過濾
        if (statusFilter === 'enabled' && !t.enabled) return false;
        if (statusFilter === 'disabled' && t.enabled) return false;
        // 品牌群組過濾
        if (brandFilter === '__no_group__') {
          if (t.brandGroup && t.brandGroup.trim()) return false;
        } else if (brandFilter !== 'all') {
          if ((t.brandGroup || '').trim() !== brandFilter) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'name-asc') {
          return a.name.localeCompare(b.name, 'zh-Hant');
        }
        if (sortBy === 'name-desc') {
          return b.name.localeCompare(a.name, 'zh-Hant');
        }
        if (sortBy === 'status') {
          return (b.enabled ? 1 : 0) - (a.enabled ? 1 : 0);
        }
        if (sortBy === 'crawled') {
          return b.crawledCount - a.crawledCount;
        }
        if (sortBy === 'recent') {
          const timeA = a.lastCrawledAt ? new Date(a.lastCrawledAt).getTime() : 0;
          const timeB = b.lastCrawledAt ? new Date(b.lastCrawledAt).getTime() : 0;
          return timeB - timeA;
        }
        if (sortBy === 'brand') {
          const brandA = a.brandGroup || 'zzz';
          const brandB = b.brandGroup || 'zzz';
          return brandA.localeCompare(brandB, 'zh-Hant');
        }
        // custom 排序 (依 sortOrder 遞增)
        return (a.sortOrder ?? 0) - (b.sortOrder ?? 0);
      });
  }, [targets, searchQuery, targetTypeFilter, statusFilter, brandFilter, sortBy]);

  // 自動將同一群組的站點歸類為一個群組單元，未設定群組的作為獨立站點
  const displayUnits = React.useMemo(() => {
    type Unit =
      | {
          type: 'group';
          id: string;
          brandName: string;
          items: CrawlerTargetConfig[];
          sortOrder: number;
        }
      | {
          type: 'single';
          id: string;
          target: CrawlerTargetConfig;
          sortOrder: number;
        };

    const units: Unit[] = [];
    const groupMap = new Map<string, CrawlerTargetConfig[]>();
    const groupOrderMap = new Map<string, number>();

    filteredTargets.forEach((target, index) => {
      const brand = target.brandGroup?.trim();
      if (brand) {
        if (!groupMap.has(brand)) {
          groupMap.set(brand, []);
          groupOrderMap.set(brand, target.sortOrder ?? index);
        }
        groupMap.get(brand)!.push(target);
      } else {
        units.push({
          type: 'single',
          id: target.id,
          target,
          sortOrder: target.sortOrder ?? index,
        });
      }
    });

    groupMap.forEach((items, brandName) => {
      units.push({
        type: 'group',
        id: `group-${brandName}`,
        brandName,
        items,
        sortOrder: groupOrderMap.get(brandName) ?? 0,
      });
    });

    units.sort((a, b) => a.sortOrder - b.sortOrder);
    return units;
  }, [filteredTargets]);

  return (
    <div className="space-y-6">
      {/* 頂部操作看板 (簡約高對比白底 / 經典泡泡風格) */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold">
              <Bot className="w-3.5 h-3.5 text-rose-400" />
              <span>自動化爬蟲 & 排程中控核心</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">
              全站情報即時採集與排程控制中樞
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              支援官方 Facebook 粉專、官網大促與食尚玩家/部落格綜合媒體多品牌情報自動拆解入庫。
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto flex-shrink-0">
            {/* 恢復預設推薦站點按鈕 */}
            <button
              type="button"
              disabled={isRestoringDefaults}
              onClick={handleRestoreDefaults}
              className="px-4 py-3 bg-slate-800/90 hover:bg-slate-800 text-slate-200 hover:text-white text-xs sm:text-sm font-black rounded-2xl border border-slate-700/80 shadow-sm transition-all flex items-center justify-center gap-1.5 active:scale-95 disabled:opacity-50 cursor-pointer"
              title="若刪除了官方推薦站點（如 7-11、全家、食尚玩家等），點擊可一鍵自動補齊"
            >
              <RotateCcw className={`w-4 h-4 text-amber-400 ${isRestoringDefaults ? 'animate-spin' : ''}`} />
              <span>{isRestoringDefaults ? '補齊中...' : '恢復預設推薦'}</span>
            </button>

            {/* 新增爬蟲目標站點按鈕 */}
            <button
              type="button"
              onClick={() => setIsAddTargetModalOpen(true)}
              className="px-4 py-3 bg-white hover:bg-slate-100 text-slate-900 text-xs sm:text-sm font-black rounded-2xl shadow-sm transition-all flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-rose-600" />
              <span>新增爬蟲網站</span>
            </button>

            {/* 一鍵全站抓取 */}
            <button
              type="button"
              disabled={isRunning}
              onClick={() => handleTriggerCrawl()}
              className="px-5 py-3 bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white text-xs sm:text-sm font-black rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-60 cursor-pointer"
            >
              {isRunning && runningTargetId === 'all' ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>全量爬蟲抓取中...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  <span>⚡ 全通路全量抓取</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 🚀 食尚玩家 / 部落格文章即時採集工具箱 */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                <span>食尚玩家 / 綜合部落格文章即時採集工具箱</span>
                <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[10px] font-extrabold">
                  支援 1 文章多品牌自動拆解
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                貼上任一篇食尚玩家或美食部落格網址，Gemini AI 將自動拆解多個品牌/品項並精準分類，若遇粉專情報則自動以粉專優先。
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleCrawlSingleArticle} className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="url"
              required
              value={singleArticleUrl}
              onChange={(e) => setSingleArticleUrl(e.target.value)}
              placeholder="https://supertaste.tvbs.com.tw/food/360820"
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm font-semibold text-slate-900 focus:bg-white focus:border-rose-500 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={isCrawlingSingleArticle}
            className="w-full sm:w-auto px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-black rounded-2xl shadow-sm transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-60 cursor-pointer flex-shrink-0"
          >
            {isCrawlingSingleArticle ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-rose-400" />
                <span>AI 多品牌分析中...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-yellow-400" />
                <span>即時爬取與拆解</span>
              </>
            )}
          </button>
        </form>

        <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 pt-1">
          <span className="font-bold text-slate-600">快捷測試範例：</span>
          <button
            type="button"
            onClick={() => setSingleArticleUrl('https://supertaste.tvbs.com.tw/food/360820')}
            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold cursor-pointer"
          >
            六扇門 24小時小火鍋 (360820)
          </button>
          <button
            type="button"
            onClick={() => setSingleArticleUrl('https://supertaste.tvbs.com.tw/category/food/all/convenience-store')}
            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold cursor-pointer"
          >
            超商最新優惠專題
          </button>
        </div>
      </div>

      {feedback && (
        <div className={`p-4 rounded-2xl text-xs font-bold flex items-center gap-2 border transition-all ${
          feedback.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-rose-50 text-rose-800 border-rose-200'
        }`}>
          {feedback.type === 'success' ? <Check className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-rose-600" />}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* 抓取即時預覽卡片 */}
      {extractedPreviewDeals.length > 0 && (
        <div className="bg-emerald-50/80 border border-emerald-200 p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-600" />
              <h3 className="text-sm font-black text-emerald-950">
                🎉 即時抓取成功預覽（共 {extractedPreviewDeals.length} 筆特惠已即時寫入情報牆）
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setExtractedPreviewDeals([])}
              className="text-xs text-emerald-700 hover:text-emerald-900 font-bold cursor-pointer"
            >
              收起預覽
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {extractedPreviewDeals.map((deal) => (
              <div key={deal.id} className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-1.5">
                    <span>{deal.merchant.name}</span>
                    <span className="text-rose-600">${deal.discountPrice}</span>
                  </div>
                  <h4 className="text-xs font-black text-slate-900 line-clamp-2">{deal.title}</h4>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                  <span>{deal.targetItems[0] || '特惠品項'}</span>
                  <span className="text-emerald-600 font-bold">✓ 已即時上線</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 浮動多選批量操作列 */}
      {selectedTargetIds.length > 0 && (
        <div className="sticky top-20 z-30 bg-slate-900 text-white p-4 rounded-2xl shadow-xl flex flex-wrap items-center justify-between gap-3 border border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-rose-500 text-white text-xs font-black flex items-center justify-center">
              {selectedTargetIds.length}
            </span>
            <span className="text-xs font-bold text-slate-200">
              已勾選 {selectedTargetIds.length} 個站點
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => handleBatchToggleEnabled(true)}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold cursor-pointer transition-all active:scale-95 text-white"
            >
              批量啟用
            </button>
            <button
              type="button"
              onClick={() => handleBatchToggleEnabled(false)}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold cursor-pointer transition-all active:scale-95 text-slate-300"
            >
              批量暫停
            </button>
            <button
              type="button"
              onClick={() => setIsBatchScheduleModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold cursor-pointer transition-all active:scale-95 flex items-center gap-1 text-white"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>批量設定排程</span>
            </button>
            <button
              type="button"
              onClick={() => {
                const selectedList = targets.filter((t) => selectedTargetIds.includes(t.id));
                const firstGroup = selectedList.find((t) => t.brandGroup)?.brandGroup;
                setBatchSelectedGroup(firstGroup || existingBrandGroups[0] || '__custom__');
                setBatchCustomGroupName('');
                setIsBatchGroupModalOpen(true);
              }}
              className="px-3 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-xs font-bold cursor-pointer transition-all active:scale-95 flex items-center gap-1.5 text-white shadow-xs"
              title="批量為選取的站點指派或變更品牌群組"
            >
              <FolderKanban className="w-3.5 h-3.5" />
              <span>批量設定群組</span>
            </button>
            <button
              type="button"
              disabled={isRunning}
              onClick={() => handleTriggerCrawl(selectedTargetIds)}
              className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-bold cursor-pointer transition-all active:scale-95 flex items-center gap-1 text-white"
            >
              <Play className="w-3.5 h-3.5" />
              <span>批量立即抓取</span>
            </button>
            <button
              type="button"
              disabled={isBatchDeleting}
              onClick={handleBatchDelete}
              className="px-3 py-1.5 rounded-xl bg-rose-950/80 hover:bg-rose-900 border border-rose-800 text-xs font-bold cursor-pointer transition-all active:scale-95 flex items-center gap-1 text-rose-300 disabled:opacity-50"
              title="批量刪除選取站點"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{isBatchDeleting ? '刪除中...' : '批量刪除'}</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedTargetIds([])}
              className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              title="取消全選"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* 左側：爬蟲目標清單管理 (8 欄) */}
        <div className="lg:col-span-8 space-y-4">
          {/* 頂部標題列 */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleToggleSelectAll}
                className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer select-none"
              >
                {selectedTargetIds.length === targets.length && targets.length > 0 ? (
                  <CheckSquare className="w-4 h-4 text-rose-600" />
                ) : (
                  <Square className="w-4 h-4 text-slate-400" />
                )}
                <span>全選 ({targets.length})</span>
              </button>
              <div className="h-4 w-[1px] bg-slate-200" />
              <h3 className="text-base font-black text-slate-900">爬蟲目標站點管理</h3>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleRestoreDefaults}
                disabled={isRestoringDefaults}
                className="px-2.5 py-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-xl transition-all flex items-center gap-1 cursor-pointer disabled:opacity-50"
                title="自動補齊被刪除的官方種子站點"
              >
                <RotateCcw className={`w-3.5 h-3.5 ${isRestoringDefaults ? 'animate-spin' : ''}`} />
                <span>補齊預設站點</span>
              </button>
              <span className="text-xs font-bold text-slate-500">
                已啟用 {targets.filter((t) => t.enabled).length} / {targets.length} 個站點
              </span>
            </div>
          </div>

          {/* 🔍 進階多維度篩選與排序控制面板 */}
          <div className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-xs space-y-3">
            {/* 上排：關鍵字搜尋 + 排序選單 + 品牌群組下拉 */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
              {/* 關鍵字搜尋 */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="搜尋站點名稱、品牌群組、網址關鍵字..."
                  className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:border-rose-500 focus:outline-none"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-0.5 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* 排序選單 (Sort) */}
              <div className="relative min-w-[150px]">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full pl-8 pr-7 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 cursor-pointer focus:bg-white focus:border-indigo-500 focus:outline-none appearance-none"
                >
                  <option value="custom">🎯 自訂拖曳順序</option>
                  <option value="name-asc">🔤 站點名稱 (A → Z)</option>
                  <option value="name-desc">🔤 站點名稱 (Z → A)</option>
                  <option value="status">🟢 監控中優先</option>
                  <option value="crawled">📊 抓取次數 (多 → 少)</option>
                  <option value="recent">🕒 最近抓取 (最新優先)</option>
                  <option value="brand">🏢 品牌群組 (A → Z)</option>
                </select>
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* 品牌群組快速過濾下拉 */}
              <div className="relative min-w-[150px]">
                <select
                  value={brandFilter}
                  onChange={(e) => setBrandFilter(e.target.value)}
                  className="w-full pl-8 pr-7 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 cursor-pointer focus:bg-white focus:border-indigo-500 focus:outline-none appearance-none"
                >
                  <option value="all">🏢 全部站點 (含群組與獨立)</option>
                  {activeBrandGroupsInTargets.map((brand) => (
                    <option key={brand} value={brand}>📁 {brand}</option>
                  ))}
                  <option value="__no_group__">⚪ 僅看獨立站點 (無群組)</option>
                </select>
                <FolderKanban className="w-3.5 h-3.5 text-indigo-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* 下排：來源類型膠囊 + 狀態篩選膠囊 + 清除篩選 */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-100">
              {/* 來源型態過濾膠囊 */}
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setTargetTypeFilter('all')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    targetTypeFilter === 'all'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  全部來源 ({targets.length})
                </button>
                <button
                  type="button"
                  onClick={() => setTargetTypeFilter('fanpage')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                    targetTypeFilter === 'fanpage'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                  }`}
                >
                  <span>📱 官方粉專</span>
                  <span className="px-1 py-0.1 rounded-full text-[9px] bg-indigo-200/50">
                    {targets.filter((t) => t.targetType === 'fanpage').length}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setTargetTypeFilter('official_web')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                    targetTypeFilter === 'official_web'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                  }`}
                >
                  <span>🌐 品牌官網</span>
                  <span className="px-1 py-0.1 rounded-full text-[9px] bg-emerald-200/50">
                    {targets.filter((t) => t.targetType === 'official_web').length}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setTargetTypeFilter('community')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                    targetTypeFilter === 'community'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
                  }`}
                >
                  <span>💬 社群/社團</span>
                  <span className="px-1 py-0.1 rounded-full text-[9px] bg-amber-200/50">
                    {targets.filter((t) => t.targetType === 'community').length}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setTargetTypeFilter('blog_media')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                    targetTypeFilter === 'blog_media'
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                  }`}
                >
                  <span>📰 食尚玩家/部落格</span>
                  <span className="px-1 py-0.1 rounded-full text-[9px] bg-rose-200/50">
                    {targets.filter((t) => t.targetType === 'blog_media' || t.url.includes('supertaste')).length}
                  </span>
                </button>
              </div>

              {/* 狀態過濾膠囊與清除篩選 */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setStatusFilter('all')}
                    className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                      statusFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    全部狀態
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatusFilter('enabled')}
                    className={`px-2 py-0.5 rounded-md transition-all cursor-pointer flex items-center gap-1 ${
                      statusFilter === 'enabled' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <span>🟢 監控中</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatusFilter('disabled')}
                    className={`px-2 py-0.5 rounded-md transition-all cursor-pointer flex items-center gap-1 ${
                      statusFilter === 'disabled' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <span>⚪ 已暫停</span>
                  </button>
                </div>

                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="px-2.5 py-1 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                    title="清除所有篩選條件與搜尋關鍵字"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>清除篩選</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* 拖曳操作提示列 */}
          <div className="flex items-center justify-between text-[11px] text-slate-500 px-2">
            <span className="flex items-center gap-1.5 font-semibold">
              <GripVertical className="w-3.5 h-3.5 text-slate-400" />
              <span>
                {sortBy === 'custom' 
                  ? '💡 按住左側六點手柄即可隨意拖曳排序站點或整組群組（即時持久化儲存）' 
                  : `📌 目前依照【${sortBy === 'name-asc' ? '名稱 A-Z' : sortBy === 'name-desc' ? '名稱 Z-A' : sortBy === 'status' ? '狀態優先' : sortBy === 'crawled' ? '抓取筆數' : sortBy === 'recent' ? '最新抓取' : '品牌群組'}】排序中，切換回「自訂拖曳順序」即可自由拖曳`}
              </span>
            </span>
            <div className="flex items-center gap-2">
              {isSavingOrder && (
                <span className="text-indigo-600 font-bold flex items-center gap-1 animate-pulse">
                  <RefreshCw className="w-3 h-3 animate-spin" />
                  <span>排序同步中...</span>
                </span>
              )}
              <span className="font-bold text-slate-600">
                顯示 {filteredTargets.length} / {targets.length} 個站點
              </span>
            </div>
          </div>

          {/* 查無結果空狀態 */}
          {filteredTargets.length === 0 && (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-black text-slate-900">查無符合條件的爬蟲目標站點</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                請嘗試變更搜尋關鍵字、切換來源類型或清除篩選條件。
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all cursor-pointer inline-flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>重設所有篩選條件</span>
              </button>
            </div>
          )}

          {/* 單一統一排列清單：有群組的自動歸整為一組，未設定群組的作為獨立站點呈現 */}
          {filteredTargets.length > 0 && (
            <div className="space-y-3">
              {displayUnits.map((unit) => {
                // 狀況 A：獨立站點（無設定群組）
                if (unit.type === 'single') {
                  const target = unit.target;
                  const isSelected = selectedTargetIds.includes(target.id);
                  const isDraggingThis = draggedTargetId === target.id;
                  const isDragOverThis = dragOverTargetId === target.id;

                  return (
                    <div
                      key={target.id}
                      draggable={sortBy === 'custom'}
                      onDragStart={(e) => handleDragStart(e, target.id)}
                      onDragOver={(e) => handleDragOver(e, target.id)}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, target.id)}
                      onDragEnd={handleDragEnd}
                      className={`bg-white rounded-2xl border border-slate-200/80 shadow-xs p-3.5 sm:p-4.5 flex items-center justify-between gap-3 transition-all ${
                        isSelected ? 'bg-rose-50/40' : 'hover:bg-slate-50/70'
                      } ${isDraggingThis ? 'opacity-40 scale-[0.99] border-dashed border-2 border-indigo-400' : ''} ${
                        isDragOverThis ? 'border-t-4 border-t-indigo-600 bg-indigo-50/40' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {/* 六點拖曳把手 */}
                        <div
                          className={`p-1 text-slate-300 hover:text-slate-700 transition-colors flex-shrink-0 ${
                            sortBy === 'custom' ? 'cursor-grab active:cursor-grabbing' : 'cursor-not-allowed opacity-30'
                          }`}
                          title={sortBy === 'custom' ? '按住滑鼠左鍵即可上下拖曳以自訂排序' : '目前正在使用特定排序，請切換至「自訂拖曳順序」以進行拖曳'}
                        >
                          <GripVertical className="w-4 h-4" />
                        </div>

                        {/* 勾選框 */}
                        <button
                          type="button"
                          onClick={() => handleToggleSelectOne(target.id)}
                          className="text-slate-400 hover:text-slate-700 cursor-pointer flex-shrink-0"
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-rose-600" />
                          ) : (
                            <Square className="w-4 h-4 text-slate-300" />
                          )}
                        </button>

                        {/* Logo 圖示 */}
                        {target.logo ? (
                          <div className="w-10 h-10 rounded-2xl overflow-hidden bg-slate-50 border border-slate-200/80 p-1 flex-shrink-0 flex items-center justify-center relative">
                            <Image
                              src={target.logo}
                              alt={target.name}
                              width={32}
                              height={32}
                              unoptimized
                              className="object-contain"
                            />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 flex-shrink-0">
                            <Store className="w-5 h-5" />
                          </div>
                        )}

                        {/* 資訊主體 */}
                        <div className="flex flex-col min-w-0">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="font-black text-slate-900 text-xs sm:text-sm truncate">
                              {target.name}
                            </span>

                            {/* 來源型態標籤 */}
                            {target.targetType === 'fanpage' && (
                              <span className="px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-700 text-[9px] font-bold border border-indigo-200">
                                📱 官方粉專
                              </span>
                            )}
                            {target.targetType === 'official_web' && (
                              <span className="px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 text-[9px] font-bold border border-emerald-200">
                                🌐 官方網站
                              </span>
                            )}
                            {target.targetType === 'community' && (
                              <span className="px-1.5 py-0.2 rounded bg-amber-50 text-amber-800 text-[9px] font-bold border border-amber-200">
                                💬 社群/社團
                              </span>
                            )}
                            {(target.targetType === 'blog_media' || target.url.includes('supertaste')) && (
                              <span className="px-1.5 py-0.2 rounded bg-rose-50 text-rose-700 text-[9px] font-bold border border-rose-200">
                                📰 食尚玩家/部落格
                              </span>
                            )}

                            {/* 啟用狀態 Badge */}
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                              target.enabled ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-500'
                            }`}>
                              {target.enabled ? '🟢 監控中' : '⚪ 已暫停'}
                            </span>

                            {target.isCustom && (
                              <span className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 text-[9px] font-bold border border-slate-200">
                                自訂
                              </span>
                            )}

                            {/* 情報成效指示 Badge */}
                            {target.crawledCount > 0 ? (
                              <span 
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black border border-emerald-200/80 cursor-default"
                                title={`累計成功擷取 ${target.crawledCount} 筆特惠情報`}
                              >
                                <Sparkles className="w-2.5 h-2.5 text-emerald-600" />
                                <span>取得 {target.crawledCount} 筆情報</span>
                                {target.activeDealsCount !== undefined && target.activeDealsCount > 0 && (
                                  <span className="text-emerald-900 font-extrabold bg-emerald-100/90 px-1 rounded-sm">
                                    {target.activeDealsCount} 筆在線
                                  </span>
                                )}
                              </span>
                            ) : (
                              <span 
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold border border-slate-200 cursor-default"
                                title="尚未取得任何特惠情報，可點擊右側「抓取」按鈕進行測試"
                              >
                                <span>⚪ 尚無情報 (0 筆)</span>
                              </span>
                            )}
                          </div>

                          {/* 排程模式與網址 */}
                          <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1">
                            <span className="text-slate-700 font-semibold truncate">
                              {target.scheduleMode === 'inherit' && '🌐 跟隨全域黃金波段'}
                              {target.scheduleMode === 'custom' && `⏱️ 自訂時段: ${(target.customScheduleTimes || []).join(', ') || '尚未設定'}`}
                              {target.scheduleMode === 'interval' && `⏳ 每 ${target.customIntervalMinutes} 分鐘`}
                            </span>
                            <span>·</span>
                            <a 
                              href={target.url} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="truncate max-w-[180px] sm:max-w-[240px] text-slate-400 hover:text-rose-600 flex items-center gap-0.5"
                            >
                              <span>{target.url}</span>
                              <ExternalLink className="w-2.5 h-2.5 flex-shrink-0" />
                            </a>
                          </div>
                        </div>
                      </div>

                      {/* 右側按鈕操作區 */}
                      <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(target)}
                          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                          title="詳細編輯站點基本資料與排程"
                        >
                          <Settings2 className="w-3.5 h-3.5 text-indigo-600" />
                          <span className="hidden sm:inline">編輯</span>
                        </button>

                        <button
                          type="button"
                          disabled={isRunning || !target.enabled}
                          onClick={() => handleTriggerCrawl(target.id)}
                          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all disabled:opacity-40 cursor-pointer flex items-center gap-1"
                          title="立即手動抓取此站點"
                        >
                          {isRunning && runningTargetId === target.id ? (
                            <RefreshCw className="w-3.5 h-3.5 animate-spin text-rose-600" />
                          ) : (
                            <Play className="w-3.5 h-3.5 text-slate-600" />
                          )}
                          <span className="hidden sm:inline">抓取</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleToggleTarget(target.id, target.enabled)}
                          className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-200 ease-in-out cursor-pointer flex items-center ${
                            target.enabled ? 'bg-emerald-500 justify-end' : 'bg-slate-200 justify-start'
                          }`}
                          title={target.enabled ? '點擊暫停監控' : '點擊啟動監控'}
                        >
                          <div className="w-5 h-5 rounded-full bg-white shadow-md" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteTarget(target.id, target.name)}
                          className="p-1.5 rounded-xl hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                          title="刪除此爬蟲站點"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                }

                // 狀況 B：有群組的自動歸整為一組 (Group Cluster)
                const brandName = unit.brandName;
                const brandItems = unit.items;
                const isCollapsed = Boolean(collapsedGroups[brandName]);
                const enabledCount = brandItems.filter((t) => t.enabled).length;
                const allBrandEnabled = enabledCount === brandItems.length;
                const brandCrawledCount = brandItems.reduce((sum, t) => sum + (t.crawledCount || 0), 0);
                const brandActiveCount = brandItems.reduce((sum, t) => sum + (t.activeDealsCount || 0), 0);
                const firstLogo = brandItems.find((t) => t.logo)?.logo;
                const isDraggingGroup = draggedTargetId === unit.id;
                const isDragOverGroup = dragOverTargetId === unit.id;

                return (
                  <div
                    key={unit.id}
                    draggable={sortBy === 'custom'}
                    onDragStart={(e) => handleDragStart(e, unit.id)}
                    onDragOver={(e) => handleDragOver(e, unit.id)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, unit.id)}
                    onDragEnd={handleDragEnd}
                    className={`bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden transition-all ${
                      isDraggingGroup ? 'opacity-40 scale-[0.99] border-dashed border-2 border-indigo-400' : ''
                    } ${isDragOverGroup ? 'border-t-4 border-t-indigo-600 bg-indigo-50/40' : ''}`}
                  >
                    {/* 品牌群組卡片 Header */}
                    <div className="p-3.5 sm:p-4 bg-gradient-to-r from-slate-50/90 via-white to-slate-50/50 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        {/* 拖曳整組把手 */}
                        <div
                          className={`p-1 text-slate-300 hover:text-slate-700 transition-colors flex-shrink-0 ${
                            sortBy === 'custom' ? 'cursor-grab active:cursor-grabbing' : 'cursor-not-allowed opacity-30'
                          }`}
                          title={sortBy === 'custom' ? '按住即可上下拖曳整組品牌順序' : '目前正在使用特定排序'}
                        >
                          <GripVertical className="w-4 h-4" />
                        </div>

                        {/* 折疊 / 展開按鈕 */}
                        <button
                          type="button"
                          onClick={() => toggleGroupCollapse(brandName)}
                          className="p-1 rounded-lg hover:bg-slate-200/70 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                          title={isCollapsed ? '展開本群組' : '折疊本群組'}
                        >
                          {isCollapsed ? (
                            <ChevronRight className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </button>

                        {/* 品牌圖示 (支援點擊自訂或抓取 FB 粉絲團頭像) */}
                        {(() => {
                          const customGroupIcon = brandGroupIcons[brandName];
                          const fbTarget = brandItems.find((t) => t.url.includes('facebook.com'));
                          const displayIcon = customGroupIcon || fbTarget?.logo || firstLogo;

                          return (
                            <div
                              onClick={() => handleOpenGroupIconModal(brandName, displayIcon)}
                              className="relative group cursor-pointer"
                              title="點擊自訂此品牌群組專屬 Icon（可從 FB 粉絲團自動抓取頭像）"
                            >
                              {displayIcon ? (
                                <div className="w-10 h-10 rounded-xl overflow-hidden bg-white border border-slate-200/80 p-0.5 flex-shrink-0 flex items-center justify-center relative shadow-xs group-hover:border-indigo-400 group-hover:shadow-md transition-all">
                                  <Image
                                    src={displayIcon}
                                    alt={brandName}
                                    width={32}
                                    height={32}
                                    unoptimized
                                    className="object-contain"
                                  />
                                </div>
                              ) : (
                                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-100 transition-colors">
                                  <Store className="w-5 h-5" />
                                </div>
                              )}
                              <span className="absolute -bottom-1 -right-1 bg-slate-900 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-xs">
                                <Sparkles className="w-2.5 h-2.5 text-amber-300" />
                              </span>
                            </div>
                          );
                        })()}

                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className="text-xs sm:text-sm font-black text-slate-900">
                              {brandName}
                            </h4>
                            <span className="px-2 py-0.2 rounded-full bg-indigo-100 text-indigo-800 text-[10px] font-extrabold">
                              {brandItems.length} 個來源管道
                            </span>
                            {/* 全品牌累計情報成效 */}
                            {brandCrawledCount > 0 ? (
                              <span 
                                className="inline-flex items-center gap-1 px-2 py-0.2 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black border border-emerald-200"
                                title={`全品牌 ${brandItems.length} 個來源管道累計取得 ${brandCrawledCount} 筆特惠情報`}
                              >
                                <Sparkles className="w-2.5 h-2.5 text-emerald-600" />
                                <span>累計取得 {brandCrawledCount} 筆情報</span>
                                {brandActiveCount > 0 && (
                                  <span className="text-emerald-900 bg-emerald-100/90 px-1 rounded-sm">
                                    {brandActiveCount} 筆在線
                                  </span>
                                )}
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.2 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold border border-slate-200">
                                <span>⚪ 尚無情報 (0 筆)</span>
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                            <span className={enabledCount > 0 ? 'text-emerald-600 font-bold' : 'text-slate-400'}>
                              {enabledCount} / {brandItems.length} 啟用中
                            </span>
                            <span>·</span>
                            <span className="truncate max-w-[180px] sm:max-w-[280px]">
                              包含：{brandItems.map((t) => t.name).join('、')}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* 品牌群組專屬操作按鈕 */}
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {/* 🎨 設定群組 Icon 按鈕 */}
                        <button
                          type="button"
                          onClick={() => {
                            const customGroupIcon = brandGroupIcons[brandName];
                            const fbTarget = brandItems.find((t) => t.url.includes('facebook.com'));
                            handleOpenGroupIconModal(brandName, customGroupIcon || fbTarget?.logo || firstLogo);
                          }}
                          className="px-2 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                          title={`設定【${brandName}】群組專屬 Icon（可從 FB 粉絲團抓取）`}
                        >
                          <Sparkles className="w-3 h-3 text-indigo-600" />
                          <span>群組 Icon</span>
                        </button>

                        {/* ＋為此群組新增來源 */}
                        <button
                          type="button"
                          onClick={() => handleOpenAddTargetForBrand(brandName)}
                          className="px-2 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                          title={`為【${brandName}】新增官網、粉絲團或社群來源`}
                        >
                          <Plus className="w-3 h-3 text-rose-600" />
                          <span>新增來源</span>
                        </button>

                        {/* 一鍵採集全組 */}
                        <button
                          type="button"
                          disabled={isRunning || enabledCount === 0}
                          onClick={() => handleTriggerCrawlBrandGroup(brandName)}
                          className="px-2 py-1 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-black transition-all flex items-center gap-1 cursor-pointer disabled:opacity-40"
                          title={`一鍵同時爬取【${brandName}】旗下所有監控中的管道`}
                        >
                          <Zap className="w-3 h-3 text-rose-600" />
                          <span>一鍵採集全組</span>
                        </button>

                        {/* 整組啟用 / 停用切換 */}
                        <button
                          type="button"
                          onClick={() => handleToggleBrandGroup(brandName, !allBrandEnabled)}
                          className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            allBrandEnabled
                              ? 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                              : 'bg-emerald-600 text-white hover:bg-emerald-500'
                          }`}
                          title={`將【${brandName}】旗下的所有來源一鍵${allBrandEnabled ? '暫停' : '啟用'}`}
                        >
                          {allBrandEnabled ? '整組暫停' : '整組啟用'}
                        </button>
                      </div>
                    </div>

                    {/* 品牌群組內部來源管道清單 */}
                    {!isCollapsed && (
                      <div className="divide-y divide-slate-100 bg-slate-50/20">
                        {brandItems.map((target) => {
                          const isSelected = selectedTargetIds.includes(target.id);
                          const isDraggingThis = draggedTargetId === target.id;
                          const isDragOverThis = dragOverTargetId === target.id;

                          return (
                            <div
                              key={target.id}
                              draggable={sortBy === 'custom'}
                              onDragStart={(e) => handleDragStart(e, target.id)}
                              onDragOver={(e) => handleDragOver(e, target.id)}
                              onDragLeave={handleDragLeave}
                              onDrop={(e) => handleDrop(e, target.id)}
                              onDragEnd={handleDragEnd}
                              className={`p-3 sm:p-3.5 pl-6 sm:pl-8 flex items-center justify-between gap-3 transition-all ${
                                isSelected ? 'bg-rose-50/40' : 'hover:bg-slate-50/60'
                              } ${isDraggingThis ? 'opacity-40 scale-[0.99] border-dashed border-2 border-indigo-400' : ''} ${
                                isDragOverThis ? 'border-t-4 border-t-indigo-600 bg-indigo-50/40' : ''
                              }`}
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                {/* 拖曳把手 */}
                                <div
                                  className={`p-1 text-slate-300 hover:text-slate-700 transition-colors flex-shrink-0 ${
                                    sortBy === 'custom' ? 'cursor-grab active:cursor-grabbing' : 'cursor-not-allowed opacity-30'
                                  }`}
                                  title={sortBy === 'custom' ? '可上下拖曳以微調群組內先後順序' : '目前正在使用特定排序'}
                                >
                                  <GripVertical className="w-3.5 h-3.5" />
                                </div>

                                {/* 勾選框 */}
                                <button
                                  type="button"
                                  onClick={() => handleToggleSelectOne(target.id)}
                                  className="text-slate-400 hover:text-slate-700 cursor-pointer flex-shrink-0"
                                >
                                  {isSelected ? (
                                    <CheckSquare className="w-4 h-4 text-rose-600" />
                                  ) : (
                                    <Square className="w-4 h-4 text-slate-300" />
                                  )}
                                </button>

                                {/* 站點獨立 Logo 圖示 */}
                                {target.logo ? (
                                  <div className="w-8 h-8 rounded-xl overflow-hidden bg-white border border-slate-200/80 p-0.5 flex-shrink-0 flex items-center justify-center relative shadow-xs">
                                    <Image
                                      src={target.logo}
                                      alt={target.name}
                                      width={24}
                                      height={24}
                                      unoptimized
                                      className="object-contain"
                                    />
                                  </div>
                                ) : (
                                  <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center flex-shrink-0">
                                    <Store className="w-4 h-4" />
                                  </div>
                                )}

                                {/* 來源型態標籤 */}
                                {target.targetType === 'fanpage' && (
                                  <span className="px-2 py-0.8 rounded-lg bg-indigo-50 text-indigo-700 text-[10px] font-black border border-indigo-200/80 flex items-center gap-1 flex-shrink-0">
                                    <span>📱 官方粉專</span>
                                  </span>
                                )}
                                {target.targetType === 'official_web' && (
                                  <span className="px-2 py-0.8 rounded-lg bg-emerald-50 text-emerald-700 text-[10px] font-black border border-emerald-200/80 flex items-center gap-1 flex-shrink-0">
                                    <span>🌐 品牌官網</span>
                                  </span>
                                )}
                                {target.targetType === 'community' && (
                                  <span className="px-2 py-0.8 rounded-lg bg-amber-50 text-amber-800 text-[10px] font-black border border-amber-200/80 flex items-center gap-1 flex-shrink-0">
                                    <span>💬 社群/社團</span>
                                  </span>
                                )}
                                {(target.targetType === 'blog_media' || target.url.includes('supertaste')) && (
                                  <span className="px-2 py-0.8 rounded-lg bg-rose-50 text-rose-700 text-[10px] font-black border border-rose-200/80 flex items-center gap-1 flex-shrink-0">
                                    <span>📰 部落格媒體</span>
                                  </span>
                                )}

                                <div className="flex flex-col min-w-0">
                                  <div className="flex items-center gap-2">
                                    <span className="font-bold text-slate-900 text-xs sm:text-sm truncate">
                                      {target.name}
                                    </span>
                                    <span className={`px-2 py-0.2 rounded-full text-[9px] font-extrabold ${
                                      target.enabled ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-500'
                                    }`}>
                                      {target.enabled ? '🟢 監控中' : '⚪ 已暫停'}
                                    </span>
                                    {/* 情報成效指示 Badge */}
                                    {target.crawledCount > 0 ? (
                                      <span 
                                        className="inline-flex items-center gap-1 px-2 py-0.2 rounded-full bg-emerald-50 text-emerald-700 text-[9px] font-black border border-emerald-200/80 cursor-default flex-shrink-0"
                                        title={`此管道累計成功擷取 ${target.crawledCount} 筆特惠情報`}
                                      >
                                        <Sparkles className="w-2.5 h-2.5 text-emerald-600" />
                                        <span>取得 {target.crawledCount} 筆</span>
                                        {target.activeDealsCount !== undefined && target.activeDealsCount > 0 && (
                                          <span className="text-emerald-900 font-extrabold bg-emerald-100/90 px-1 rounded-xs">
                                            {target.activeDealsCount} 筆在線
                                          </span>
                                        )}
                                      </span>
                                    ) : (
                                      <span 
                                        className="inline-flex items-center gap-1 px-2 py-0.2 rounded-full bg-slate-100 text-slate-500 text-[9px] font-bold border border-slate-200 cursor-default flex-shrink-0"
                                        title="此管道尚未取得情報"
                                      >
                                        <span>⚪ 0 筆</span>
                                      </span>
                                    )}
                                  </div>

                                  <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                                    <span className="text-slate-700 font-semibold truncate">
                                      {target.scheduleMode === 'inherit' && '🌐 全域波段'}
                                      {target.scheduleMode === 'custom' && `⏱️ 自訂: ${(target.customScheduleTimes || []).join(', ') || '未設'}`}
                                      {target.scheduleMode === 'interval' && `⏳ 每 ${target.customIntervalMinutes}m`}
                                    </span>
                                    <span>·</span>
                                    <a 
                                      href={target.url} 
                                      target="_blank" 
                                      rel="noopener noreferrer" 
                                      className="truncate max-w-[200px] sm:max-w-[280px] text-slate-400 hover:text-rose-600 flex items-center gap-0.5"
                                    >
                                      <span>{target.url}</span>
                                      <ExternalLink className="w-2.5 h-2.5 flex-shrink-0" />
                                    </a>
                                  </div>
                                </div>
                              </div>

                              {/* 操作按鈕 */}
                              <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                                <button
                                  type="button"
                                  onClick={() => handleOpenEditModal(target)}
                                  className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                                  title="詳細編輯"
                                >
                                  <Settings2 className="w-3.5 h-3.5 text-indigo-600" />
                                  <span className="hidden sm:inline">編輯</span>
                                </button>

                                <button
                                  type="button"
                                  disabled={isRunning || !target.enabled}
                                  onClick={() => handleTriggerCrawl(target.id)}
                                  className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all disabled:opacity-40 cursor-pointer flex items-center gap-1"
                                  title="立即抓取此來源"
                                >
                                  {isRunning && runningTargetId === target.id ? (
                                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-rose-600" />
                                  ) : (
                                    <Play className="w-3.5 h-3.5 text-slate-600" />
                                  )}
                                  <span className="hidden sm:inline">抓取</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleToggleTarget(target.id, target.enabled)}
                                  className={`w-10 h-5.5 rounded-full p-0.5 transition-colors duration-200 ease-in-out cursor-pointer flex items-center ${
                                    target.enabled ? 'bg-emerald-500 justify-end' : 'bg-slate-200 justify-start'
                                  }`}
                                  title={target.enabled ? '點擊暫停' : '點擊啟用'}
                                >
                                  <div className="w-4.5 h-4.5 rounded-full bg-white shadow-md" />
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleDeleteTarget(target.id, target.name)}
                                  className="p-1 rounded-xl hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                                  title="刪除此站點"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 右側：全域排程設定與即時日誌 (4 欄) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-slate-700" />
            <h3 className="text-base font-black text-slate-900">全域排程時段設定</h3>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-5">
            <form onSubmit={handleSaveGlobalSchedule} className="space-y-4 text-xs font-semibold">
              <div>
                <label className="block text-slate-700 font-bold mb-1">4 大黃金波段 (逗號分隔)</label>
                <input
                  type="text"
                  value={schedule.goldenWindows.join(', ')}
                  onChange={(e) => setSchedule({
                    ...schedule,
                    goldenWindows: e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
                  })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:bg-white focus:border-rose-500 focus:outline-none"
                  placeholder="08:30, 12:00, 18:00, 21:30"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">週四超商週末大促衝刺時段</label>
                <input
                  type="text"
                  value={schedule.thursdayRushHours.join(', ')}
                  onChange={(e) => setSchedule({
                    ...schedule,
                    thursdayRushHours: e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
                  })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:bg-white focus:border-rose-500 focus:outline-none"
                  placeholder="17:00, 18:00, 19:00"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">深夜靜默開始</label>
                  <input
                    type="text"
                    value={schedule.nightQuietStart}
                    onChange={(e) => setSchedule({ ...schedule, nightQuietStart: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">深夜靜默結束</label>
                  <input
                    type="text"
                    value={schedule.nightQuietEnd}
                    onChange={(e) => setSchedule({ ...schedule, nightQuietEnd: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl shadow-md transition-all active:scale-95 cursor-pointer mt-2"
              >
                儲存全域排程設定
              </button>
            </form>
          </div>

          {/* 即時日誌 */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-slate-600" />
              <h4 className="text-xs font-black text-slate-900">爬蟲執行即時日誌</h4>
            </div>

            <div className="bg-slate-950 rounded-2xl p-4 text-[11px] font-mono text-emerald-400 max-h-56 overflow-y-auto space-y-2 border border-slate-800 shadow-inner">
              {logs.map((log) => (
                <div key={log.id} className="leading-tight border-b border-slate-900 pb-1.5">
                  <span className="text-slate-500">[{log.timestamp}] </span>
                  <span className="text-cyan-300 font-bold">[{log.type.toUpperCase()}] </span>
                  <span className={log.status === 'success' ? 'text-emerald-300' : 'text-rose-400'}>
                    {log.message}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 彈窗 1：新增爬蟲目標網站 Modal */}
      {isAddTargetModalOpen && (
        <div className="fixed inset-0 !m-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 text-slate-900 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <h3 className="text-base font-black flex items-center gap-2 text-slate-900">
                <Plus className="w-5 h-5 text-rose-600" />
                <span>新增爬蟲目標網站</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsAddTargetModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTargetSubmit} className="space-y-4 text-xs font-semibold">
              <div>
                <label className="block text-slate-700 mb-1">通路 / 品牌網站名稱</label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="例如：壽司郎 Sushiro 官方優惠"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-rose-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1">網站 / 粉絲專頁 URL</label>
                <input
                  type="url"
                  name="url"
                  required
                  placeholder="https://www.facebook.com/... 或 https://..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-rose-500 focus:outline-none"
                />
              </div>

              {/* 所屬品牌群組 */}
              <div>
                <label className="block text-slate-700 mb-1">所屬品牌 / 主群組 (Brand Group)</label>
                <div className="space-y-2">
                  <select
                    value={customBrandInput ? '__custom__' : addTargetBrandGroup}
                    onChange={(e) => {
                      if (e.target.value === '__custom__') {
                        setCustomBrandInput(true);
                      } else {
                        setCustomBrandInput(false);
                        setAddTargetBrandGroup(e.target.value);
                      }
                    }}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-bold"
                  >
                    <option value="">⚪ 無群組（作為獨立站點，不歸入任何群組）</option>
                    {existingBrandGroups.map((brand) => (
                      <option key={brand} value={brand}>📁 {brand}</option>
                    ))}
                    <option value="__custom__">＋ 自訂全新品牌群組...</option>
                  </select>

                  {customBrandInput && (
                    <input
                      type="text"
                      name="brandGroup"
                      value={customBrandName}
                      onChange={(e) => setCustomBrandName(e.target.value)}
                      placeholder="請輸入品牌群組名稱，例如：全家 FamilyMart"
                      className="w-full px-3.5 py-2.5 bg-white border border-indigo-300 rounded-xl text-slate-900 font-bold focus:border-indigo-600 focus:outline-none"
                      autoFocus
                    />
                  )}
                  {!customBrandInput && (
                    <input type="hidden" name="brandGroup" value={addTargetBrandGroup} />
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1">目標來源類型</label>
                  <select
                    name="targetType"
                    defaultValue="fanpage"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-bold"
                  >
                    <option value="fanpage">📱 官方 Facebook 粉絲團</option>
                    <option value="official_web">🌐 官方品牌網站活動頁</option>
                    <option value="community">💬 社群 / 討論區 (LINE、社團)</option>
                    <option value="blog_media">📰 食尚玩家 / 部落格媒體</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 mb-1">預設商品分類</label>
                  <select
                    name="defaultCategory"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                  >
                    <option value="food">美食餐飲 (food)</option>
                    <option value="grocery">超商生活 (grocery)</option>
                    <option value="tech">3C 科技 (tech)</option>
                    <option value="fashion">服飾穿搭 (fashion)</option>
                    <option value="entertainment">休閒娛樂</option>
                    <option value="travel">旅遊住宿</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 mb-1">排程模式</label>
                <select
                  name="scheduleMode"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                >
                  <option value="inherit">跟隨全域黃金波段</option>
                  <option value="custom">自訂特定執行時段</option>
                  <option value="interval">固定間隔時間</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 mb-1">自訂執行時段 (選用，逗號分隔)</label>
                <input
                  type="text"
                  name="customScheduleTimes"
                  placeholder="例如: 09:00, 14:00, 20:00"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1">Logo 圖檔網址 (選用)</label>
                <input
                  type="url"
                  name="logo"
                  placeholder="https://... logo.png"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddTargetModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold shadow-sm"
                >
                  確認新增站點
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 彈窗 2：單站詳細編輯與爬蟲邏輯中樞 Modal */}
      {editingTarget && (
        <div className="fixed inset-0 !m-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-200 text-slate-900 max-h-[90vh] flex flex-col">
            {/* 標題欄 */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-100 mb-4 flex-shrink-0">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                    <Settings2 className="w-5 h-5" />
                  </span>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-slate-900">
                      編輯【{editingTarget.name}】站點設定與爬蟲邏輯
                    </h3>
                    <p className="text-xs text-slate-500">
                      自訂來源屬性、自動排程巡檢時段與 Gemini AI 萃取引導規則
                    </p>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingTarget(null)}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 三頁籤導覽列 (Tabs Header) */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl mb-5 flex-shrink-0">
              <button
                type="button"
                onClick={() => setEditTab('basic')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  editTab === 'basic'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Store className="w-3.5 h-3.5 text-rose-600" />
                <span>📌 基本與來源</span>
              </button>

              <button
                type="button"
                onClick={() => setEditTab('schedule')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  editTab === 'schedule'
                    ? 'bg-white text-indigo-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Clock className="w-3.5 h-3.5 text-indigo-600" />
                <span>⏱️ 排程與頻率</span>
              </button>

              <button
                type="button"
                onClick={() => setEditTab('logic')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  editTab === 'logic'
                    ? 'bg-white text-emerald-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Cpu className="w-3.5 h-3.5 text-emerald-600" />
                <span>🧠 爬蟲邏輯與 AI</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setEditTab('deals');
                  if (!targetDealsData && editingTarget) {
                    fetchTargetDeals(editingTarget.id);
                  }
                }}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  editTab === 'deals'
                    ? 'bg-white text-rose-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-rose-600" />
                <span>📊 優惠情報與線上紀錄</span>
                {targetDealsData && targetDealsData.activeCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-rose-100 text-rose-700 text-[9px] font-black">
                    {targetDealsData.activeCount}
                  </span>
                )}
              </button>
            </div>

            {/* 表單內容 (Form Body) */}
            <form onSubmit={handleSaveEditingTarget} className="flex-1 flex flex-col min-h-0">
              <div className="overflow-y-auto pr-1 space-y-4 flex-1 text-xs font-semibold">
                {/* 頁籤 1：基本與來源資訊 */}
                {editTab === 'basic' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-slate-700 mb-1">通路 / 品牌網站名稱</label>
                      <input
                        type="text"
                        value={editingTarget.name}
                        onChange={(e) => setEditingTarget({ ...editingTarget, name: e.target.value })}
                        required
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-rose-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 mb-1">目標網站 / 粉絲專頁 URL</label>
                      <input
                        type="url"
                        value={editingTarget.url}
                        onChange={(e) => setEditingTarget({ ...editingTarget, url: e.target.value })}
                        required
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-rose-500 focus:outline-none"
                      />
                    </div>

                    {/* 品牌群組設定 */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-slate-700">所屬品牌 / 主群組 (Brand Group，選填)</label>
                        {editingTarget.brandGroup && (
                          <button
                            type="button"
                            onClick={() => setEditingTarget({ ...editingTarget, brandGroup: undefined })}
                            className="text-[10px] text-rose-500 hover:text-rose-700 font-bold cursor-pointer"
                          >
                            ✕ 清除群組 (設為獨立站點)
                          </button>
                        )}
                      </div>
                      <input
                        type="text"
                        value={editingTarget.brandGroup || ''}
                        onChange={(e) => setEditingTarget({ ...editingTarget, brandGroup: e.target.value })}
                        placeholder="留空即為獨立站點（無群組），或輸入群組名稱如：全家 FamilyMart"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold focus:bg-white focus:border-rose-500 focus:outline-none"
                      />
                      <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                        <span className="text-[10px] text-slate-400 font-bold">快速指定：</span>
                        {PRESET_BRAND_GROUPS.slice(0, 6).map((brand) => (
                          <button
                            key={brand}
                            type="button"
                            onClick={() => setEditingTarget({ ...editingTarget, brandGroup: brand })}
                            className="px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold cursor-pointer transition-colors"
                          >
                            {brand}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-700 mb-1">目標來源類型</label>
                        <select
                          value={editingTarget.targetType}
                          onChange={(e) => setEditingTarget({ ...editingTarget, targetType: e.target.value as any })}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-bold"
                        >
                          <option value="fanpage">📱 官方 Facebook 粉絲團</option>
                          <option value="official_web">🌐 官方品牌網站促銷專區</option>
                          <option value="community">💬 社群 / 討論區 (LINE、社團)</option>
                          <option value="blog_media">📰 食尚玩家 / 部落格媒體</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-slate-700 mb-1">預設商品分類</label>
                        <select
                          value={editingTarget.defaultCategory}
                          onChange={(e) => setEditingTarget({ ...editingTarget, defaultCategory: e.target.value as any })}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                        >
                          <option value="food">美食餐飲 (food)</option>
                          <option value="grocery">超商生活 (grocery)</option>
                          <option value="tech">3C 科技 (tech)</option>
                          <option value="fashion">服飾穿搭 (fashion)</option>
                          <option value="entertainment">休閒娛樂 (entertainment)</option>
                          <option value="travel">旅遊住宿 (travel)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-slate-700">獨立站點 Logo 圖檔網址 (保留各自獨立 Icon)</label>
                        {editingTarget.url?.includes('facebook.com') && (
                          <button
                            type="button"
                            disabled={isFetchingSingleTargetFbAvatar}
                            onClick={async () => {
                              setIsFetchingSingleTargetFbAvatar(true);
                              const res = await fetchFacebookAvatarAction(editingTarget.url);
                              setIsFetchingSingleTargetFbAvatar(false);
                              if (res.success && res.avatarUrl) {
                                setEditingTarget({ ...editingTarget, logo: res.avatarUrl });
                                showFeedback('🎉 成功從 FB 粉絲團抓取官方最新頭像！');
                              } else {
                                showFeedback(res.message || '抓取 FB 頭像失敗', 'error');
                              }
                            }}
                            className="text-[11px] text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1 cursor-pointer"
                          >
                            <Sparkles className="w-3 h-3 text-indigo-600" />
                            <span>{isFetchingSingleTargetFbAvatar ? '抓取中...' : '⚡ 從 FB 粉絲團抓取頭像'}</span>
                          </button>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {editingTarget.logo ? (
                          <div className="w-10 h-10 rounded-xl overflow-hidden bg-white border border-slate-200 p-0.5 flex-shrink-0 flex items-center justify-center relative shadow-xs">
                            <Image
                              src={editingTarget.logo}
                              alt="Logo 預覽"
                              width={32}
                              height={32}
                              className="object-contain"
                            />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-xl bg-slate-100 flex-shrink-0 flex items-center justify-center text-slate-400">
                            <Store className="w-5 h-5" />
                          </div>
                        )}
                        <input
                          type="url"
                          value={editingTarget.logo || ''}
                          onChange={(e) => setEditingTarget({ ...editingTarget, logo: e.target.value })}
                          placeholder="https://... logo.png"
                          className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-rose-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="block font-black text-slate-800 text-xs sm:text-sm">站點監控狀態</span>
                        <span className="text-[11px] text-slate-500">停用後排程引擎將跳過此站點，不會執行自動爬取</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setEditingTarget({ ...editingTarget, enabled: !editingTarget.enabled })}
                        className={`w-12 h-7 rounded-full p-1 transition-colors duration-200 ease-in-out cursor-pointer flex items-center ${
                          editingTarget.enabled ? 'bg-emerald-500 justify-end' : 'bg-slate-300 justify-start'
                        }`}
                      >
                        <div className="w-5 h-5 rounded-full bg-white shadow-md" />
                      </button>
                    </div>
                  </div>
                )}

                {/* 頁籤 2：排程與頻率設定 */}
                {editTab === 'schedule' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-slate-700 mb-1">排程模式</label>
                      <select
                        value={editingTarget.scheduleMode}
                        onChange={(e) => setEditingTarget({ ...editingTarget, scheduleMode: e.target.value as any })}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                      >
                        <option value="inherit">跟隨全域黃金波段 (08:30, 12:00, 18:00, 21:30)</option>
                        <option value="custom">自訂特定時段 (每日指定時分)</option>
                        <option value="interval">固定間隔分鐘 (週期循環輪詢)</option>
                      </select>
                    </div>

                    {editingTarget.scheduleMode === 'custom' && (
                      <div>
                        <label className="block text-slate-700 mb-1">自訂執行時段 (逗號分隔，24小時制)</label>
                        <input
                          type="text"
                          value={(editingTarget.customScheduleTimes || []).join(', ')}
                          onChange={(e) => setEditingTarget({
                            ...editingTarget,
                            customScheduleTimes: e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
                          })}
                          placeholder="例如：09:00, 15:30, 21:00"
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-indigo-500 focus:outline-none"
                        />
                        <p className="mt-1 text-[11px] text-slate-400">
                          支援輸入多個時間點，例如「08:00, 12:30, 17:00」，排程引擎到達該時間自動執行。
                        </p>
                      </div>
                    )}

                    {editingTarget.scheduleMode === 'interval' && (
                      <div>
                        <label className="block text-slate-700 mb-1">間隔輪詢週期 (分鐘)</label>
                        <input
                          type="number"
                          min={5}
                          max={1440}
                          value={editingTarget.customIntervalMinutes || 60}
                          onChange={(e) => setEditingTarget({
                            ...editingTarget,
                            customIntervalMinutes: Number(e.target.value)
                          })}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-indigo-500 focus:outline-none"
                        />
                        <p className="mt-1 text-[11px] text-slate-400">
                          每隔指定分鐘數自動巡檢該站點最新促銷 (最少 5 分鐘，最多 1440 分鐘/1天)。
                        </p>
                      </div>
                    )}

                    <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex items-start gap-2.5 text-[11px] text-indigo-900 leading-relaxed">
                      <Info className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold">排程運行機制說明：</span>
                        <p className="text-indigo-700">
                          全域排程定時器每分鐘自動比對當前台灣時區時間。深夜靜默時段（01:00 ~ 07:30）預設自動暫停，週四衝刺波（17:00, 18:00, 19:00）加強超商通路巡檢。
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* 頁籤 3：進階爬蟲邏輯與 AI 萃取 */}
                {editTab === 'logic' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-700 mb-1">採集模式 / 擷取引擎</label>
                        <select
                          value={editingRuleConfig.engine || 'gemini_multimodal'}
                          onChange={(e) => setEditingRuleConfig({ ...editingRuleConfig, engine: e.target.value as any })}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                        >
                          <option value="gemini_multimodal">🤖 Gemini AI 視覺與語意雙模態萃取</option>
                          <option value="social_stream">📱 Facebook 動態串流與海報解析</option>
                          <option value="media_deep_crawl">📰 綜合媒體目錄 + 內文遞迴爬取</option>
                          <option value="dom_selector">🌐 規則式 DOM 選擇器結構化萃取</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-slate-700 mb-1">單次爬取篇數 / 文章上限</label>
                        <input
                          type="number"
                          min={1}
                          max={20}
                          value={editingRuleConfig.maxItems || 2}
                          onChange={(e) => setEditingRuleConfig({ ...editingRuleConfig, maxItems: Number(e.target.value) })}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-emerald-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-700 mb-1">
                        關鍵字白名單 (包含關鍵字，逗號分隔)
                      </label>
                      <input
                        type="text"
                        value={(editingRuleConfig.includeKeywords || []).join(', ')}
                        onChange={(e) => setEditingRuleConfig({
                          ...editingRuleConfig,
                          includeKeywords: e.target.value.split(/[,，、]/).map((s) => s.trim()).filter(Boolean)
                        })}
                        placeholder="例如：買一送一, 特價, 優惠, 第二杯半價 (留空則不限制)"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-emerald-500 focus:outline-none"
                      />
                      <p className="mt-1 text-[11px] text-slate-400">
                        僅擷取標題或內容包含上述特價關鍵字的情報，排除非特惠內容。
                      </p>
                    </div>

                    <div>
                      <label className="block text-slate-700 mb-1">
                        關鍵字黑名單 (排除雜訊，逗號分隔)
                      </label>
                      <input
                        type="text"
                        value={(editingRuleConfig.excludeKeywords || []).join(', ')}
                        onChange={(e) => setEditingRuleConfig({
                          ...editingRuleConfig,
                          excludeKeywords: e.target.value.split(/[,，、]/).map((s) => s.trim()).filter(Boolean)
                        })}
                        placeholder="例如：抽獎, 開箱, 心得, 徵才, 探店"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-emerald-500 focus:outline-none"
                      />
                      <p className="mt-1 text-[11px] text-slate-400">
                        若文章或貼文包含上述關鍵字將主動略過，過濾抽獎與開箱雜訊。
                      </p>
                    </div>

                    <div>
                      <label className="block text-slate-700 mb-1">
                        客製 Gemini AI 提示詞引導 (Custom AI Prompt)
                      </label>
                      <textarea
                        rows={3}
                        value={editingRuleConfig.customPrompt || ''}
                        onChange={(e) => setEditingRuleConfig({ ...editingRuleConfig, customPrompt: e.target.value })}
                        placeholder="例如：請特別將組合價換算為單件平均價格；若有加一元多一件活動，請設定 priceUnit 為平均每件..."
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-emerald-500 focus:outline-none resize-none"
                      />
                      <p className="mt-1 text-[11px] text-slate-400">
                        這段提示詞將直接注入 Gemini AI 拆解指示中，精準解析該通路專屬的促銷術語。
                      </p>
                    </div>

                    {editingRuleConfig.engine === 'dom_selector' && (
                      <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                        <span className="block text-slate-800 font-bold text-xs">DOM CSS 選擇器配置 (選用)</span>
                        <div className="grid grid-cols-2 gap-2 text-[11px]">
                          <div>
                            <span className="text-slate-500">項目容器 (Item)</span>
                            <input
                              type="text"
                              placeholder=".post-card, article"
                              value={editingRuleConfig.domSelectors?.itemSelector || ''}
                              onChange={(e) => setEditingRuleConfig({
                                ...editingRuleConfig,
                                domSelectors: { ...editingRuleConfig.domSelectors, itemSelector: e.target.value }
                              })}
                              className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-900"
                            />
                          </div>
                          <div>
                            <span className="text-slate-500">標題 (Title)</span>
                            <input
                              type="text"
                              placeholder="h2, .title"
                              value={editingRuleConfig.domSelectors?.titleSelector || ''}
                              onChange={(e) => setEditingRuleConfig({
                                ...editingRuleConfig,
                                domSelectors: { ...editingRuleConfig.domSelectors, titleSelector: e.target.value }
                              })}
                              className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-900"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="block text-slate-700 mb-1">爬取規則備註 / 說明</label>
                      <input
                        type="text"
                        value={editingRuleConfig.description || ''}
                        onChange={(e) => setEditingRuleConfig({ ...editingRuleConfig, description: e.target.value })}
                        placeholder="例如：週四定期巡檢大促情報"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                {/* 頁籤 4：優惠情報成效與線上紀錄 */}
                {editTab === 'deals' && (
                  <div className="space-y-4">
                    {/* 指標概覽看板 */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-2xl">
                        <span className="text-[10px] text-slate-500 font-bold block mb-1">累計取得情報</span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-lg font-black text-slate-900">
                            {targetDealsData ? targetDealsData.totalCrawled : (editingTarget.crawledCount || 0)}
                          </span>
                          <span className="text-[10px] text-slate-400 font-semibold">筆</span>
                        </div>
                      </div>

                      <div className="p-3 bg-emerald-50/80 border border-emerald-200/80 rounded-2xl">
                        <span className="text-[10px] text-emerald-700 font-bold block mb-1">目前線上在線</span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-lg font-black text-emerald-700">
                            {targetDealsData ? targetDealsData.activeCount : (editingTarget.activeDealsCount || 0)}
                          </span>
                          <span className="text-[10px] text-emerald-600 font-semibold">筆有效</span>
                        </div>
                      </div>

                      <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-2xl">
                        <span className="text-[10px] text-slate-500 font-bold block mb-1">歷史過期下架</span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-lg font-black text-slate-600">
                            {targetDealsData ? targetDealsData.expiredCount : 0}
                          </span>
                          <span className="text-[10px] text-slate-400 font-semibold">筆</span>
                        </div>
                      </div>

                      <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-2xl">
                        <span className="text-[10px] text-slate-500 font-bold block mb-1">最近執行抓取</span>
                        <span className="text-xs font-black text-slate-800 truncate block">
                          {editingTarget.lastCrawledAt ? editingTarget.lastCrawledAt.split(' ')[0] : '尚未執行'}
                        </span>
                      </div>
                    </div>

                    {/* 操作列：單站即時抓取測試 */}
                    <div className="flex items-center justify-between gap-2 p-3 bg-gradient-to-r from-rose-50/80 via-indigo-50/50 to-white rounded-2xl border border-rose-100">
                      <div>
                        <span className="text-xs font-black text-slate-900 block">即時驗證爬蟲有效性</span>
                        <span className="text-[11px] text-slate-500">
                          點擊立即針對【{editingTarget.name}】發動爬蟲巡檢並更新在線情報
                        </span>
                      </div>

                      <button
                        type="button"
                        disabled={isRunning}
                        onClick={async () => {
                          await handleTriggerCrawl([editingTarget.id]);
                          await fetchTargetDeals(editingTarget.id);
                        }}
                        className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-xs active:scale-95 cursor-pointer flex items-center gap-1.5 flex-shrink-0 disabled:opacity-50"
                      >
                        <Play className="w-3.5 h-3.5" />
                        <span>立即單站抓取測試</span>
                      </button>
                    </div>

                    {/* 目前線上有效情報清單 */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          <h4 className="text-xs font-black text-slate-900">
                            目前在線優惠情報 ({targetDealsData ? targetDealsData.activeCount : (editingTarget.activeDealsCount || 0)} 筆)
                          </h4>
                        </div>
                        <button
                          type="button"
                          onClick={() => fetchTargetDeals(editingTarget.id)}
                          className="text-[11px] text-indigo-600 hover:text-indigo-800 font-bold cursor-pointer flex items-center gap-1"
                        >
                          <RefreshCw className={`w-3 h-3 ${isLoadingTargetDeals ? 'animate-spin' : ''}`} />
                          <span>重新整理</span>
                        </button>
                      </div>

                      {isLoadingTargetDeals && (
                        <div className="py-8 text-center bg-slate-50 rounded-2xl border border-slate-100 text-slate-400 text-xs font-bold flex items-center justify-center gap-2">
                          <RefreshCw className="w-4 h-4 animate-spin text-indigo-600" />
                          <span>正在讀取本站點關聯的在線優惠情報...</span>
                        </div>
                      )}

                      {!isLoadingTargetDeals && targetDealsData && targetDealsData.activeDeals.length > 0 && (
                        <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                          {targetDealsData.activeDeals.map((deal) => (
                            <div
                              key={deal.id}
                              className="p-3 bg-white border border-slate-200/90 rounded-2xl hover:border-indigo-300 transition-all flex items-start gap-3 group"
                            >
                              {/* 圖片預覽 */}
                              {deal.imageUrl || (deal.images && deal.images.length > 0) ? (
                                <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-200/80 relative">
                                  <Image
                                    src={deal.imageUrl || (deal.images ? deal.images[0] : '')}
                                    alt={deal.title}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                              ) : (
                                <div className="w-14 h-14 rounded-xl bg-slate-100 flex-shrink-0 flex items-center justify-center text-slate-400">
                                  <Store className="w-6 h-6" />
                                </div>
                              )}

                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1.5 flex-wrap mb-1">
                                  <span className="px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 text-[9px] font-black border border-emerald-200">
                                    🟢 線上展示中
                                  </span>
                                  {deal.isHot && (
                                    <span className="px-1.5 py-0.2 rounded bg-rose-50 text-rose-700 text-[9px] font-black border border-rose-200">
                                      🔥 熱門
                                    </span>
                                  )}
                                  <span className="text-[10px] text-slate-400 font-semibold truncate">
                                    商家：{deal.merchant?.name}
                                  </span>
                                </div>

                                <h5 className="text-xs font-black text-slate-900 leading-snug line-clamp-2 mb-1">
                                  {deal.title}
                                </h5>

                                <div className="flex items-center gap-2 text-[10px] text-slate-500 flex-wrap">
                                  {deal.discountPrice ? (
                                    <span className="text-rose-600 font-black text-xs">
                                      NT$ {deal.discountPrice}
                                    </span>
                                  ) : null}
                                  {deal.originalPrice ? (
                                    <span className="text-slate-400 line-through">
                                      NT$ {deal.originalPrice}
                                    </span>
                                  ) : null}
                                  <span>📅 有效期：{deal.startDate || '即日'} ~ {deal.endDate || '售完為止'}</span>
                                  {deal.sourceUrl && (
                                    <a
                                      href={deal.sourceUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-0.5 ml-auto"
                                    >
                                      <span>查看來源</span>
                                      <ExternalLink className="w-2.5 h-2.5" />
                                    </a>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {!isLoadingTargetDeals && targetDealsData && targetDealsData.activeDeals.length === 0 && (
                        <div className="py-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-2 p-4">
                          <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
                            <Info className="w-5 h-5" />
                          </div>
                          <h5 className="text-xs font-black text-slate-800">
                            此站點目前尚無在線展示的特惠情報
                          </h5>
                          <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                            可能尚未執行爬取或情報已超過有效截止日。您可以點擊上方的「立即單站抓取測試」進行即時採集。
                          </p>
                        </div>
                      )}

                      {/* 歷史已過期情報摺疊區 */}
                      {!isLoadingTargetDeals && targetDealsData && targetDealsData.expiredDeals.length > 0 && (
                        <div className="pt-2 border-t border-slate-100">
                          <button
                            type="button"
                            onClick={() => setShowExpiredDeals(!showExpiredDeals)}
                            className="text-[11px] text-slate-500 hover:text-slate-800 font-bold flex items-center gap-1 cursor-pointer"
                          >
                            {showExpiredDeals ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                            <span>查看歷史已過期情報 ({targetDealsData.expiredDeals.length} 筆)</span>
                          </button>

                          {showExpiredDeals && (
                            <div className="space-y-1.5 mt-2 max-h-48 overflow-y-auto pr-1">
                              {targetDealsData.expiredDeals.map((deal) => (
                                <div
                                  key={deal.id}
                                  className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/70 flex items-center justify-between text-xs opacity-70"
                                >
                                  <span className="font-bold text-slate-700 truncate max-w-[280px]">
                                    {deal.title}
                                  </span>
                                  <span className="text-[10px] text-slate-400 font-semibold flex-shrink-0">
                                    截止：{deal.endDate}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* 彈窗底座操作區 (Footer) */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-4 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => handleDeleteTarget(editingTarget.id, editingTarget.name)}
                  className="px-3.5 py-2 rounded-xl text-rose-600 hover:bg-rose-50 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                  title="刪除此站點"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>刪除站點</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingTarget(null)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold cursor-pointer transition-colors"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold shadow-md cursor-pointer transition-all active:scale-95"
                  >
                    儲存站點與爬蟲邏輯
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 彈窗 3：多選批量編輯排程 Modal */}
      {isBatchScheduleModalOpen && (
        <div className="fixed inset-0 !m-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 text-slate-900">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <h3 className="text-base font-black flex items-center gap-2 text-slate-900">
                <Clock className="w-5 h-5 text-indigo-600" />
                <span>批量設定 {selectedTargetIds.length} 個站點的排程</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsBatchScheduleModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleBatchScheduleSubmit} className="space-y-4 text-xs font-semibold">
              <div>
                <label className="block text-slate-700 mb-1">排程模式</label>
                <select
                  value={batchScheduleMode}
                  onChange={(e) => setBatchScheduleMode(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                >
                  <option value="inherit">跟隨全域黃金波段 (08:30, 12:00, 18:00, 21:30)</option>
                  <option value="custom">自訂特定時段 (Custom Times)</option>
                  <option value="interval">固定間隔分鐘 (Interval)</option>
                </select>
              </div>

              {batchScheduleMode === 'custom' && (
                <div>
                  <label className="block text-slate-700 mb-1">統一自訂時段 (逗號分隔)</label>
                  <input
                    type="text"
                    value={batchCustomTimes}
                    onChange={(e) => setBatchCustomTimes(e.target.value)}
                    placeholder="09:00, 15:00, 20:00"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                    required
                  />
                </div>
              )}

              {batchScheduleMode === 'interval' && (
                <div>
                  <label className="block text-slate-700 mb-1">統一間隔分鐘數</label>
                  <input
                    type="number"
                    min={5}
                    max={1440}
                    value={batchIntervalMinutes}
                    onChange={(e) => setBatchIntervalMinutes(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                    required
                  />
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsBatchScheduleModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold shadow-sm"
                >
                  套用至所選 {selectedTargetIds.length} 個站點
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 彈窗：多選批量設定品牌群組 Modal */}
      {isBatchGroupModalOpen && (
        <div className="fixed inset-0 !m-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 text-slate-900 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <h3 className="text-base font-black flex items-center gap-2 text-slate-900">
                <FolderKanban className="w-5 h-5 text-violet-600" />
                <span>批量設定 {selectedTargetIds.length} 個站點的品牌群組</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsBatchGroupModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveBatchGroup} className="space-y-4 text-xs font-semibold">
              {/* 所選站點預覽清單 */}
              <div>
                <label className="block text-slate-700 font-bold mb-1.5">已選取的站點：</label>
                <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-2xl max-h-36 overflow-y-auto space-y-1.5">
                  {targets
                    .filter((t) => selectedTargetIds.includes(t.id))
                    .map((t) => (
                      <div key={t.id} className="flex items-center justify-between gap-2 text-xs">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className="w-1.5 h-1.5 rounded-full bg-violet-500 flex-shrink-0" />
                          <span className="font-bold text-slate-800 truncate">{t.name}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-semibold flex-shrink-0">
                          {t.brandGroup ? `目前群組：${t.brandGroup}` : '目前：獨立無群組'}
                        </span>
                      </div>
                    ))}
                </div>
              </div>

              {/* 群組指定設定 */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">指派目標品牌群組</label>
                <select
                  value={batchSelectedGroup}
                  onChange={(e) => setBatchSelectedGroup(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-bold focus:bg-white focus:border-violet-500 focus:outline-none"
                >
                  <optgroup label="現有或常用品牌群組">
                    {existingBrandGroups.map((brand) => (
                      <option key={brand} value={brand}>📁 {brand}</option>
                    ))}
                  </optgroup>
                  <optgroup label="自訂或解除">
                    <option value="__custom__">＋ 新增自訂品牌群組名稱...</option>
                    <option value="__none__">⚪ 解除群組（清除分組，改為獨立站點）</option>
                  </optgroup>
                </select>
              </div>

              {batchSelectedGroup === '__custom__' && (
                <div>
                  <label className="block text-slate-700 font-bold mb-1">請輸入全新品牌群組名稱</label>
                  <input
                    type="text"
                    value={batchCustomGroupName}
                    onChange={(e) => setBatchCustomGroupName(e.target.value)}
                    placeholder="例如：50嵐、八方雲集、星巴克 Starbucks"
                    required
                    autoFocus
                    className="w-full px-3.5 py-2.5 bg-white border border-violet-300 rounded-xl text-slate-900 font-bold focus:border-violet-600 focus:outline-none shadow-xs"
                  />
                </div>
              )}

              {batchSelectedGroup === '__none__' && (
                <div className="p-3 bg-amber-50 border border-amber-200/80 rounded-xl text-amber-900 text-[11px] leading-relaxed">
                  💡 套用後，選取的 {selectedTargetIds.length} 個站點將會解除現有的群組關聯，以單一獨立站點形式平鋪呈現。
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsBatchGroupModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold cursor-pointer transition-colors"
                >
                  取消
                </button>
                <button
                  type="submit"
                  disabled={isSavingBatchGroup}
                  className="px-5 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-bold shadow-sm cursor-pointer transition-all disabled:opacity-50 flex items-center gap-1.5"
                >
                  {isSavingBatchGroup && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>確認套用群組</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 彈窗 6：品牌群組專屬 Icon 與 FB 粉絲團頭像設定 Modal */}
      {editingGroupIconBrand && (
        <div className="fixed inset-0 !m-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 text-slate-900 space-y-4">
            {/* 標題 */}
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                    <Sparkles className="w-5 h-5" />
                  </span>
                  <div>
                    <h3 className="text-base font-black text-slate-900">
                      設定【{editingGroupIconBrand}】群組圖示
                    </h3>
                    <p className="text-xs text-slate-500">
                      自訂品牌主群組 Icon，各站點仍保留獨立 Icon
                    </p>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingGroupIconBrand(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveGroupIcon} className="space-y-4">
              {/* 圖示即時預覽 */}
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="w-14 h-14 rounded-2xl overflow-hidden bg-white border border-slate-200 flex items-center justify-center relative flex-shrink-0 shadow-xs">
                  {groupIconInput.trim() ? (
                    <Image
                      src={groupIconInput.trim()}
                      alt="群組 Icon 預覽"
                      width={44}
                      height={44}
                      className="object-contain"
                    />
                  ) : (
                    <Store className="w-7 h-7 text-slate-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-black text-slate-900 block truncate">
                    {editingGroupIconBrand}
                  </span>
                  <span className="text-[11px] text-slate-500 block">
                    {groupIconInput.trim() ? '已選取圖示預覽中' : '目前尚未設定專屬圖示 (顯示預設)'}
                  </span>
                </div>
              </div>

              {/* 核心功能：從 FB 粉絲團一鍵抓取頭像 */}
              {(() => {
                const brandTargets = targets.filter((t) => t.brandGroup === editingGroupIconBrand);
                const fbTarget = brandTargets.find((t) => t.url.includes('facebook.com')) || brandTargets[0];
                return (
                  <div className="p-3.5 bg-gradient-to-br from-indigo-50/80 via-white to-slate-50 rounded-2xl border border-indigo-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-indigo-950 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                        <span>從 FB 粉絲團自動抓取官方頭像</span>
                      </span>
                      {fbTarget && fbTarget.url.includes('facebook.com') && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700 font-bold">
                          已偵測粉專
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      系統將自動連結【{fbTarget ? fbTarget.name : editingGroupIconBrand}】的 Facebook 粉絲專頁，即時提取官方大頭貼作為品牌群組的主視覺！
                    </p>
                    <button
                      type="button"
                      disabled={isFetchingFbAvatar}
                      onClick={handleFetchFbAvatarForGroup}
                      className="w-full py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white text-xs font-black transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
                    >
                      {isFetchingFbAvatar ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Sparkles className="w-3.5 h-3.5" />
                      )}
                      <span>{isFetchingFbAvatar ? '正在連線 FB 擷取頭像中...' : '⚡ 立即從 FB 粉絲團抓取最新頭像'}</span>
                    </button>
                  </div>
                );
              })()}

              {/* 手動輸入圖檔 URL */}
              <div>
                <label className="block text-slate-700 font-bold text-xs mb-1">
                  或手動輸入 Icon 圖檔網址 (PNG / SVG / JPG)
                </label>
                <input
                  type="url"
                  value={groupIconInput}
                  onChange={(e) => setGroupIconInput(e.target.value)}
                  placeholder="https://... /logo.png"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs font-semibold focus:bg-white focus:border-indigo-500 focus:outline-none"
                />
              </div>

              {/* 快速選用：群組內現有子站點的 Logo */}
              {(() => {
                const brandTargets = targets.filter((t) => t.brandGroup === editingGroupIconBrand && t.logo);
                if (brandTargets.length === 0) return null;
                return (
                  <div>
                    <span className="block text-[11px] text-slate-400 font-bold mb-1.5">
                      快速選用此群組下子站點現有的 Logo：
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {brandTargets.map((t) => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setGroupIconInput(t.logo || '')}
                          className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg text-[10px] font-bold text-slate-700 flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          {t.logo && (
                            <Image src={t.logo} alt={t.name} width={14} height={14} className="object-contain" />
                          )}
                          <span className="truncate max-w-[120px]">{t.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {/* 操作按鈕 */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setGroupIconInput('')}
                  className="text-xs text-rose-500 hover:text-rose-700 font-bold cursor-pointer"
                >
                  ✕ 清除自訂圖示
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingGroupIconBrand(null)}
                    className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs rounded-xl font-bold cursor-pointer transition-colors"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    disabled={isSavingGroupIcon}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs rounded-xl font-bold shadow-xs cursor-pointer transition-all disabled:opacity-50 flex items-center gap-1"
                  >
                    {isSavingGroupIcon && <RefreshCw className="w-3 h-3 animate-spin" />}
                    <span>確認儲存圖示</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 彈窗 4：爬蟲完成成果與新建立卡片報告 Modal */}
      <CrawlerResultModal
        isOpen={isResultModalOpen}
        onClose={() => setIsResultModalOpen(false)}
        result={crawlerExecutionResult}
        onViewDealsTab={onViewDealsTab}
        onDealsChange={onRefresh}
      />

      {/* 彈窗 5：🚀 即時爬蟲視覺化處理狀況監控 Modal */}
      <CrawlerProgressModal
        isOpen={isProgressModalOpen}
        onClose={() => setIsProgressModalOpen(false)}
        targetScopeLabel={progressModalScopeLabel}
        startParams={progressModalParams}
        onFinished={(newDeals) => {
          setExtractedPreviewDeals(newDeals);
          showFeedback(`🎉 爬蟲作業完成！共採集 ${newDeals.length} 筆特惠情報已寫入情報牆`);
          onRefresh?.();
        }}
        onViewDealsTab={onViewDealsTab}
      />
    </div>
  );
};

