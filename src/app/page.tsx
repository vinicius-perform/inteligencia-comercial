'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { SettingsModal } from '@/components/layout/SettingsModal';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { StatCards } from '@/components/dashboard/StatCards';
import { MainChart } from '@/components/dashboard/MainChart';
import { BentoCards } from '@/components/dashboard/BentoCards';
import { ClosersTable } from '@/components/dashboard/ClosersTable';
import { CloserComparison } from '@/components/dashboard/CloserComparison';
import { SelfComparison } from '@/components/dashboard/SelfComparison';
import { DevelopmentPlan } from '@/components/dashboard/DevelopmentPlan';
import { ClosersModule } from '@/components/closers/ClosersModule';
import { CallsModule } from '@/components/calls/CallsModule';
import { DataService } from '@/lib/dataService';
import { Closer, SalesCall } from '@/types';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'closers' | 'calls'>('dashboard');
  const [closers, setClosers] = useState<Closer[]>([]);
  const [calls, setCalls] = useState<SalesCall[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<number>(30);
  const [selectedCloserId, setSelectedCloserId] = useState<string>('all');
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [preselectedCloserForCalls, setPreselectedCloserForCalls] = useState<string>('');

  const refreshData = useCallback(() => {
    setClosers(DataService.getClosers());
    setCalls(DataService.getCalls());
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Cálculo das métricas 100% dinâmico e memoizado
  const metrics = useMemo(() => {
    return DataService.getMetrics({
      periodDays: selectedPeriod,
      closerId: selectedCloserId,
      calls,
      closers,
    });
  }, [calls, closers, selectedPeriod, selectedCloserId]);

  const handleAddCloser = (name: string) => {
    DataService.addCloser(name);
    refreshData();
  };

  const handleEditCloser = (id: string, name: string) => {
    DataService.updateCloser(id, { name });
    refreshData();
  };

  const handleToggleCloserStatus = (id: string) => {
    DataService.toggleCloserStatus(id);
    refreshData();
  };

  const handleViewCloserCalls = (closerId: string) => {
    setPreselectedCloserForCalls(closerId);
    setActiveTab('calls');
  };

  const handleAddAndAnalyzeCall = async (callData: {
    closerId: string;
    occurredAt: string;
    transcript: string;
    saleClosed: boolean;
    prospectName?: string;
    dealValue?: number;
    durationMinutes?: number;
  }) => {
    const newCall = await DataService.createAndAnalyzeCall(callData);
    refreshData();
    return newCall;
  };

  const handleReanalyzeCall = async (callId: string) => {
    await DataService.reanalyzeCall(callId);
    refreshData();
  };

  return (
    <main className="min-h-screen bg-[#F3F4F6] text-[#0C0C0D] flex flex-col items-center font-sans">
      {/* Barra de Navegação Superior */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Conteúdo Principal com Transições Suaves e Preservação de Estado */}
      <div className="w-full max-w-[1400px] px-4 sm:px-6 md:px-12 py-6">
        {/* ABA 1: DASHBOARD */}
        <div
          key={activeTab === 'dashboard' ? 'tab-dashboard-active' : 'tab-dashboard-hidden'}
          className={activeTab === 'dashboard' ? 'tab-pane-transition space-y-6' : 'hidden'}
        >
          <DashboardHeader
            selectedPeriod={selectedPeriod}
            setSelectedPeriod={setSelectedPeriod}
            selectedCloserId={selectedCloserId}
            setSelectedCloserId={setSelectedCloserId}
            closers={closers}
          />

          <StatCards
            totalCalls={metrics.totalCalls}
            closedSales={metrics.closedSales}
            conversionRate={metrics.conversionRate}
            avgScore={metrics.avgScore}
            callsEvolution={metrics.callsEvolution}
            salesEvolution={metrics.salesEvolution}
            conversionRateEvolution={metrics.conversionRateEvolution}
          />

          <MainChart
            calls={metrics.filteredCalls}
            periodDays={selectedPeriod}
            callsEvolution={metrics.callsEvolution}
            onGoToCalls={() => setActiveTab('calls')}
          />

          <BentoCards
            conversionRate={metrics.conversionRate}
            closedSales={metrics.closedSales}
            totalCalls={metrics.totalCalls}
            avgScore={metrics.avgScore}
            conversionRateEvolution={metrics.conversionRateEvolution}
            bottlenecks={metrics.bottlenecks}
            onViewDiagnostic={() => {
              const el = document.getElementById('development-plan-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            onFilterBottleneckCalls={() => {
              setActiveTab('calls');
            }}
          />

          <ClosersTable
            metrics={metrics.closerMetrics}
            onSelectCloser={(closerId) => {
              setSelectedCloserId(closerId);
              const el = document.getElementById('self-comparison-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            onViewAllClosers={() => setActiveTab('closers')}
          />

          <div id="closer-comparison-section">
            <CloserComparison closers={closers} metrics={metrics.closerMetrics} />
          </div>

          <div id="self-comparison-section">
            <SelfComparison closers={closers} calls={calls} />
          </div>

          <div id="development-plan-section">
            <DevelopmentPlan calls={metrics.filteredCalls} />
          </div>
        </div>

        {/* ABA 2: CLOSERS */}
        <div
          key={activeTab === 'closers' ? 'tab-closers-active' : 'tab-closers-hidden'}
          className={activeTab === 'closers' ? 'tab-pane-transition' : 'hidden'}
        >
          <ClosersModule
            closers={closers}
            calls={calls}
            metrics={metrics.closerMetrics}
            onAddCloser={handleAddCloser}
            onEditCloser={handleEditCloser}
            onToggleStatus={handleToggleCloserStatus}
            onViewCloserCalls={handleViewCloserCalls}
          />
        </div>

        {/* ABA 3: CALLS DE VENDAS */}
        <div
          key={activeTab === 'calls' ? 'tab-calls-active' : 'tab-calls-hidden'}
          className={activeTab === 'calls' ? 'tab-pane-transition' : 'hidden'}
        >
          <CallsModule
            calls={calls}
            closers={closers}
            onAddAndAnalyzeCall={handleAddAndAnalyzeCall}
            onReanalyzeCall={handleReanalyzeCall}
            preselectedCloserId={preselectedCloserForCalls}
          />
        </div>
      </div>

      {/* Modal de Configurações */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onDataReset={refreshData}
      />
    </main>
  );
}
