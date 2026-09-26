import React, { useState } from 'react';
import { Download, Smartphone, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running as an installed PWA, hide the button
  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="inline-flex items-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-600 px-3 py-1.5 text-xs font-bold text-stone-900 shadow-md transition-all active:scale-95"
        title="Installer AGRI LINK CAM sur votre écran d'accueil"
      >
        <Download className="w-4 h-4 text-stone-950" />
        <span className="hidden sm:inline">Installer l'App</span>
        <span className="sm:hidden">Installer</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-300 bg-emerald-50 px-2.5 py-1.5 text-xs font-semibold text-emerald-800 hover:bg-emerald-100 transition active:scale-95"
          title="Installer sur iPhone"
        >
          <Smartphone className="w-3.5 h-3.5 text-emerald-700" />
          <span>Installer iOS</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-stone-200">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-base font-bold text-emerald-950 flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                  Installer sur iPhone / iPad
                </h3>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 text-stone-400 hover:text-stone-700 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-sm text-stone-600 mb-4 leading-relaxed">
                Profitez d'AGRI LINK CAM même sans réseau au champ :
              </p>
              <ol className="text-xs text-stone-700 space-y-2.5 bg-stone-50 p-3.5 rounded-xl border border-stone-200">
                <li className="flex items-start gap-2">
                  <span className="font-bold text-emerald-800 bg-emerald-100 rounded-full w-5 h-5 flex items-center justify-center shrink-0">1</span>
                  <span>Touchez le bouton <strong>Partager</strong> <span className="text-blue-600">⎋</span> dans la barre Safari du bas.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-emerald-800 bg-emerald-100 rounded-full w-5 h-5 flex items-center justify-center shrink-0">2</span>
                  <span>Faites défiler vers le bas et sélectionnez <strong>Sur l'écran d'accueil</strong>.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-emerald-800 bg-emerald-100 rounded-full w-5 h-5 flex items-center justify-center shrink-0">3</span>
                  <span>Validez en touchant <strong>Ajouter</strong> en haut à droite.</span>
                </li>
              </ol>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-4 w-full rounded-xl bg-emerald-800 py-2.5 text-xs font-bold text-white hover:bg-emerald-900 transition"
              >
                Compris
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
