import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useCarList } from '@/domain/car/hooks/useCarList';
import { CarCard, CarCardSkeleton } from '@/domain/car/components/CarCard';
import { CarFilters } from '@/domain/car/components/CarFilters';
import { CarSort } from '@/domain/car/components/CarSort';
import { CarPagination } from '@/domain/car/components/CarPagination';
import { Button } from '@/core/components/button';
import { Filter } from 'lucide-react';

export const HomePage = () => {
  const [searchParams] = useSearchParams();
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const page = Number(searchParams.get('page')) || 1;
  const pageSize = Number(searchParams.get('pageSize')) || 12;

  const { data, isLoading, isError, refetch } = useCarList({
    brand: searchParams.get('brand') || undefined,
    model: searchParams.get('model') || undefined,
    yearMin: searchParams.get('yearMin') ? Number(searchParams.get('yearMin')) : undefined,
    yearMax: searchParams.get('yearMax') ? Number(searchParams.get('yearMax')) : undefined,
    priceMin: searchParams.get('priceMin') ? Number(searchParams.get('priceMin')) : undefined,
    priceMax: searchParams.get('priceMax') ? Number(searchParams.get('priceMax')) : undefined,
    transmission: searchParams.get('transmission')
      ? [searchParams.get('transmission')!]
      : undefined,
    sort: searchParams.get('sort') || undefined,
    page,
    pageSize,
  });

  const toggleMobileFilters = () => setIsMobileFiltersOpen(!isMobileFiltersOpen);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Catálogo de Veículos</h1>
          <p className="text-muted-foreground">Encontre o carro perfeito para você</p>
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Button variant="outline" className="md:hidden flex-1" onClick={toggleMobileFilters}>
            <Filter className="mr-2 h-4 w-4" />
            Filtros
          </Button>
          <CarSort />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <aside
          className={`md:col-span-1 ${
            isMobileFiltersOpen
              ? 'fixed inset-0 z-50 bg-background p-4 overflow-y-auto'
              : 'hidden md:block'
          }`}
        >
          <CarFilters isOpen={isMobileFiltersOpen} onClose={() => setIsMobileFiltersOpen(false)} />
        </aside>

        {/* Main Content */}
        <section className="md:col-span-3 space-y-6">
          {isError ? (
            <div className="flex flex-col items-center justify-center h-64 rounded-lg border bg-card p-8 text-center">
              <h3 className="text-lg font-semibold mb-2">Erro ao carregar veículos</h3>
              <p className="text-muted-foreground mb-4">
                Ocorreu um problema ao buscar os dados. Tente novamente.
              </p>
              <Button onClick={() => refetch()}>Tentar novamente</Button>
            </div>
          ) : isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <CarCardSkeleton key={i} />
              ))}
            </div>
          ) : data?.data.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 rounded-lg border bg-card p-8 text-center">
              <h3 className="text-lg font-semibold mb-2">Nenhum veículo encontrado</h3>
              <p className="text-muted-foreground mb-4">
                Não encontramos veículos com os filtros selecionados. Tente remover alguns filtros
                ou alterar os critérios de busca.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  // Logic to clear filters is handled in CarFilters, but we can provide a hint or action here if needed
                  // For now, user can use the "Limpar Filtros" in the sidebar
                }}
              >
                Ver todos os veículos
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {data?.data.map((car) => (
                  <CarCard key={car.id_veiculo} car={car} />
                ))}
              </div>

              {data?.meta && (
                <CarPagination
                  currentPage={data.meta.page}
                  totalPages={Math.ceil(data.meta.total / data.meta.pageSize)}
                  totalItems={data.meta.total}
                  pageSize={data.meta.pageSize}
                />
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
};
