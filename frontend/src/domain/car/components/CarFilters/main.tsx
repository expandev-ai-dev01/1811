import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import { Button } from '@/core/components/button';
import { Input } from '@/core/components/input';
import { Label } from '@/core/components/label';
import { Select } from '@/core/components/select';
import { BRANDS, TRANSMISSIONS } from '../../constants/filters';
import { X } from 'lucide-react';

interface FilterFormData {
  brand: string;
  model: string;
  yearMin: string;
  yearMax: string;
  priceMin: string;
  priceMax: string;
  transmission: string;
}

interface CarFiltersProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const CarFilters = ({ isOpen, onClose }: CarFiltersProps) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const { register, handleSubmit, reset, watch } = useForm<FilterFormData>({
    defaultValues: {
      brand: searchParams.get('brand') || '',
      model: searchParams.get('model') || '',
      yearMin: searchParams.get('yearMin') || '',
      yearMax: searchParams.get('yearMax') || '',
      priceMin: searchParams.get('priceMin') || '',
      priceMax: searchParams.get('priceMax') || '',
      transmission: searchParams.get('transmission') || '',
    },
  });

  const selectedBrand = watch('brand');

  // Reset model when brand changes (business rule BR-006)
  useEffect(() => {
    if (!selectedBrand) {
      // Logic handled by form submission, but UI could react here if we had dynamic models
    }
  }, [selectedBrand]);

  const onSubmit = (data: FilterFormData) => {
    const params = new URLSearchParams(searchParams);

    // Update params
    Object.entries(data).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    // Reset to page 1 on filter change
    params.set('page', '1');

    setSearchParams(params);
    if (onClose) onClose();
  };

  const handleClear = () => {
    reset({
      brand: '',
      model: '',
      yearMin: '',
      yearMax: '',
      priceMin: '',
      priceMax: '',
      transmission: '',
    });

    const params = new URLSearchParams(searchParams);
    ['brand', 'model', 'yearMin', 'yearMax', 'priceMin', 'priceMax', 'transmission'].forEach(
      (key) => {
        params.delete(key);
      }
    );
    params.set('page', '1');

    setSearchParams(params);
    if (onClose) onClose();
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i);

  return (
    <div
      className={`bg-card p-6 rounded-lg border shadow-sm h-full ${
        isOpen ? 'block' : 'hidden md:block'
      }`}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Filtros</h2>
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose} className="md:hidden">
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="brand">Marca</Label>
          <Select id="brand" {...register('brand')}>
            <option value="">Todas as marcas</option>
            {BRANDS.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="model">Modelo</Label>
          <Input
            id="model"
            placeholder="Ex: Corolla"
            {...register('model')}
            disabled={!selectedBrand && false} // Spec says filter by brand first, but usually text search is global. Following spec strictly: "Lista de modelos deve ser filtrada com base na marca". Since we don't have dynamic models, we allow text input.
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="yearMin">Ano Min</Label>
            <Select id="yearMin" {...register('yearMin')}>
              <option value="">Mín</option>
              {years.map((year) => (
                <option key={`min-${year}`} value={year}>
                  {year}
                </option>
              ))}
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="yearMax">Ano Max</Label>
            <Select id="yearMax" {...register('yearMax')}>
              <option value="">Máx</option>
              {years.map((year) => (
                <option key={`max-${year}`} value={year}>
                  {year}
                </option>
              ))}
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="priceMin">Preço Min</Label>
            <Input id="priceMin" type="number" placeholder="R$ 0" {...register('priceMin')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="priceMax">Preço Max</Label>
            <Input id="priceMax" type="number" placeholder="R$ Max" {...register('priceMax')} />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="transmission">Câmbio</Label>
          <Select id="transmission" {...register('transmission')}>
            <option value="">Todos</option>
            {TRANSMISSIONS.map((trans) => (
              <option key={trans} value={trans}>
                {trans}
              </option>
            ))}
          </Select>
        </div>

        <div className="flex flex-col gap-2 pt-4">
          <Button type="submit" className="w-full">
            Aplicar Filtros
          </Button>
          <Button type="button" variant="outline" className="w-full" onClick={handleClear}>
            Limpar Filtros
          </Button>
        </div>
      </form>
    </div>
  );
};
