import React, { useState } from 'react';
import { Tag, Copy, Check, Sparkles, Percent } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const CouponBanner: React.FC = () => {
  const { applyCoupon } = useCart();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const coupons = [
    {
      code: 'WELCOME50',
      title: '50% OFF First Order',
      description: 'Up to ₹150 on orders above ₹299',
      badge: 'POPULAR',
      gradient: 'from-rose-500 to-brand-red',
    },
    {
      code: 'CRAVE20',
      title: '20% Mega Savings',
      description: 'Up to ₹200 on orders above ₹499',
      badge: 'WEEKEND SPECIAL',
      gradient: 'from-amber-500 to-brand-orange',
    },
    {
      code: 'HUNGRY100',
      title: 'Flat ₹100 OFF',
      description: 'On delicious cravings above ₹399',
      badge: 'PARTY PACK',
      gradient: 'from-emerald-500 to-teal-600',
    },
    {
      code: 'FREESHIP',
      title: 'Zero Delivery Fee',
      description: 'On all orders above ₹199',
      badge: 'FREE DELIVERY',
      gradient: 'from-indigo-500 to-purple-600',
    },
  ];

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    applyCoupon(code);
    setTimeout(() => setCopiedCode(null), 3000);
  };

  return (
    <div className="py-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-xs font-bold text-brand-red uppercase tracking-wider block">
            Exclusive Deals
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-stone-900">
            Special Offers & Vouchers
          </h3>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {coupons.map((c) => (
          <div
            key={c.code}
            className="relative overflow-hidden bg-white rounded-3xl p-5 border border-cream-200 shadow-card hover:shadow-hover transition-smooth flex flex-col justify-between group"
          >
            {/* Top decorative edge */}
            <div className={`h-1.5 w-full bg-gradient-to-r ${c.gradient} absolute top-0 left-0`} />

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black text-brand-red uppercase tracking-wider bg-brand-red-light px-2 py-0.5 rounded-full">
                  {c.badge}
                </span>
                <Percent className="w-4 h-4 text-stone-400" />
              </div>

              <h4 className="font-extrabold text-stone-900 text-sm mb-1">{c.title}</h4>
              <p className="text-stone-500 text-xs mb-4">{c.description}</p>
            </div>

            {/* Code button */}
            <div className="pt-2 border-t border-dashed border-cream-300 flex items-center justify-between">
              <span className="font-mono font-black text-xs sm:text-sm tracking-wider text-stone-900 bg-cream-100 px-2.5 py-1 rounded-lg border border-cream-300">
                {c.code}
              </span>

              <button
                onClick={() => handleCopy(c.code)}
                className="flex items-center gap-1 px-3 py-1.5 bg-brand-charcoal hover:bg-brand-red text-white text-xs font-bold rounded-xl transition-smooth"
              >
                {copiedCode === c.code ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Applied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
