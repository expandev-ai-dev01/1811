import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { CheckCircle2, AlertCircle } from 'lucide-react';

import { Button } from '@/core/components/button';
import { Input } from '@/core/components/input';
import { Label } from '@/core/components/label';
import { Select } from '@/core/components/select';
import { carService } from '../../services/carService';
import { contactSchema } from '../../validations/contact';
import type { ContactFormData } from '../../types';

interface CarContactFormProps {
  carId: string;
  carTitle: string;
}

export const CarContactForm = ({ carId, carTitle }: CarContactFormProps) => {
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      idCar: carId,
      subject: 'Informações gerais',
      contactPreference: 'WhatsApp',
      bestTime: 'Qualquer horário',
      financing: false,
      newsletter: false,
      termsAccepted: false,
      captchaToken: 'mock-token',
    },
    mode: 'onBlur',
  });

  const subject = watch('subject');

  // Business Rule: If subject is 'Financiamento', set financing to true
  useEffect(() => {
    if (subject === 'Financiamento') {
      setValue('financing', true);
    }
  }, [subject, setValue]);

  const { mutate, isPending, isError } = useMutation({
    mutationFn: carService.sendContact,
    onSuccess: () => {
      setIsSuccess(true);
      reset();
    },
  });

  const onSubmit = (data: ContactFormData) => {
    mutate(data);
  };

  if (isSuccess) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center space-y-4">
        <div className="flex justify-center">
          <CheckCircle2 className="h-12 w-12 text-green-600" />
        </div>
        <h3 className="text-xl font-bold text-green-900">Mensagem enviada!</h3>
        <p className="text-green-700">
          Recebemos seu interesse no <strong>{carTitle}</strong>. Nossa equipe entrará em contato em
          breve.
        </p>
        <Button variant="outline" onClick={() => setIsSuccess(false)} className="mt-4">
          Enviar nova mensagem
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-card border rounded-lg p-6 shadow-sm">
      <h3 className="text-xl font-bold mb-4">Tenho Interesse</h3>
      <p className="text-muted-foreground mb-6 text-sm">
        Preencha o formulário abaixo para receber mais informações sobre este veículo.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input type="hidden" {...register('idCar')} value={carId} />
        <input type="hidden" {...register('captchaToken')} />
        {/* Hidden financing field, controlled by logic but also submittable */}
        <input type="hidden" {...register('financing')} />

        <div className="space-y-2">
          <Label htmlFor="name">Nome Completo *</Label>
          <Input id="name" {...register('name')} placeholder="Seu nome e sobrenome" />
          {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="email">E-mail *</Label>
            <Input id="email" type="email" {...register('email')} placeholder="seu@email.com" />
            {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Telefone *</Label>
            <Input id="phone" {...register('phone')} placeholder="(00) 00000-0000" />
            {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="contactPreference">Preferência de Contato *</Label>
            <Select id="contactPreference" {...register('contactPreference')}>
              <option value="WhatsApp">WhatsApp</option>
              <option value="Telefone">Telefone</option>
              <option value="E-mail">E-mail</option>
            </Select>
            {errors.contactPreference && (
              <p className="text-xs text-destructive">{errors.contactPreference.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="bestTime">Melhor Horário</Label>
            <Select id="bestTime" {...register('bestTime')}>
              <option value="Qualquer horário">Qualquer horário</option>
              <option value="Manhã">Manhã</option>
              <option value="Tarde">Tarde</option>
              <option value="Noite">Noite</option>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="subject">Assunto *</Label>
          <Select id="subject" {...register('subject')}>
            <option value="Informações gerais">Informações gerais</option>
            <option value="Agendamento de test drive">Agendamento de test drive</option>
            <option value="Negociação de preço">Negociação de preço</option>
            <option value="Financiamento">Financiamento</option>
            <option value="Outro">Outro</option>
          </Select>
          {errors.subject && <p className="text-xs text-destructive">{errors.subject.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="message">Mensagem *</Label>
          <textarea
            id="message"
            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            {...register('message')}
            placeholder="Olá, gostaria de mais informações sobre este veículo..."
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Mínimo 10 caracteres</span>
            <span>{watch('message')?.length || 0}/1000</span>
          </div>
          {errors.message && <p className="text-xs text-destructive">{errors.message.message}</p>}
        </div>

        <div className="space-y-4 pt-2">
          <div className="flex items-start space-x-2">
            <input
              type="checkbox"
              id="termsAccepted"
              className="mt-1 h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-600"
              {...register('termsAccepted')}
            />
            <div className="grid gap-1.5 leading-none">
              <label
                htmlFor="termsAccepted"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Concordo com os{' '}
                <a href="#" className="text-primary-600 hover:underline">
                  termos de privacidade
                </a>{' '}
                *
              </label>
              {errors.termsAccepted && (
                <p className="text-xs text-destructive">{errors.termsAccepted.message}</p>
              )}
            </div>
          </div>

          <div className="flex items-start space-x-2">
            <input
              type="checkbox"
              id="newsletter"
              className="mt-1 h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-600"
              {...register('newsletter')}
            />
            <label
              htmlFor="newsletter"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Quero receber novidades e ofertas por e-mail
            </label>
          </div>
        </div>

        {isError && (
          <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 p-3 rounded-md">
            <AlertCircle className="h-4 w-4" />
            <span>Erro ao enviar formulário. Verifique os dados e tente novamente.</span>
          </div>
        )}

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? 'Enviando...' : 'Enviar Mensagem'}
        </Button>
      </form>
    </div>
  );
};
