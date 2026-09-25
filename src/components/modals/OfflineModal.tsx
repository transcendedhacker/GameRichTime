import React from 'react';
import { Briefcase, CheckCircle } from 'lucide-react';
import { formatCurrency, formatDuration } from '../../utils/formatters';

interface OfflineModalProps {
  elapsedSeconds: number;
  earnings: number;
  onClaim: () => void;
}

export const OfflineModal: React.FC<OfflineModalProps> = ({
  elapsedSeconds,
  earnings,
  onClaim
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-neutral-900 border border-neutral-700/70 rounded-xl p-6 max-w-md w-full shadow-2xl relative">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-neutral-100">Welcome Back, Chief Executive</h3>
            <p className="text-xs text-neutral-400">Your commercial empire operated autonomously</p>
          </div>
        </div>

        <div className="my-6 p-4 rounded-lg bg-neutral-950/70 border border-neutral-800">
          <div className="flex justify-between items-center text-xs text-neutral-400 mb-2">
            <span>Offline Operations Duration:</span>
            <span className="font-mono text-neutral-200">{formatDuration(elapsedSeconds)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-neutral-300 font-medium">Accumulated Profits:</span>
            <span className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">
              +{formatCurrency(earnings)}
            </span>
          </div>
        </div>

        <button
          onClick={onClaim}
          className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-semibold rounded-lg text-sm flex items-center justify-center gap-2 shadow-lg transition-colors"
        >
          <CheckCircle className="w-4 h-4" />
          Claim Executive Proceeds
        </button>
      </div>
    </div>
  );
};
