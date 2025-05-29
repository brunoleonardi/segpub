import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { HexColorPicker } from 'react-colorful';
import { Plus, PlusIcon, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface POIType {
  id: string;
  name: string;
  color: string;
}

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
  const [poiTypes, setPoiTypes] = useState<POIType[]>([]);

  const fetchPOITypes = async () => {
    try {
      const { data, error } = await supabase
        .from('poi_types')
        .select('*')
        .order('name');

      if (error) throw error;
      setPoiTypes(data || []);
    } catch (error) {
      console.error('Error fetching POI types:', error);
    }
  };

  useEffect(() => {
    if (open) {
      fetchPOITypes();
    }
  }, [open]);

  const handleCreateType = async () => {
    try {
      setError(null);

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

      // Refresh POI types list
      await fetchPOITypes();

      // Reset form and close type creation
      setShowTypeForm(false);
      setNewTypeName('');
      setSelectedColor('#000000');

      // Select the newly created type
      if (data && data[0]) {
        setSelectedType(data[0].id);
      }
    } catch (error) {
      console.error('Error creating POI type:', error);
    }
  };

  const handleCreatePOI = async () => {
    try {
      setError(null);

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
      <DialogContent className={`border-none rounded-2xl backdrop-blur-[2px] px-6 pt-5 shadow-md cursor-default z-50 ${isDarkMode
        ? 'bg-zinc-900/60'
        : 'bg-[#EFF4FA]/70'}`}>
        <DialogHeader>
          <DialogTitle className={isDarkMode ? 'text-gray-200 py-4' : 'py-4'}>
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
            <div className='block mb-5'>
              <Label className={`${isDarkMode ? 'text-gray-300' : ''}`}>Nome do Tipo</Label>
              <input
                type="text"
                value={newTypeName}
                onChange={(e) => setNewTypeName(e.target.value)}
                className={`w-full mt-1.5 p-2 rounded-md ${isDarkMode
                  ? 'bg-zinc-700 text-gray-200 border-zinc-600'
                  : 'border-gray-300'
                  }`}
              />
            </div>
            <div className='w-[full] flex flex-col justify-center items-center'>
              <HexColorPicker color={selectedColor} onChange={setSelectedColor} />
            </div>
            <DialogFooter className="flex justify-between mt-4">
              <button
                onClick={() => setShowTypeForm(false)}
                className={`px-3 py-2 text-destructive text-sm flex items-center gap-2 rounded-md ${isDarkMode
                  ? 'bg-zinc-700 text-gray-200 hover:bg-zinc-600'
                  : 'bg-gray-200 hover:bg-gray-300'
                  }`}
              >
                <X size={15} /> Cancelar
              </button>
              <button
                onClick={handleCreateType}
                className="px-3 py-2 flex items-center text-sm gap-2 rounded-md bg-blue-500 text-white hover:bg-blue-600"
              >
                <Plus size={15} /> Criar
              </button>
            </DialogFooter>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <Label className={isDarkMode ? 'text-gray-300' : ''}>Nome</Label>
              <input
                type="text"
                value={poiName}
                onChange={(e) => setPoiName(e.target.value)}
                className={`w-full mt-1.5 p-2 rounded-md ${isDarkMode
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
                    {poiTypes.map((type) => (
                      <SelectItem
                        key={type.id}
                        value={type.id}
                        className={isDarkMode ? 'text-gray-200 focus:bg-zinc-600' : ''}
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: type.color }}
                          />
                          {type.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <button
                  onClick={() => setShowTypeForm(true)}
                  className={`p-2 rounded-md ${isDarkMode
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
                  className={`w-full mt-1.5 p-2 rounded-md ${isDarkMode
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
                  className={`w-full mt-1.5 p-2 rounded-md ${isDarkMode
                    ? 'bg-zinc-700 text-gray-200 border-zinc-600'
                    : 'border-gray-300'
                    }`}
                />
              </div>
            </div>
            <DialogFooter className="flex justify-end mt-4">
              <button
                onClick={handleCreatePOI}
                className="px-4 py-2 flex items-center gap-2 rounded-md bg-blue-500 text-white text-sm hover:bg-blue-600"
              >
                <Plus size={15} /> Criar
              </button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};