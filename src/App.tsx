import React, { useState } from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { Header } from './components/Header';
import { NewsTicker } from './components/NewsTicker';
import { AIAdvisorDrawer } from './components/AIAdvisorDrawer';
import { DashboardTab } from './components/tabs/DashboardTab';
import { DossierTab } from './components/tabs/DossierTab';
import { BusinessesTab } from './components/tabs/BusinessesTab';
import { StockMarketTab } from './components/tabs/StockMarketTab';
import { RealEstateTab } from './components/tabs/RealEstateTab';
import { LuxuryTab } from './components/tabs/LuxuryTab';
import { BankTab } from './components/tabs/BankTab';
import { RankingsTab } from './components/tabs/RankingsTab';
import { OfflineModal } from './components/modals/OfflineModal';
import { MilestoneModal } from './components/modals/MilestoneModal';
import { ResetConfirmModal } from './components/modals/ResetConfirmModal';

const GameMainContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isResetOpen, setIsResetOpen] = useState<boolean>(false);

  const {
    offlineModalData,
    closeOfflineModal,
    celebratingMilestone,
    closeCelebrationModal,
    resetGame
  } = useGame();

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Financial News Ticker */}
      <NewsTicker />

      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenReset={() => setIsResetOpen(true)}
      />

      {/* Main Viewport Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {activeTab === 'dashboard' && <DashboardTab setActiveTab={setActiveTab} />}
        {activeTab === 'dossier' && <DossierTab />}
        {activeTab === 'businesses' && <BusinessesTab />}
        {activeTab === 'stocks' && <StockMarketTab />}
        {activeTab === 'realestate' && <RealEstateTab />}
        {activeTab === 'luxury' && <LuxuryTab />}
        {activeTab === 'bank' && <BankTab />}
        {activeTab === 'rankings' && <RankingsTab />}
      </main>

      {/* AI Advisor Sterling Drawer */}
      <AIAdvisorDrawer />

      {/* Subtle Luxury Footer */}
      <footer className="border-t border-neutral-800/60 py-6 text-center text-xs text-neutral-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2026 Business Empire: Richman Tycoon. All financial market movements are simulated.</p>
          <div className="flex items-center gap-4 text-neutral-400">
            <span>Autonomous Offline Accumulation</span>
            <span>·</span>
            <span>High-Frequency Simulation</span>
          </div>
        </div>
      </footer>

      {/* Offline Earnings Modal */}
      {offlineModalData && (
        <OfflineModal
          elapsedSeconds={offlineModalData.elapsedSeconds}
          earnings={offlineModalData.earnings}
          onClaim={closeOfflineModal}
        />
      )}

      {/* Milestone Celebration Modal */}
      {celebratingMilestone && (
        <MilestoneModal
          milestone={celebratingMilestone}
          onClose={closeCelebrationModal}
        />
      )}

      {/* Reset Empire Confirmation Modal */}
      <ResetConfirmModal
        isOpen={isResetOpen}
        onClose={() => setIsResetOpen(false)}
        onConfirm={resetGame}
      />
    </div>
  );
};

export default function App() {
  return (
    <GameProvider>
      <GameMainContent />
    </GameProvider>
  );
}
