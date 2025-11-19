/**
 * @interface ContactCreateRequest
 * @description Parameters for creating a new contact request
 */
export interface ContactCreateRequest {
  idAccount: number;
  idCar: number;
  name: string;
  email: string;
  phone: string;
  contactPreference: 'Telefone' | 'E-mail' | 'WhatsApp';
  bestTime?: 'Manhã' | 'Tarde' | 'Noite' | 'Qualquer horário';
  subject:
    | 'Informações gerais'
    | 'Agendamento de test drive'
    | 'Negociação de preço'
    | 'Financiamento'
    | 'Outro';
  message: string;
  financing: boolean;
  newsletter: boolean;
  termsAccepted: boolean;
  ipAddress: string;
  captchaToken: string;
}

/**
 * @interface ContactEntity
 * @description Represents the created contact entity
 */
export interface ContactEntity {
  idContact: number;
  idAccount: number;
  idCar: number;
  name: string;
  email: string;
  protocol: string;
  status: string;
  dateCreated: Date;
}

/**
 * @interface ContactCarInfo
 * @description Vehicle information associated with the contact
 */
export interface ContactCarInfo {
  idCar: number;
  brand: string;
  model: string;
  year: number;
  price: number;
  image: string;
}

/**
 * @interface ContactCreateResponse
 * @description Response returned after successful contact creation
 */
export interface ContactCreateResponse {
  contact: ContactEntity;
  car: ContactCarInfo;
  estimatedResponseTime: string;
}
