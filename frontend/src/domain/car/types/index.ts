import { z } from 'zod';
import { contactSchema } from '../validations/contact';

export interface Car {
  id_veiculo: string;
  modelo: string;
  marca: string;
  ano: number;
  preco: number;
  imagem_principal: string;
  quilometragem?: number;
  cambio?: string;
}

export interface CarDetail extends Car {
  titulo_anuncio: string;
  status_veiculo: string;
  fotos: Array<{
    url: string;
    legenda?: string;
  }>;
  especificacoes: {
    ano_fabricacao: number;
    ano_modelo: number;
    combustivel: string;
    potencia: string;
    cor: string;
    portas: number;
    carroceria: string;
    motor: string;
    final_placa: number;
  };
  itens: {
    itens_serie: string[];
    opcionais: string[];
    categoria_item: string;
  }[];
  historico: {
    procedencia: string;
    proprietarios: number;
    garantia?: string;
    revisoes?: Array<{ data: string; km: number; local: string }>;
    sinistros?: Array<{ data: string; tipo: string; descricao: string }>;
    laudo_tecnico?: { data: string; resultado: string };
  };
  condicoes: {
    formas_pagamento: string[];
    condicoes_financiamento?: { entrada_minima: number; taxa_juros: number; prazo_maximo: number };
    aceita_troca: boolean;
    observacoes_venda?: string;
    documentacao_necessaria: Array<{ nome: string; obs?: string }>;
    situacao_documental: { status: string; pendencias?: string[]; observacoes?: string };
  };
  url_compartilhamento: string;
}

export interface CarFilterParams {
  brand?: string;
  model?: string;
  yearMin?: number;
  yearMax?: number;
  priceMin?: number;
  priceMax?: number;
  transmission?: string[];
  sort?: string;
  page?: number;
  pageSize?: number;
}

export interface CarListResponse {
  success: boolean;
  data: Car[];
  meta: {
    page: number;
    pageSize: number;
    total: number;
  };
}

export interface CarDetailResponse {
  success: boolean;
  data: CarDetail;
}

export type ContactFormData = z.infer<typeof contactSchema>;
