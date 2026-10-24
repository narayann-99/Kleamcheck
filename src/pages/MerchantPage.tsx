import React, { useState, useEffect } from 'react';
import { MerchantSidebar } from '../components/dashboard/MerchantSidebar';
import { OverviewView } from '../components/dashboard/OverviewView';
import { OrdersView } from '../components/dashboard/OrdersView';
import { ScansView } from '../components/dashboard/ScansView';
import { SettingsView } from '../components/dashboard/SettingsView';
import { MerchantOrder, ScanReport, MerchantStats, OrderContext } from '../types';
import { getOrders, getScanHistory, getMerchantStats, createOrder } from '../lib/api/client';

interface MerchantPageProps {
  initialTab?: 'overview' | 'orders' | 'scans' | 'settings';
  onNavigateToCheckerWithOrder: (context: OrderContext) => void;
  onGoToChecker: () => void;
  onTabChange?: (tab: 'overview' | 'orders' | 'scans' | 'settings') => void;
}

export const MerchantPage: React.FC<MerchantPageProps> = ({
  initialTab = 'overview',
  onNavigateToCheckerWithOrder,
  onGoToChecker,
  onTabChange,
}) => {
  const [currentTab, setCurrentTab] = useState<'overview' | 'orders' | 'scans' | 'settings'>(initialTab);
  const [orders, setOrders] = useState<MerchantOrder[]>([]);
  const [scans, setScans] = useState<ScanReport[]>([]);
  const [stats, setStats] = useState<MerchantStats>({
    totalScans: 0,
    flaggedReceipts: 0,
    possibleDuplicates: 0,
    ordersAwaitingReview: 0,
  });
  const [selectedScan, setSelectedScan] = useState<ScanReport | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Sync state if initialTab changes
  useEffect(() => {
    if (initialTab) setCurrentTab(initialTab);
  }, [initialTab]);

  const loadData = async () => {
    const [fetchedOrders, fetchedScans, fetchedStats] = await Promise.all([
      getOrders(),
      getScanHistory(),
      getMerchantStats(),
    ]);
    setOrders(fetchedOrders);
    setScans(fetchedScans);
    setStats(fetchedStats);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSelectTab = (tab: 'overview' | 'orders' | 'scans' | 'settings') => {
    setCurrentTab(tab);
    setSelectedScan(null);
    if (onTabChange) onTabChange(tab);
  };

  const handleCreateOrder = async (orderData: {
    orderNumber: string;
    expectedAmount: number;
    expectedRecipient: string;
    customerName?: string;
    notes?: string;
  }) => {
    const created = await createOrder(orderData);
    setOrders((prev) => [created, ...prev]);
    const updatedStats = await getMerchantStats();
    setStats(updatedStats);
  };

  const handleScanForOrder = (order: MerchantOrder) => {
    onNavigateToCheckerWithOrder({
      orderId: order.orderNumber,
      expectedAmount: order.expectedAmount,
      expectedRecipient: order.expectedRecipient,
    });
  };

  const handleSelectScan = (scan: ScanReport) => {
    setSelectedScan(scan);
    setCurrentTab('scans');
    if (onTabChange) onTabChange('scans');
  };

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-4rem)] bg-slate-50">
      {/* Sidebar Navigation */}
      <MerchantSidebar
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
        onGoToChecker={onGoToChecker}
      />

      {/* Main Dashboard Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl overflow-y-auto">
        {currentTab === 'overview' && (
          <OverviewView
            stats={stats}
            scans={scans}
            orders={orders}
            onOpenCreateOrder={() => setCurrentTab('orders')}
            onGoToChecker={onGoToChecker}
            onSelectScan={handleSelectScan}
            onSelectTab={handleSelectTab}
          />
        )}

        {currentTab === 'orders' && (
          <OrdersView
            orders={orders}
            scans={scans}
            onCreateOrder={handleCreateOrder}
            onScanForOrder={handleScanForOrder}
            onViewScan={handleSelectScan}
          />
        )}

        {currentTab === 'scans' && (
          <ScansView
            scans={scans}
            onGoToChecker={onGoToChecker}
            selectedScan={selectedScan}
            onClearSelectedScan={() => setSelectedScan(null)}
            onSelectScan={setSelectedScan}
          />
        )}

        {currentTab === 'settings' && <SettingsView />}
      </main>
    </div>
  );
};
