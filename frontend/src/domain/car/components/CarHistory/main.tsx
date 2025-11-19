import { CarDetail } from '../../types';
import { ShieldCheck, AlertTriangle, FileText, History } from 'lucide-react';
import { Badge } from '@/core/components/badge';

interface CarHistoryProps {
  history: CarDetail['historico'];
}

export const CarHistory = ({ history }: CarHistoryProps) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-3">
              <History className="h-5 w-5 text-primary-600" />
              <span className="font-medium">Procedência</span>
            </div>
            <span>{history.procedencia}</span>
          </div>

          <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-primary-600" />
              <span className="font-medium">Proprietários</span>
            </div>
            <Badge variant="secondary">{history.proprietarios} dono(s)</Badge>
          </div>

          {history.garantia && (
            <div className="flex items-center justify-between p-4 bg-green-50 border border-green-100 rounded-lg">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-green-600" />
                <span className="font-medium text-green-900">Garantia</span>
              </div>
              <span className="text-green-700 font-medium">{history.garantia}</span>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h4 className="font-medium mb-2">Sinistros e Ocorrências</h4>
          {history.sinistros && history.sinistros.length > 0 ? (
            <div className="space-y-2">
              {history.sinistros.map((sinistro, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3 bg-red-50 border border-red-100 rounded-md"
                >
                  <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-red-900">{sinistro.tipo}</p>
                    <p className="text-sm text-red-700">
                      {sinistro.descricao} - {sinistro.data}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-100 rounded-lg">
              <ShieldCheck className="h-6 w-6 text-green-600" />
              <div>
                <p className="font-medium text-green-900">Sem registro de sinistros</p>
                <p className="text-sm text-green-700">Veículo aprovado na vistoria cautelar</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
