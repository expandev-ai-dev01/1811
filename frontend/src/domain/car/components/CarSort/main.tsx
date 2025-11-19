import { useSearchParams } from 'react-router-dom';
import { Select } from '@/core/components/select';
import { SORT_OPTIONS } from '../../constants/filters';

export const CarSort = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentSort = searchParams.get('sort') || 'relevance';

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams);
    params.set('sort', e.target.value);
    setSearchParams(params);
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium whitespace-nowrap text-muted-foreground hidden sm:inline">
        Ordenar por:
      </span>
      <div className="w-48">
        <Select value={currentSort} onChange={handleSortChange} aria-label="Ordenar resultados">
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </div>
    </div>
  );
};
