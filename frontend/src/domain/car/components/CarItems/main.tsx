import { useState } from 'react';
import { Button } from '@/core/components/button';
import { CheckCircle2, Plus } from 'lucide-react';
import { CarDetail } from '../../types';

interface CarItemsProps {
  items: CarDetail['itens'];
}

export const CarItems = ({ items }: CarItemsProps) => {
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  return (
    <div className="space-y-6">
      {items.map((category, idx) => (
        <div key={idx} className="space-y-3">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            {category.categoria_item}
            <span className="text-xs font-normal text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
              {category.itens_serie.length + category.opcionais.length} itens
            </span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
            {category.itens_serie
              .slice(0, expandedCategories.includes(category.categoria_item) ? undefined : 6)
              .map((item, i) => (
                <div key={`serie-${i}`} className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            {category.opcionais
              .slice(0, expandedCategories.includes(category.categoria_item) ? undefined : 4)
              .map((item, i) => (
                <div key={`opt-${i}`} className="flex items-center gap-2 text-sm">
                  <Plus className="h-4 w-4 text-primary-600 flex-shrink-0" />
                  <span className="text-muted-foreground">{item} (Opcional)</span>
                </div>
              ))}
          </div>

          {category.itens_serie.length + category.opcionais.length > 10 && (
            <Button
              variant="link"
              size="sm"
              onClick={() => toggleCategory(category.categoria_item)}
              className="px-0"
            >
              {expandedCategories.includes(category.categoria_item) ? 'Ver menos' : 'Ver mais'}
            </Button>
          )}
        </div>
      ))}
    </div>
  );
};
