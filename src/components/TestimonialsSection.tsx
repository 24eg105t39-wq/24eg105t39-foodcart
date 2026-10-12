import React from 'react';
import { Star, Quote, CheckCircle2 } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  const reviews = [
    {
      id: 1,
      name: 'Tanvi Deshmukh',
      location: 'Indiranagar, Bengaluru',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
      dish: 'Royal Hyderabadi Dum Biryani',
      comment:
        'CraveKart completely changed my weekend food delivery standards. The biryani arrived boiling hot inside an insulated clay handi, perfectly fragrant. Simply unmatched quality.',
    },
    {
      id: 2,
      name: 'Rohan Mehra',
      location: 'Koramangala, Bengaluru',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      dish: 'Crave Double Smash Cheeseburger',
      comment:
        'The smashed beef patty edges had that golden crispy crust, brioche stayed soft and wasn’t soggy at all! Delivery partner was super polite and arrived in 22 minutes.',
    },
    {
      id: 3,
      name: 'Ananya Roy',
      location: 'Whitefield, Bengaluru',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      dish: 'Spicy Pepperoni & Hot Honey Pizza',
      comment:
        'Woodfired sourdough pizza with genuine hot honey drizzle! Finding authentic artisanal pizzas at this price point delivered home is a blessing. 10/10 CraveKart!',
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-brand-red uppercase tracking-wider block mb-1">
            Real Food Enthusiasts
          </span>
          <h2 className="text-3xl font-black text-stone-900 tracking-tight">
            Loved by Over 50,000+ Foodies
          </h2>
          <p className="text-stone-500 text-xs sm:text-sm mt-2">
            Here is what our passionate food lovers across Bengaluru have to say about their CraveKart meals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-cream-50 rounded-3xl p-6 border border-cream-200 shadow-card hover:shadow-hover transition-smooth flex flex-col justify-between"
            >
              <div>
                {/* Stars & Quote */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-amber-500 fill-amber-500" />
                    ))}
                  </div>
                  <Quote className="w-6 h-6 text-cream-300" />
                </div>

                <p className="text-stone-700 text-xs sm:text-sm leading-relaxed mb-4">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-4 border-t border-cream-200 flex items-center gap-3">
                <img
                  src={rev.avatar}
                  alt={rev.name}
                  className="w-10 h-10 rounded-full object-cover border border-cream-300"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs font-black text-stone-900 truncate">{rev.name}</h4>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  </div>
                  <p className="text-[10px] text-stone-400 truncate">{rev.location}</p>
                  <p className="text-[10px] font-bold text-brand-red mt-0.5 truncate">
                    Ordered: {rev.dish}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
