import { useParams } from 'react-router-dom';
import { useCarDetail } from '@/domain/car/hooks/useCarDetail';
import { CarGallery } from '@/domain/car/components/CarGallery';
import { CarSpecs } from '@/domain/car/components/CarSpecs';
import { CarItems } from '@/domain/car/components/CarItems';
import { CarHistory } from '@/domain/car/components/CarHistory';
import { CarContactForm } from '@/domain/car/components/CarContactForm';
import { CarSimilar } from '@/domain/car/components/CarSimilar';
import { LoadingSpinner } from '@/core/components/loading-spinner';
import { Button } from '@/core/components/button';
import { Badge } from '@/core/components/badge';
import { formatCurrency } from '@/core/utils/format';
import { useNavigation } from '@/core/hooks/useNavigation';
import { ArrowLeft, Share2 } from 'lucide-react';

export const CarDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { goBack } = useNavigation();
  const { data, isLoading, isError } = useCarDetail(id!);

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <LoadingSpinner className="h-8 w-8" />
      </div>
    );
  }

  if (isError || !data?.data) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <h2 className="text-2xl font-bold">Veículo não encontrado</h2>
        <Button onClick={goBack}>Voltar</Button>
      </div>
    );
  }

  const car = data.data;

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: car.titulo_anuncio,
          text: `Confira este ${car.marca} ${car.modelo} por ${formatCurrency(car.preco)}`,
          url: window.location.href,
        })
        .catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copiado para a área de transferência!');
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Navigation */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={goBack} className="gap-2 pl-0 hover:pl-2 transition-all">
          <ArrowLeft className="h-4 w-4" />
          Voltar para listagem
        </Button>
        <Button variant="outline" size="sm" onClick={handleShare} className="gap-2">
          <Share2 className="h-4 w-4" />
          Compartilhar
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Gallery & Details */}
        <div className="lg:col-span-2 space-y-8">
          <div className="space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">{car.titulo_anuncio}</h1>
                <p className="text-muted-foreground">
                  {car.marca} {car.modelo} • {car.especificacoes.ano_fabricacao}/
                  {car.especificacoes.ano_modelo}
                </p>
              </div>
              <div className="text-right">
                <h2 className="text-3xl font-bold text-primary-600">{formatCurrency(car.preco)}</h2>
                <Badge variant={car.status_veiculo === 'Disponível' ? 'default' : 'secondary'}>
                  {car.status_veiculo}
                </Badge>
              </div>
            </div>

            <CarGallery photos={car.fotos} mainPhoto={car.imagem_principal} />
          </div>

          <section className="space-y-4">
            <h3 className="text-xl font-bold border-b pb-2">Especificações Técnicas</h3>
            <CarSpecs
              specs={car.especificacoes}
              mileage={car.quilometragem || 0}
              transmission={car.cambio}
            />
          </section>

          <section className="space-y-4">
            <h3 className="text-xl font-bold border-b pb-2">Itens e Opcionais</h3>
            <CarItems items={car.itens} />
          </section>

          <section className="space-y-4">
            <h3 className="text-xl font-bold border-b pb-2">Histórico e Procedência</h3>
            <CarHistory history={car.historico} />
          </section>

          {car.condicoes.observacoes_venda && (
            <section className="space-y-4">
              <h3 className="text-xl font-bold border-b pb-2">Observações</h3>
              <p className="text-muted-foreground leading-relaxed">
                {car.condicoes.observacoes_venda}
              </p>
            </section>
          )}
        </div>

        {/* Right Column - Contact Form (Sticky) */}
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <CarContactForm carId={car.id_veiculo} carTitle={car.titulo_anuncio} />

            <div className="mt-6 p-4 bg-muted/30 rounded-lg text-sm text-muted-foreground">
              <p className="font-medium mb-2">Condições de Pagamento:</p>
              <ul className="list-disc list-inside space-y-1">
                {car.condicoes.formas_pagamento.map((forma, i) => (
                  <li key={i}>{forma}</li>
                ))}
              </ul>
              {car.condicoes.aceita_troca && (
                <p className="mt-2 text-primary-600 font-medium">Aceita troca</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Similar Vehicles */}
      <section className="pt-8 border-t">
        <CarSimilar brand={car.marca} currentCarId={car.id_veiculo} />
      </section>
    </div>
  );
};
