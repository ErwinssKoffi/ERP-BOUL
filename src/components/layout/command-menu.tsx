"use client";

import * as React from "react";
import { Search, X, Store, Box, Layers, Coins, ShieldCheck, FileText, ArrowRight } from "lucide-react";

export interface CommandItem {
  id: string;
  title: string;
  category: string;
  icon?: React.ReactNode;
  shortcut?: string;
  onSelect: () => void;
}

export function CommandMenu({
  isOpen,
  onClose,
  items,
}: {
  isOpen: boolean;
  onClose: () => void;
  items: CommandItem[];
}) {
  const [query, setQuery] = React.useState("");

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filtered = items.filter(
    (item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4">
      <div className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity" onClick={onClose} />

      <div className="relative w-full max-w-xl rounded-2xl border border-[#262f44] bg-[#0c0f18] text-gray-100 shadow-2xl z-10 overflow-hidden animate-scaleUp">
        <div className="flex items-center px-4 border-b border-[#1b2234]">
          <Search className="w-4 h-4 text-gray-400 mr-2.5" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher une action, module, recette ou commande..."
            className="w-full h-12 bg-transparent text-xs text-white placeholder:text-gray-500 focus:outline-none font-sans"
          />
          <span className="text-[10px] font-mono text-gray-500 border border-[#242b3e] px-1.5 py-0.5 rounded">
            ESC
          </span>
        </div>

        <div className="max-h-72 overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-xs text-gray-500">
              Aucun résultat pour « {query} »
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  item.onSelect();
                  onClose();
                }}
                className="flex items-center justify-between p-2.5 rounded-lg hover:bg-[#151a28] cursor-pointer text-xs text-gray-200 transition-colors group"
              >
                <div className="flex items-center space-x-2.5">
                  <div className="text-gray-400 group-hover:text-amber-400 transition-colors">
                    {item.icon}
                  </div>
                  <div>
                    <div className="font-medium text-white">{item.title}</div>
                    <div className="text-[10px] text-gray-500 font-mono">{item.category}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {item.shortcut && (
                    <span className="text-[10px] font-mono text-gray-500 bg-[#121622] px-1.5 py-0.5 rounded border border-[#212739]">
                      {item.shortcut}
                    </span>
                  )}
                  <ArrowRight className="w-3.5 h-3.5 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-2.5 bg-[#090b12] border-t border-[#181e2e] flex items-center justify-between text-[11px] text-gray-500 font-mono px-4">
          <span>Navigation : ↑ ↓</span>
          <span>Sélectionner : Entrée</span>
          <span>Fermer : Échap</span>
        </div>
      </div>
    </div>
  );
}
