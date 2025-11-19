import { Card, CardContent, CardFooter, CardHeader } from '@/core/components/card';
import { Badge } from '@/core/components/badge';
import { formatCurrency, formatMileage } from '@/core/utils/format';
import type { Car } from '../../types';
import { useNavigation } from '@/core/hooks/useNavigation';

interface CarCardProps {
  car: Car;
}

export const CarCard = ({ car }: CarCardProps) => {
  const { navigate } = useNavigation();

  const handleClick = () => {
    navigate(`/car/${car.id_veiculo}`);
  };

  return (
    <Card
      className="overflow-hidden transition-all hover:shadow-md cursor-pointer group h-full flex flex-col"
      onClick={handleClick}
    >
      <div className="aspect-video w-full overflow-hidden bg-muted relative">
        <img
          src={car.imagem_principal}
          alt={`${car.marca} ${car.modelo}`}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = 'https://placehold.co/600x400?text=Sem+Imagem';
          }}
        />
        <div className="absolute top-2 right-2">
          <Badge variant="secondary" className="bg-white/90 text-black backdrop-blur-sm">
            {car.ano}
          </Badge>
        </div>
      </div>
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{car.marca}</p>
            <h3 className="font-bold text-lg leading-tight">{car.modelo}</h3>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2 flex-grow">
        <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
          {car.quilometragem !== undefined && (
            <span className="flex items-center gap-1">{formatMileage(car.quilometragem)}</span>
          )}
          {car.cambio && (
            <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-muted text-xs">
              {car.cambio}
            </span>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 border-t bg-muted/10 mt-auto">
        <div className="w-full pt-3">
          <p className="text-xl font-bold text-primary-600">{formatCurrency(car.preco)}</p>
        </div>
      </CardFooter>
    </Card>
  );
};

export const CarCardSkeleton = () => (
  <Card className="overflow-hidden h-full flex flex-col">
    <div className="aspect-video w-full bg-muted animate-pulse" />
    <CardHeader className="p-4 pb-2 space-y-2">
      <div className="h-4 w-1/3 bg-muted animate-pulse rounded" />
      <div className="h-6 w-2/3 bg-muted animate-pulse rounded" />
    </CardHeader>
    <CardContent className="p-4 pt-2 flex-grow">
      <div className="flex gap-2">
        <div className="h-4 w-16 bg-muted animate-pulse rounded" />
        <div className="h-4 w-16 bg-muted animate-pulse rounded" />
      </div>
    </CardContent>
    <CardFooter className="p-4 pt-0 border-t mt-auto">
      <div className="w-full pt-3">
        <div className="h-7 w-1/2 bg-muted animate-pulse rounded" />
      </div>
    </CardFooter>
  </Card>
);
