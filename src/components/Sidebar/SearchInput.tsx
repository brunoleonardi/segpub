import React, { useState, useEffect } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { useLocation } from "react-router-dom";
import { Menu, Search } from "lucide-react";
import { useMapContext } from "../../contexts/MapContext";
import { useIsMobile } from "../../hooks/useIsMobile";

interface SearchInputType {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const SearchInput: React.FC<SearchInputType> = ({ setIsOpen }) => {
  const [address, setAddress] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [canSuggest, setCanSuggest] = useState(true);
  const [hasTyped, setHasTyped] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);

  const location = useLocation();
  const isHome = location.pathname === "/";
  const isMobile = useIsMobile();
  const { isDarkMode } = useTheme();
  const { zoomToLocation } = useMapContext();

  const handleSearch = async () => {
    if (!address.trim()) return;

    const city = import.meta.env.VITE_SEARCH_CITY || "";
    const query = `${address}, ${city}`;

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`
      );
      const data = await res.json();

      if (data?.[0]) {
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);
        zoomToLocation(lat, lon, 18);
      } else {
        alert("Endereço não encontrado.");
      }

      setCanSuggest(false);
      setHasTyped(false);
      setSuggestions([]);
      setShowSuggestions(false);
    } catch (err) {
      console.error("Erro ao buscar endereço:", err);
    }
  };

  const handleSelectSuggestion = (suggestion: any) => {
    setAddress(suggestion.display_name);
    setShowSuggestions(false);
    setCanSuggest(false);
    setHasTyped(false);
    setHighlightedIndex(-1);

    const lat = parseFloat(suggestion.lat);
    const lon = parseFloat(suggestion.lon);
    zoomToLocation(lat, lon, 18);
  };

  useEffect(() => {
    if (!canSuggest || !hasTyped || address.trim().length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const controller = new AbortController();
    const timeout = setTimeout(async () => {
      try {
        const city = import.meta.env.VITE_SEARCH_CITY || "";
        const query = `${address}, ${city}`;
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`,
          { signal: controller.signal }
        );
        const data = await res.json();
        setSuggestions(data);
        setShowSuggestions(true);
        setHighlightedIndex(-1);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Erro ao buscar sugestões:", err);
        }
      }
    }, 300);

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [address, canSuggest, hasTyped]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev > 0 ? prev - 1 : suggestions.length - 1
      );
    } else if (e.key === "Enter") {
      if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
        e.preventDefault();
        handleSelectSuggestion(suggestions[highlightedIndex]);
      } else {
        handleSearch();
      }
    }
  };

  const renderSuggestions = () => {
  const containerClass = isMobile
    ? `absolute left-[-50px] mt-5 w-[90dvw] z-50 rounded-md max-h-60 overflow-auto text-sm p-1 
      ${isDarkMode ? "text-gray-200 shadow-md bg-zinc-700" : "text-gray-800 shadow-lg bg-white"}`
    : `scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent 
      hover:scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600 
      dark:hover:scrollbar-thumb-gray-500 absolute left-0 mt-1 w-full z-50 
      rounded-md max-h-60 overflow-auto text-sm p-1 
      ${isDarkMode ? "text-gray-200 shadow-md bg-zinc-800/80" : "text-gray-800 shadow-lg bg-white"} 
      backdrop-blur-md theme-aware-sidebar`;

  return (
    <div className={containerClass}>
      {suggestions.map((s, i) => {
        const parts = s.display_name.split(", ");
        const shortName = parts.slice(0, 5).join(", ");
        const isHighlighted = i === highlightedIndex;

        return (
          <div
            key={i}
            onClick={() => handleSelectSuggestion(s)}
            className={`px-4 py-2 cursor-pointer rounded-md text-xs leading-tight truncate ${
              isHighlighted
                ? isDarkMode
                  ? "bg-zinc-600 text-white"
                  : "bg-gray-200 text-black"
                : isDarkMode
                ? "hover:bg-zinc-700 hover:text-white"
                : "hover:bg-gray-100 hover:text-black"
            }`}
          >
            {shortName}
          </div>
        );
      })}
    </div>
  );
};

  return (
    <>
      {isMobile ? (
        <div
          className={`z-50 relative flex items-center gap-2 px-4 py-3 ${isHome ? "w-[90dvw]" : ""} rounded-full shadow-md backdrop-blur-md ${isDarkMode ? "bg-zinc-700/40" : "bg-[#D5E6FF]/40"}`}
        >
          <Menu
            onClick={() => setIsOpen(true)}
            size={20}
            className={`${isDarkMode ? "text-gray-200" : "text-gray-600"} ${isHome ? "mr-2" : ""}`}
          />
          {isHome && (
            <div className="relative w-full">
              <input
                type="text"
                value={address}
                onChange={(e) => {
                  setAddress(e.target.value);
                  setCanSuggest(true);
                  setHasTyped(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                onKeyDown={handleKeyDown}
                placeholder="Buscar Endereço"
                className={`bg-transparent outline-none text-sm w-full ${isDarkMode ? "text-gray-100 placeholder-gray-400" : "text-gray-700 placeholder-gray-500"}`}
              />
              {showSuggestions && suggestions.length > 0 && renderSuggestions()}
            </div>
          )}
        </div>
      ) : (
        <div className={`absolute top-3 flex justify-center ${isHome ? "w-full" : ""}`}>
          {isHome && (
            <div className="relative w-[25dvw]">
              <input
                type="text"
                value={address}
                onChange={(e) => {
                  setAddress(e.target.value);
                  setCanSuggest(true);
                  setHasTyped(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                onKeyDown={handleKeyDown}
                placeholder="Buscar Endereço"
                className={`w-full outline-none text-sm py-2.5 pl-4 pr-12 rounded-full shadow-md backdrop-blur-md theme-aware-sidebar ${isDarkMode ? "text-gray-100 placeholder-gray-400" : "text-gray-700 placeholder-gray-500"}`}
              />
              <button
                onClick={handleSearch}
                className="absolute inset-y-0 right-4 flex items-center justify-center text-gray-500"
              >
                <Search size={18} className={isDarkMode ? "text-gray-400" : "text-gray-500"} />
              </button>
              {showSuggestions && suggestions.length > 0 && renderSuggestions()}
            </div>
          )}
        </div>
      )}
    </>
  );
};
