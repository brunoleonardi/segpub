import React, { useState } from "react";
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
    } catch (err) {
      console.error("Erro ao buscar endereço:", err);
    }
  };

  return (
    <>
      {isMobile ? (
        <div
          className={`flex gap-2 px-4 py-3 ${isHome ? "w-[90dvw]" : ""} rounded-full shadow-md backdrop-blur-md ${
            isDarkMode ? "bg-zinc-700/40" : "bg-[#D5E6FF]/40"
          }`}
        >
          <Menu
            onClick={() => setIsOpen(true)}
            size={20}
            className={`${isDarkMode ? "text-gray-200" : "text-gray-600"} ${isHome ? "mr-2" : ""}`}
          />
          {isHome && (
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
              placeholder="Buscar Endereço"
              className={`bg-transparent outline-none text-sm w-full ${
                isDarkMode ? "text-gray-100 placeholder-gray-400" : "text-gray-700 placeholder-gray-500"
              }`}
            />
          )}
        </div>
      ) : (
        <div className={`absolute top-3 flex justify-center ${isHome ? "w-full" : ""}`}>
          {isHome && (
            <div className="relative w-[25dvw]">
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearch();
                }}
                placeholder="Buscar Endereço"
                className={`w-full outline-none text-sm py-2.5 pl-4 pr-12 rounded-full shadow-md backdrop-blur-md theme-aware-sidebar ${
                  isDarkMode ? "text-gray-100 placeholder-gray-400" : "text-gray-700 placeholder-gray-500"
                }`}
              />
              <button
                onClick={handleSearch}
                className="absolute inset-y-0 right-4 flex items-center justify-center text-gray-500"
              >
                <Search size={18} className={isDarkMode ? "text-gray-400" : "text-gray-500"} />
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
};
