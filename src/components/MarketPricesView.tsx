import React, { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  MapPin,
  Calendar,
  AlertCircle,
  HelpCircle,
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Info,
} from 'lucide-react';
import { MarketPrice } from '../types';

interface MarketPricesViewProps {
  marketPrices: MarketPrice[];
}

export const MarketPricesView: React.FC<MarketPricesViewProps> = ({ marketPrices }) => {
  const [selectedCommodity, setSelectedCommodity] = useState<string>(marketPrices[0]?.id || '');
  const [regionFilter, setRegionFilter] = useState<string>('TOUS');
  const [search, setSearch] = useState<string>('');

  const activePrice = marketPrices.find((m) => m.id === selectedCommodity) || marketPrices[0];

  const filteredPrices = marketPrices.filter((m) => {
    return (
      m.commodity.toLowerCase().includes(search.toLowerCase()) ||
      m.category.toLowerCase().includes(search.toLowerCase()) ||
      m.topMarket.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="space-y-5">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 text-white p-4 sm:p-6 rounded-3xl border border-emerald-800 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-800 text-amber-300 text-xs font-bold mb-2 border border-emerald-700">
              <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
              <span>Baromètre Officiel des Prix des Vivres au Cameroun</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight">
              Cours des Marchés Régionaux en Temps Réel
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-emerald-200/90 max-w-2xl leading-relaxed">
              Consultez les prix moyens observés sur les grands marchés de gros (Mfoundi à Yaoundé, Sandaga à Douala, Foumbot à l'Ouest, Maroua au Grand-Nord). Fixez vos prix au plus juste et évitez les pertes.
            </p>
          </div>

          <div className="bg-emerald-900/80 p-3.5 rounded-2xl border border-emerald-700/60 shrink-0 text-xs text-emerald-100 space-y-1">
            <div className="text-[11px] text-amber-300 font-bold uppercase tracking-wider">
              Dernière mise à jour
            </div>
            <div className="font-bold text-white text-sm">Aujourd'hui, 08:30 GMT+1</div>
            <div className="text-[11px] text-emerald-300">Relevés transmis par les coopératives</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Overview Table and Detailed Commodity Focus */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Commodity List & Trends */}
        <div className="lg:col-span-7 space-y-3">
          <div className="bg-white p-3.5 rounded-2xl border border-stone-200 shadow-xs flex items-center gap-2">
            <Search className="w-4 h-4 text-stone-400" />
            <input
              type="text"
              placeholder="Chercher une denrée (plantain, oignon, tomate, cacao...)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-xs sm:text-sm focus:outline-none bg-transparent"
            />
          </div>

          <div className="space-y-2.5">
            {filteredPrices.map((mp) => {
              const isSelected = activePrice?.id === mp.id;
              const isUp = mp.trend === 'HAUSSE';
              const isDown = mp.trend === 'BAISSE';

              return (
                <div
                  key={mp.id}
                  onClick={() => setSelectedCommodity(mp.id)}
                  className={`p-3.5 sm:p-4 rounded-2xl border transition cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-emerald-50 border-emerald-600 shadow-xs'
                      : 'bg-white border-stone-200 hover:border-emerald-300 shadow-2xs'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs sm:text-sm font-extrabold text-stone-900">
                        {mp.commodity}
                      </span>
                      <span className="text-[10px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded-md font-semibold">
                        par {mp.unit}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-stone-500">
                      <MapPin className="w-3 h-3 text-emerald-700" />
                      <span>Marché pilote : {mp.topMarket}</span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-sm sm:text-base font-black text-stone-900">
                      {mp.currentAvgPrice.toLocaleString('fr-FR')}{' '}
                      <span className="text-[10px] font-bold text-stone-500">FCFA</span>
                    </div>

                    <div className="flex items-center justify-end gap-1 mt-0.5">
                      {isUp && (
                        <span className="inline-flex items-center gap-0.5 text-[11px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded-md">
                          <ArrowUpRight className="w-3 h-3" /> +{mp.changePercent}%
                        </span>
                      )}
                      {isDown && (
                        <span className="inline-flex items-center gap-0.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-md">
                          <ArrowDownRight className="w-3 h-3" /> {mp.changePercent}%
                        </span>
                      )}
                      {!isUp && !isDown && (
                        <span className="inline-flex items-center gap-0.5 text-[11px] font-bold text-stone-600 bg-stone-100 px-1.5 py-0.5 rounded-md">
                          <Minus className="w-3 h-3" /> Stable
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Detailed Regional Breakdown of Selected Commodity */}
        <div className="lg:col-span-5 space-y-4">
          {activePrice && (
            <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-4 sm:p-5 space-y-4 sticky top-24">
              <div className="border-b border-stone-100 pb-3">
                <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
                  Détail par Région & Marché
                </span>
                <h3 className="text-lg font-black text-stone-900 mt-1">
                  {activePrice.commodity}
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Prix moyen national :{' '}
                  <span className="font-bold text-emerald-900">
                    {activePrice.currentAvgPrice.toLocaleString('fr-FR')} FCFA / {activePrice.unit}
                  </span>
                </p>
              </div>

              {/* Market bulletin note */}
              <div className="bg-amber-50 p-3 rounded-2xl border border-amber-200/80 flex items-start gap-2.5 text-xs text-amber-950">
                <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <strong>Note de marché :</strong> {activePrice.marketNotice}
                </p>
              </div>

              {/* Regional Price Cards */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                  Prix selon les Régions du Cameroun
                </h4>

                {Object.entries(activePrice.regionalPrices).map(([region, price]) => {
                  const diff = price - activePrice.currentAvgPrice;
                  const isHigher = diff > 0;
                  const isLower = diff < 0;

                  return (
                    <div
                      key={region}
                      className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between text-xs"
                    >
                      <div className="space-y-0.5">
                        <span className="font-bold text-stone-800">{region}</span>
                        <div className="text-[10px] text-stone-500">
                          {region.includes('Yaoundé')
                            ? 'Marché Mfoundi / 8ème'
                            : region.includes('Douala')
                            ? 'Marché Sandaga / Deido'
                            : region.includes('Ouest')
                            ? 'Marché A / Foumbot'
                            : region.includes('Maroua')
                            ? 'Marché Central Maroua'
                            : 'Marchés locaux'}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-black text-stone-900 text-sm">
                          {price.toLocaleString('fr-FR')}{' '}
                          <span className="text-[10px] font-bold text-stone-500">FCFA</span>
                        </div>
                        <div className="text-[10px]">
                          {isHigher && (
                            <span className="text-red-600 font-bold">
                              +{diff.toLocaleString('fr-FR')} FCFA (zone de déficit)
                            </span>
                          )}
                          {isLower && (
                            <span className="text-emerald-700 font-bold">
                              {diff.toLocaleString('fr-FR')} FCFA (bassin de production)
                            </span>
                          )}
                          {!isHigher && !isLower && (
                            <span className="text-stone-500 font-medium">Prix moyen</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Action advice for farmers and wholesalers */}
              <div className="bg-emerald-950 text-white p-3.5 rounded-2xl text-xs space-y-1.5">
                <div className="font-bold text-amber-300 flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Conseil Transport & Rentabilité</span>
                </div>
                <p className="text-stone-300 leading-relaxed text-[11px]">
                  L'écart de prix entre le bassin de l'Ouest/Moungo et Douala/Yaoundé couvre largement le coût de transport par camionnette (environ 1 500 à 2 500 FCFA par sac). Pensez aux groupages de chargements !
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
