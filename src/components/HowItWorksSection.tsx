import React from 'react';
import { Utensils, ChefHat, Bike, ShieldCheck } from 'lucide-react';

export const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'Pick Your Craving',
      description: 'Explore gourmet selections from artisanal pizzas, slow dum biryanis, smash burgers and desserts.',
      icon: '🍕',
      color: 'bg-rose-100 text-rose-600',
    },
    {
      step: '02',
      title: 'Cooked Fresh & Hot',
      description: 'Master chefs craft your meal upon order using premium ingredients in 100% sterile hygienic kitchens.',
      icon: '👨‍🍳',
      color: 'bg-amber-100 text-amber-600',
    },
    {
      step: '03',
      title: 'Superfast Delivery',
      description: 'Special thermal insulation bags keep your food sizzling fresh and hot to your doorstep in 25-30 mins.',
      icon: '🛵',
      color: 'bg-emerald-100 text-emerald-600',
    },
  ];

  return (
    <section className="py-16 bg-cream-100/70 border-y border-cream-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-brand-red uppercase tracking-wider block mb-1">
            Effortless Gourmet Dining
          </span>
          <h2 className="text-3xl font-black text-stone-900 tracking-tight">
            How CraveKart Works
          </h2>
          <p className="text-stone-500 text-xs sm:text-sm mt-2">
            From the fiery kitchen woks and charcoal clay tandoors straight to your dining table in three seamless steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((s, index) => (
            <div
              key={s.step}
              className="bg-white rounded-3xl p-8 border border-cream-200 shadow-card hover:shadow-hover transition-smooth flex flex-col items-center text-center relative group"
            >
              <div className="w-16 h-16 rounded-2xl bg-cream-100 flex items-center justify-center text-3xl mb-5 group-hover:scale-110 transition-smooth shadow-sm">
                {s.icon}
              </div>

              <span className="text-[10px] font-black text-brand-orange-dark uppercase tracking-widest bg-brand-orange-light px-2.5 py-0.5 rounded-full mb-2">
                Step {s.step}
              </span>

              <h3 className="text-lg font-black text-stone-900 mb-2">{s.title}</h3>

              <p className="text-stone-500 text-xs leading-relaxed">{s.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
