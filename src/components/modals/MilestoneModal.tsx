import React from 'react';
import { Award, ArrowRight } from 'lucide-react';
import { Milestone } from '../../types/game';
import { formatCurrency } from '../../utils/formatters';

interface MilestoneModalProps {
  milestone: Milestone;
  onClose: () => void;
}

export const MilestoneModal: React.FC<MilestoneModalProps> = ({ milestone, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-neutral-900 border border-amber-500/40 rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative text-center">
        <div className="mx-auto w-16 h-16 rounded-full bg-amber-500/15 border border-amber-500/40 flex items-center justify-center text-amber-400 mb-5">
          <Award className="w-8 h-8" />
        </div>

        <p className="text-xs font-semibold tracking-wider uppercase text-amber-400 mb-1">
          Historical Achievement Unlocked
        </p>

        <h3 className="text-2xl font-bold font-['Cinzel',serif] text-neutral-100 mb-3">
          {milestone.title}
        </h3>

        <p className="text-sm text-neutral-400 leading-relaxed mb-6">
          {milestone.description}
        </p>

        <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 flex justify-around items-center mb-6">
          <div>
            <span className="block text-xs text-neutral-500">Cash Award</span>
            <span className="text-lg font-bold font-mono text-emerald-400">
              +{formatCurrency(milestone.rewardCash)}
            </span>
          </div>
          <div className="w-px h-8 bg-neutral-800" />
          <div>
            <span className="block text-xs text-neutral-500">Executive Prestige</span>
            <span className="text-lg font-bold font-mono text-amber-400">
              +{milestone.rewardPrestige} pts
            </span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 px-4 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-neutral-950 font-bold rounded-lg text-sm flex items-center justify-center gap-2 shadow-lg transition-colors"
        >
          <span>Continue Empire Growth</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
