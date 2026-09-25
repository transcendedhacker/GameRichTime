import React, { useState } from 'react';
import {
  Landmark,
  ShieldCheck,
  Percent,
  Vault,
  TrendingUp,
  AlertCircle,
  ArrowRight,
  ShieldAlert,
  Coins
} from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { formatCurrency, formatPercent } from '../../utils/formatters';

export const BankTab: React.FC = () => {
  const {
    cash,
    bank,
    unlockBank,
    setDepositRate,
    setLoanRate,
    upgradeBankSecurity,
    injectBankReserve,
    withdrawBankReserve,
    hourlyBankIncome
  } = useGame();

  const [injectAmount, setInjectAmount] = useState<number>(5000000);
  const [withdrawAmount, setWithdrawAmount] = useState<number>(5000000);

  const securityUpgradeCost = 15000000 * bank.securityTier;
  const canUpgradeSecurity = bank.unlocked && bank.securityTier < 5 && cash >= securityUpgradeCost;
  const canUnlockBank = !bank.unlocked && cash >= bank.licenseCost;

  // Annual Net Interest Margin
  const annualLoanRevenue = bank.totalLoansIssued * (bank.loanRatePercent / 100);
  const annualDepositCost = bank.totalCustomerDeposits * (bank.depositRatePercent / 100);
  const netAnnualMargin = annualLoanRevenue - annualDepositCost;
  const spreadPercent = bank.loanRatePercent - bank.depositRatePercent;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-1">
            <Landmark className="w-4 h-4 text-amber-400" />
            <span>Monetary Authority & Private Credit</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-['Cinzel',serif] text-neutral-100">
            Commercial Private Bank
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Accept institutional deposits, issue corporate credit lines, calibrate interest spreads, and manage tier-1 vault reserves.
          </p>
        </div>

        {bank.unlocked ? (
          <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 shrink-0">
            <span className="text-xs text-neutral-400 block mb-0.5">Net Banking Profit</span>
            <span className="text-xl font-bold font-mono text-emerald-400 tabular-nums">
              +{formatCurrency(hourlyBankIncome)}/hr
            </span>
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-neutral-950 border border-amber-500/30 shrink-0">
            <span className="text-xs text-amber-400 block mb-0.5">Banking License Required</span>
            <span className="text-xl font-bold font-mono text-neutral-200 tabular-nums">
              {formatCurrency(bank.licenseCost)}
            </span>
          </div>
        )}
      </div>

      {!bank.unlocked ? (
        /* Locked Bank Hero Card */
        <div className="p-8 sm:p-12 rounded-2xl bg-gradient-to-b from-neutral-900 to-neutral-950 border border-neutral-800 text-center max-w-2xl mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto mb-4">
            <Landmark className="w-8 h-8" />
          </div>

          <h3 className="text-2xl font-bold font-['Cinzel',serif] text-neutral-100 mb-2">
            Establish Commercial Banking Charter
          </h3>

          <p className="text-xs sm:text-sm text-neutral-400 max-w-lg mx-auto leading-relaxed mb-6">
            A Tier-1 Commercial Banking Charter allows you to manage customer deposits, lend syndicate debt to multinational corporations, and earn vast hourly interest spreads.
          </p>

          <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 mb-6 max-w-md mx-auto text-left space-y-2 text-xs">
            <div className="flex items-center gap-2 text-neutral-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Full central bank clearance & SWIFT routing code</span>
            </div>
            <div className="flex items-center gap-2 text-neutral-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Initial $50M deposit pool with automated loan origination</span>
            </div>
            <div className="flex items-center gap-2 text-neutral-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Adjustable benchmark lending & savings yield margins</span>
            </div>
          </div>

          <button
            onClick={unlockBank}
            disabled={!canUnlockBank}
            className={`py-3.5 px-8 rounded-xl font-bold text-sm tracking-wide transition-all shadow-xl ${
              canUnlockBank
                ? 'bg-amber-500 hover:bg-amber-400 text-neutral-950 active:scale-98 cursor-pointer'
                : 'bg-neutral-850 text-neutral-500 cursor-not-allowed border border-neutral-800'
            }`}
          >
            <span>Acquire Banking License ({formatCurrency(bank.licenseCost)})</span>
          </button>
        </div>
      ) : (
        /* Unlocked Bank Management Dashboard */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Interest Rate Controls & Margin Analysis */}
          <div className="lg:col-span-7 space-y-6">
            {/* Interest Rates Adjustment Card */}
            <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-6">
              <h3 className="text-base font-semibold text-neutral-100 flex items-center gap-2">
                <Percent className="w-4 h-4 text-amber-400" />
                Interest Rate Calibration
              </h3>

              {/* Deposit Rate Slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-neutral-300 font-medium">Customer Deposit Yield (Paid to Clients)</span>
                  <span className="font-mono font-bold text-sm text-amber-400">
                    {bank.depositRatePercent.toFixed(1)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="8.0"
                  step="0.1"
                  value={bank.depositRatePercent}
                  onChange={(e) => setDepositRate(parseFloat(e.target.value))}
                  className="w-full h-2 bg-neutral-950 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
                <div className="flex justify-between text-xs text-neutral-500">
                  <span>0.5% (Low Cost)</span>
                  <span>8.0% (High Attraction)</span>
                </div>
              </div>

              {/* Loan Rate Slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-neutral-300 font-medium">Commercial Lending Rate (Charged to Borrowers)</span>
                  <span className="font-mono font-bold text-sm text-emerald-400">
                    {bank.loanRatePercent.toFixed(1)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="3.0"
                  max="22.0"
                  step="0.1"
                  value={bank.loanRatePercent}
                  onChange={(e) => setLoanRate(parseFloat(e.target.value))}
                  className="w-full h-2 bg-neutral-950 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <div className="flex justify-between text-xs text-neutral-500">
                  <span>3.0% (Prime Corporate)</span>
                  <span>22.0% (High Margin / Risk)</span>
                </div>
              </div>

              {/* Net Spread Card */}
              <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-850 grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-neutral-500 block">Net Interest Margin (Spread)</span>
                  <span className="font-mono font-bold text-base text-amber-400 tabular-nums">
                    {spreadPercent.toFixed(2)}%
                  </span>
                </div>
                <div>
                  <span className="text-neutral-500 block">Default Risk Factor</span>
                  <span className="font-mono font-bold text-base text-neutral-300 tabular-nums">
                    {bank.defaultRiskPercent.toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Balance Sheet Breakdown */}
            <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800">
              <h3 className="text-base font-semibold text-neutral-100 mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                Bank Balance Sheet
              </h3>

              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 rounded-xl bg-neutral-950 border border-neutral-850 text-xs">
                  <div>
                    <span className="font-medium text-neutral-200 block">Customer Deposits Pool</span>
                    <span className="text-neutral-500">Capital entrusted to your private vault</span>
                  </div>
                  <span className="font-mono font-bold text-sm text-neutral-200 tabular-nums">
                    {formatCurrency(bank.totalCustomerDeposits)}
                  </span>
                </div>

                <div className="flex justify-between items-center p-3 rounded-xl bg-neutral-950 border border-neutral-850 text-xs">
                  <div>
                    <span className="font-medium text-neutral-200 block">Active Commercial Loans</span>
                    <span className="text-neutral-500">Debt underwritten to industrial firms</span>
                  </div>
                  <span className="font-mono font-bold text-sm text-emerald-400 tabular-nums">
                    {formatCurrency(bank.totalLoansIssued)}
                  </span>
                </div>

                <div className="flex justify-between items-center p-3 rounded-xl bg-neutral-950 border border-neutral-850 text-xs">
                  <div>
                    <span className="font-medium text-neutral-200 block">Private Vault Liquidity</span>
                    <span className="text-neutral-500">Capital reserves held for operations</span>
                  </div>
                  <span className="font-mono font-bold text-sm text-amber-400 tabular-nums">
                    {formatCurrency(bank.vaultCash)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Vault Capital & Security */}
          <div className="lg:col-span-5 space-y-6">
            {/* Vault Capital Injection / Withdrawal */}
            <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
              <div className="flex items-center gap-2">
                <Vault className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-semibold text-neutral-100">Vault Reserve Capital</h3>
              </div>

              <p className="text-xs text-neutral-400">
                Inject personal liquidity into the bank vault to expand your lending book, or withdraw bank earnings to your personal balance.
              </p>

              {/* Inject Cash */}
              <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-850 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-neutral-400">Inject Capital to Vault</span>
                  <span className="font-mono text-neutral-200">{formatCurrency(injectAmount)}</span>
                </div>
                <div className="flex gap-2">
                  {[1000000, 5000000, 25000000].map(amt => (
                    <button
                      key={amt}
                      onClick={() => setInjectAmount(amt)}
                      className={`flex-1 py-1 text-xs font-mono rounded-lg transition-colors ${
                        injectAmount === amt
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-neutral-900 text-neutral-400 border border-neutral-800'
                      }`}
                    >
                      {formatCurrency(amt)}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => injectBankReserve(injectAmount)}
                  disabled={cash < injectAmount}
                  className={`w-full py-2 px-3 rounded-lg text-xs font-semibold transition-colors ${
                    cash >= injectAmount
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                      : 'bg-neutral-850 text-neutral-500 cursor-not-allowed'
                  }`}
                >
                  Deposit to Vault ({formatCurrency(injectAmount)})
                </button>
              </div>

              {/* Withdraw Cash */}
              <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-850 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-neutral-400">Withdraw Personal Dividend</span>
                  <span className="font-mono text-neutral-200">{formatCurrency(withdrawAmount)}</span>
                </div>
                <div className="flex gap-2">
                  {[1000000, 5000000, 25000000].map(amt => (
                    <button
                      key={amt}
                      onClick={() => setWithdrawAmount(amt)}
                      className={`flex-1 py-1 text-xs font-mono rounded-lg transition-colors ${
                        withdrawAmount === amt
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-neutral-900 text-neutral-400 border border-neutral-800'
                      }`}
                    >
                      {formatCurrency(amt)}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => withdrawBankReserve(withdrawAmount)}
                  disabled={bank.vaultCash < withdrawAmount}
                  className={`w-full py-2 px-3 rounded-lg text-xs font-semibold transition-colors ${
                    bank.vaultCash >= withdrawAmount
                      ? 'bg-amber-500 hover:bg-amber-400 text-neutral-950'
                      : 'bg-neutral-850 text-neutral-500 cursor-not-allowed'
                  }`}
                >
                  Withdraw Dividend ({formatCurrency(withdrawAmount)})
                </button>
              </div>
            </div>

            {/* Bank Security Hardening */}
            <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-base font-semibold text-neutral-100">Security Architecture</h3>
                </div>
                <span className="text-xs font-mono text-amber-400">Tier {bank.securityTier}/5</span>
              </div>

              <p className="text-xs text-neutral-400">
                Reinforce subterranean vault titanium doors, cyber anti-intrusion grids, and biometric authorization protocols to compress default risk.
              </p>

              <button
                onClick={upgradeBankSecurity}
                disabled={!canUpgradeSecurity}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors ${
                  canUpgradeSecurity
                    ? 'bg-neutral-800 hover:bg-neutral-700 text-neutral-100 border border-neutral-700'
                    : 'bg-neutral-900 text-neutral-500 cursor-not-allowed border border-neutral-850'
                }`}
              >
                <span>{bank.securityTier >= 5 ? 'Max Security Reached' : `Upgrade Security Tier ${bank.securityTier + 1}`}</span>
                {bank.securityTier < 5 && (
                  <span className="font-mono text-neutral-400">({formatCurrency(securityUpgradeCost)})</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
