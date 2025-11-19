import { useCarList } from '../../hooks/useCarList';
import { CarCard, CarCardSkeleton } from '../CarCard';
import { Button } from '@/core/components/button';
import { useNavigation } from '@/core/hooks/useNavigation';

interface CarSimilarProps {
  brand: string;
  currentCarId: string;
}

export const CarSimilar = ({ brand, currentCarId }: CarSimilarProps) => {
  const { navigate } = useNavigation();

  const { data, isLoading } = useCarList({
    brand,
    pageSize: 4,
    page: 1,
  });

  // Filter out current car and limit to 3 items
  const similarCars = data?.data.filter((car) => car.id_veiculo !== currentCarId).slice(0, 3) || [];

  if (!isLoading && similarCars.length === 0) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Veículos Similares</h2>
        <Button variant="link" onClick={() => navigate(`/?brand=${brand}`)}>
          Ver todos da {brand}
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => <CarCardSkeleton key={i} />)
          : similarCars.map((car) => <CarCard key={car.id_veiculo} car={car} />)}
      </div>
    </div>
  );
};
