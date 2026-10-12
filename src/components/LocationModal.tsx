import React from 'react';
import { MapPin, Navigation, X, Check, Compass, AlertCircle, Loader2 } from 'lucide-react';
import { useLocation, LOCATION_PRESETS } from '../context/LocationContext';

export const LocationModal: React.FC = () => {
  const {
    location,
    isDetecting,
    locationError,
    requestLiveGpsLocation,
    selectLocationPreset,
    isLocationModalOpen,
    setIsLocationModalOpen,
  } = useLocation();

  if (!isLocationModalOpen) return null;

  const handleLiveGps = async () => {
    const success = await requestLiveGpsLocation();
    if (success) {
      setTimeout(() => {
        setIsLocationModalOpen(false);
      }, 700);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-charcoal/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-cream-300 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 bg-cream-100 border-b border-cream-200">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-brand-red/10 text-brand-red">
              <Compass className="w-6 h-6 animate-spin-slow" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-brand-charcoal">Select Delivery Location</h2>
              <p className="text-xs text-brand-charcoal/60">
                Find restaurants delivering to your exact doorstep
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsLocationModalOpen(false)}
            className="p-2 rounded-full hover:bg-cream-200 text-brand-charcoal/60 hover:text-brand-charcoal transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Live GPS Button */}
          <div className="bg-gradient-to-r from-brand-red/5 via-brand-orange/5 to-cream-200 p-4 rounded-2xl border border-brand-red/20">
            <button
              onClick={handleLiveGps}
              disabled={isDetecting}
              className="w-full flex items-center justify-between p-3.5 bg-brand-red text-white font-medium rounded-xl shadow-md hover:bg-brand-red/95 active:scale-[0.99] transition-all disabled:opacity-60"
            >
              <div className="flex items-center gap-3">
                {isDetecting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Navigation className="w-5 h-5 animate-pulse" />
                )}
                <span className="font-semibold text-sm">
                  {isDetecting ? 'Detecting Live GPS Coordinates...' : 'Use Current Live GPS Location'}
                </span>
              </div>
              <span className="text-xs bg-white/20 px-2.5 py-1 rounded-full font-mono">
                Real-time
              </span>
            </button>

            {locationError && (
              <div className="mt-3 flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{locationError}</span>
              </div>
            )}

            {location.isLiveGps && (
              <div className="mt-3 flex items-center justify-between text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl">
                <div className="flex items-center gap-1.5 font-medium">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>GPS Active: ({location.latitude.toFixed(4)}, {location.longitude.toFixed(4)})</span>
                </div>
                <span className="text-[11px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-md font-semibold">
                  Accurate to ~15m
                </span>
              </div>
            )}
          </div>

          {/* Quick Area Presets */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-charcoal/60">
                Popular Delivery Hubs
              </span>
              <span className="text-xs text-brand-charcoal/40">Bengaluru Metro</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {LOCATION_PRESETS.map((preset) => {
                const isSelected =
                  !location.isLiveGps &&
                  Math.abs(location.latitude - preset.latitude) < 0.001 &&
                  Math.abs(location.longitude - preset.longitude) < 0.001;

                return (
                  <button
                    key={preset.id}
                    onClick={() => selectLocationPreset(preset)}
                    className={`flex items-start gap-3 p-3.5 rounded-2xl text-left border transition-all ${
                      isSelected
                        ? 'border-brand-red bg-brand-red/5 shadow-sm'
                        : 'border-cream-300 hover:border-brand-red/40 hover:bg-cream-100/50'
                    }`}
                  >
                    <div
                      className={`p-2 rounded-xl mt-0.5 ${
                        isSelected
                          ? 'bg-brand-red text-white'
                          : 'bg-cream-200 text-brand-charcoal/60'
                      }`}
                    >
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-sm text-brand-charcoal truncate">
                          {preset.name}
                        </p>
                        {isSelected && <Check className="w-4 h-4 text-brand-red shrink-0" />}
                      </div>
                      <p className="text-xs text-brand-charcoal/50 truncate mt-0.5">
                        {preset.area}
                      </p>
                      <p className="text-[10px] text-brand-charcoal/40 font-mono mt-1">
                        {preset.latitude.toFixed(4)}, {preset.longitude.toFixed(4)}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="p-4 bg-cream-100 border-t border-cream-200 flex items-center justify-between text-xs text-brand-charcoal/60">
          <span>Current: <strong className="text-brand-charcoal">{location.label}</strong></span>
          <button
            onClick={() => setIsLocationModalOpen(false)}
            className="px-4 py-2 bg-cream-300 hover:bg-cream-400 text-brand-charcoal font-semibold rounded-xl text-xs transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
