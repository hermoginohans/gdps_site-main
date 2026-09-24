import React, { useState, useEffect } from 'react';
import { 
  X, 
  CheckCircle2, 
  QrCode, 
  Clock, 
  ShieldCheck, 
  ArrowRight, 
  Copy, 
  Check, 
  ExternalLink,
  Zap,
  Sparkles
} from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from '../../context/RouterContext';
import { Game, DenominationItem, PaymentMethod } from '../../types';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  game: Game;
  item: DenominationItem;
  paymentMethod: PaymentMethod;
  userId: string;
  serverId?: string;
  email: string;
  phone?: string;
  discountPhp: number;
  promoCode?: string;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  game,
  item,
  paymentMethod,
  userId,
  serverId,
  email,
  phone,
  discountPhp,
  promoCode
}) => {
  const { formatPrice, currency } = useCurrency();
  const { addLoyaltyPoints } = useAuth();
  const { navigate } = useRouter();

  const [step, setStep] = useState<'PAY' | 'SUCCESS'>('PAY');
  const [secondsLeft, setSecondsLeft] = useState(900); // 15 minutes
  const [copied, setCopied] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  const subtotal = item.pricePhp;
  const fee = (subtotal * paymentMethod.feePercent) / 100 + paymentMethod.feeFixedPhp;
  const total = Math.max(0, subtotal - discountPhp + fee);

  useEffect(() => {
    if (isOpen) {
      setStep('PAY');
      setSecondsLeft(900);
      const randomOrder = `GPDS-${Math.floor(100000 + Math.random() * 900000)}`;
      setOrderNumber(randomOrder);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || step === 'SUCCESS') return;
    const interval = setInterval(() => {
      setSecondsLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen, step]);

  if (!isOpen) return null;

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const formattedTime = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

  const handleSimulatePayment = () => {
    setStep('SUCCESS');
    addLoyaltyPoints(Math.round(total / 10)); // 1 point per ₱10 spent
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTrackOrder = () => {
    onClose();
    navigate('/payment');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-[#141026] border border-brand-gold/40 rounded-3xl shadow-2xl overflow-hidden shadow-brand-gold/10"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-brand-cardBorder bg-[#1C1634] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-brand-gold/20 flex items-center justify-center text-brand-gold border border-brand-gold/40">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-bold text-white text-base">
                {step === 'PAY' ? 'Complete Your Payment' : 'Payment Successful!'}
              </h3>
              <p className="text-[11px] text-gray-400">
                Order ID: <span className="font-mono text-brand-gold font-bold">{orderNumber}</span>
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-1.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        {step === 'PAY' ? (
          <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
            {/* Timer countdown */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-brand-gold/10 border border-brand-gold/30">
              <div className="flex items-center gap-2 text-xs text-brand-gold font-semibold">
                <Clock className="w-4 h-4 animate-spin" />
                <span>Awaiting payment completion</span>
              </div>
              <span className="font-mono font-bold text-sm text-brand-gold bg-black/30 px-2 py-0.5 rounded">
                {formattedTime}
              </span>
            </div>

            {/* Target Account Info */}
            <div className="p-4 rounded-2xl bg-brand-card border border-brand-cardBorder space-y-2">
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                Account Target Delivery
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Game:</span>
                <span className="text-white font-semibold flex items-center gap-1.5">
                  <img src={game.image} alt={game.name} className="w-4 h-4 rounded" />
                  {game.name}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">{game.idLabel}:</span>
                <span className="text-white font-mono font-bold">{userId}</span>
              </div>
              {serverId && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">{game.serverIdLabel || 'Server'}:</span>
                  <span className="text-white font-mono font-bold">{serverId}</span>
                </div>
              )}
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Package:</span>
                <span className="text-brand-gold font-bold">{item.name}</span>
              </div>
            </div>

            {/* QR Code / Payment Instructions */}
            <div className="text-center p-6 rounded-2xl bg-[#0E0A1C] border border-brand-cardBorder space-y-4">
              <div className="inline-block p-4 bg-white rounded-2xl shadow-xl">
                {/* SVG mock QR Code */}
                <div className="w-44 h-44 flex flex-col items-center justify-center text-brand-dark">
                  <QrCode className="w-36 h-36" />
                  <span className="text-[10px] font-mono font-bold uppercase mt-1 tracking-wider">
                    {paymentMethod.name} • QRPH
                  </span>
                </div>
              </div>

              <div>
                <h4 className="text-white font-bold text-sm mb-1">
                  Scan QR with {paymentMethod.name} or Banking App
                </h4>
                <p className="text-xs text-gray-400 max-w-xs mx-auto leading-relaxed">
                  Open your {paymentMethod.name} app, tap "Scan QR", and scan the code above. Payment is recognized automatically in real time.
                </p>
              </div>

              {/* Reference Number */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-brand-card border border-brand-cardBorder text-xs">
                <span className="text-gray-400">Reference:</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-white">REF-{orderNumber}</span>
                  <button
                    onClick={() => handleCopy(`REF-${orderNumber}`)}
                    className="text-brand-gold hover:text-brand-goldLight"
                    title="Copy reference"
                  >
                    {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Price breakdown */}
            <div className="space-y-2 text-xs border-t border-brand-cardBorder pt-3">
              <div className="flex justify-between text-gray-400">
                <span>Item Subtotal</span>
                <span className="text-white font-medium">{formatPrice(subtotal)}</span>
              </div>
              {discountPhp > 0 && (
                <div className="flex justify-between text-green-400">
                  <span>Promo Discount ({promoCode})</span>
                  <span>-{formatPrice(discountPhp)}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-400">
                <span>Payment Gateway Fee ({paymentMethod.name})</span>
                <span className="text-white">{formatPrice(fee)}</span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-white pt-2 border-t border-brand-cardBorder">
                <span>Total Amount Payable</span>
                <span className="text-brand-gold text-base">{formatPrice(total)}</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="space-y-2 pt-2">
              <button
                onClick={handleSimulatePayment}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-brand-gold to-brand-goldLight text-brand-dark font-extrabold rounded-xl shadow-gold-glow hover:opacity-95 transition-all text-sm uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" /> Simulate Instant Paid (Test Demo)
              </button>
              <p className="text-[11px] text-center text-gray-500">
                🔒 Guaranteed 256-bit encrypted checkout. No password ever required.
              </p>
            </div>
          </div>
        ) : (
          /* Payment Success View */
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-green-500/20 border-2 border-green-500/50 flex items-center justify-center mx-auto text-green-400 animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <h3 className="text-2xl font-display font-extrabold text-white mb-1">
                Top-Up Dispatched!
              </h3>
              <p className="text-sm text-gray-300">
                Your order is currently being injected into the game server.
              </p>
            </div>

            {/* Receipt Summary Card */}
            <div className="p-5 rounded-2xl bg-brand-card border border-brand-cardBorder text-left space-y-2.5 text-xs">
              <div className="flex justify-between pb-2 border-b border-brand-cardBorder font-semibold">
                <span className="text-gray-400">Order ID</span>
                <span className="font-mono text-brand-gold font-bold">{orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Game & Item</span>
                <span className="text-white font-medium">{game.name} • {item.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Delivered To UID</span>
                <span className="text-white font-mono">{userId} {serverId ? `(${serverId})` : ''}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Payment Gateway</span>
                <span className="text-white font-medium">{paymentMethod.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Total Paid</span>
                <span className="text-brand-gold font-bold text-sm">{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-brand-cardBorder text-brand-green">
                <span>Estimated Arrival</span>
                <span className="font-bold">1 - 3 Minutes</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleTrackOrder}
                className="flex-1 py-3 px-4 bg-brand-card hover:bg-brand-cardLight border border-brand-gold/40 text-white font-bold rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all"
              >
                Track Live Order <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-3 px-4 bg-gradient-to-r from-brand-gold to-brand-goldLight text-brand-dark font-extrabold rounded-xl text-xs uppercase tracking-wider transition-all hover:opacity-95 shadow-gold-glow"
              >
                Top-Up Another Game
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
