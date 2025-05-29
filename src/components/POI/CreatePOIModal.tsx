import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { HexColorPicker } from 'react-colorful';
import { PlusIcon } from 'lucide-react';
import { supabase, isAuthenticated } from '../../lib/supabase';

interface CreatePOIModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isDarkMode?: boolean;
}

export const CreatePOIModal: React.FC<CreatePOIModalProps> = ({ open, onOpenChange, isDarkMode }) => {
  const [showTypeForm, setShowTypeForm] = useState(false);
  const [newTypeName, setNewTypeName] = useState('');
  const [selectedColor, setSelectedColor] = useState('#000000');
  const [selectedType, setSelectedType] = useState('');
  const [poiName, setPoiName] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleCreateType = async () => {
    try {
      setError(null);
      
      // Check if user is authenticated
      const authenticated = await isAuthenticated();
      if (!authenticated) {
        setError('You must be logged in to create POI types');
        return;
      }

      const { data, error: insertError } = await supabase
        .from('poi_types')
        .insert([
          { name: newTypeName, color: selectedColor }
        ])
        .select();

      if (insertError) {
        setError(insertError.message);
        throw insertError;
      }

      setShowTypeForm(false);
      setNewTypeName('');
      setSelectedColor('#000000');
    } catch (error) {
      console.error('Error creating POI type:', error);
    }
  };

  const handleCreatePOI = async () => {
    try {
      setError(null);

      // Check if user is authenticated
      const authenticated = await isAuthenticated();
      if (!authenticated) {
        setError('You must be logged in to create POIs');
        return;
      }

      const { data, error: insertError } = await supabase
        .from('pois')
        .insert([
          {
            name: poiName,
            type_id: selectedType,
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude)
          }
        ])
        .select();

      if (insertError) {
        setError(insertError.message);
        throw insertError;
      }

      onOpenChange(false);
      setPoiName('');
      setSelectedType('');
      setLatitude('');
      setLongitude('');
    } catch (error) {
      console.error('Error creating POI:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={isDarkMode ? 'bg-zinc-800 border-zinc-700' : ''}>
        <DialogHeader>
          <DialogTitle className={isDarkMode ? 'text-gray-200' : ''}>
            {showTypeForm ? 'Criar Novo Tipo' : 'Criar Ponto de Interesse'}
          </DialogTitle>
        </DialogHeader>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {showTypeForm ? (
          <div className="space-y-4">
            <div>
              <Label className={isDarkMode ? 'text-gray-300' : ''}>Nome do Tipo</Label>
              <input
                type="text"
                value={newTypeName}
                onChange={(e) => setNewTypeName(e.target.value)}
                className={`w-full mt-1.5 p-2 rounded-md ${
                  isDarkMode 
                    ? 'bg-zinc-700 text-gray-200 border-zinc-600' 
                    : 'border-gray-300'
                }`}
              />
            </div>
            <div>
              <Label className={isDarkMode ? 'text-gray-300' : ''}>Cor</Label>
              <HexColorPicker color={selectedColor} onChange={setSelectedColor} />
            </div>
            <DialogFooter className="flex justify-between mt-4">
              <button
                onClick={() => setShowTypeForm(false)}
                className={`px-4 py-2 rounded-md ${
                  isDarkMode 
                    ? 'bg-zinc-700 text-gray-200 hover:bg-zinc-600' 
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateType}
                className="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600"
              >
                Criar Tipo
              </button>
            </DialogFooter>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <Label className={isDarkMode ? 'text-gray-300' : ''}>Nome do POI</Label>
              <input
                type="text"
                value={poiName}
                onChange={(e) => setPoiName(e.target.value)}
                className={`w-full mt-1.5 p-2 rounded-md ${
                  isDarkMode 
                    ? 'bg-zinc-700 text-gray-200 border-zinc-600' 
                    : 'border-gray-300'
                }`}
              />
            </div>
            <div>
              <Label className={isDarkMode ? 'text-gray-300' : ''}>Tipo</Label>
              <div className="flex gap-2 mt-1.5">
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className={isDarkMode ? 'bg-zinc-700 border-zinc-600 text-gray-200' : ''}>
                    <SelectValue placeholder="Selecione um tipo" />
                  </SelectTrigger>
                  <SelectContent className={isDarkMode ? 'bg-zinc-700 border-zinc-600' : ''}>
                    {/* Add SelectItems dynamically from your Supabase data */}
                  </SelectContent>
                </Select>
                <button
                  onClick={() => setShowTypeForm(true)}
                  className={`p-2 rounded-md ${
                    isDarkMode 
                      ? 'bg-zinc-700 text-gray-200 hover:bg-zinc-600' 
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  <PlusIcon size={20} />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className={isDarkMode ? 'text-gray-300' : ''}>Latitude</Label>
                <input
                  type="number"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  className={`w-full mt-1.5 p-2 rounded-md ${
                    isDarkMode 
                      ? 'bg-zinc-700 text-gray-200 border-zinc-600' 
                      : 'border-gray-300'
                  }`}
                />
              </div>
              <div>
                <Label className={isDarkMode ? 'text-gray-300' : ''}>Longitude</Label>
                <input
                  type="number"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  className={`w-full mt-1.5 p-2 rounded-md ${
                    isDarkMode 
                      ? 'bg-zinc-700 text-gray-200 border-zinc-600' 
                      : 'border-gray-300'
                  }`}
                />
              </div>
            </div>
            <DialogFooter className="flex justify-end mt-4">
              <button
                onClick={handleCreatePOI}
                className="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600"
              >
                Criar POI
              </button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};