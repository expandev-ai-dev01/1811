import { CarDetail } from '../../types';
import { formatMileage } from '@/core/utils/format';
import {
  Calendar,
  Gauge,
  Fuel,
  Settings,
  Zap,
  Palette,
  DoorOpen,
  Car,
  FileDigit,
} from 'lucide-react';

interface CarSpecsProps {
  specs: CarDetail['especificacoes'];
  mileage: number;
  transmission?: string;
}

export const CarSpecs = ({ specs, mileage, transmission }: CarSpecsProps) => {
  const items = [
    { icon: Calendar, label: 'Ano', value: `${specs.ano_fabricacao}/${specs.ano_modelo}` },
    { icon: Gauge, label: 'Quilometragem', value: formatMileage(mileage) },
    { icon: Fuel, label: 'Combustível', value: specs.combustivel },
    { icon: Settings, label: 'Câmbio', value: transmission || specs.combustivel },
    { icon: Zap, label: 'Potência', value: specs.potencia },
    { icon: Palette, label: 'Cor', value: specs.cor },
    { icon: DoorOpen, label: 'Portas', value: specs.portas },
    { icon: Car, label: 'Carroceria', value: specs.carroceria },
    { icon: Settings, label: 'Motor', value: specs.motor },
    { icon: FileDigit, label: 'Final da Placa', value: specs.final_placa },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {items.map((item, index) => (
        <div
          key={index}
          className="flex flex-col items-center justify-center p-4 rounded-lg border bg-card text-center hover:bg-muted/50 transition-colors"
        >
          <item.icon className="h-6 w-6 mb-2 text-primary-600" />
          <span className="text-xs text-muted-foreground uppercase tracking-wider">
            {item.label}
          </span>
          <span className="font-semibold text-sm">{item.value}</span>
        </div>
      ))}
    </div>
  );
};
