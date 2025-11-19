import { Button } from '@/core/components/button';
import { useNavigation } from '@/core/hooks/useNavigation';

export const NotFoundPage = () => {
  const { goHome } = useNavigation();

  return (
    <div className="flex h-[50vh] flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-muted-foreground">Página não encontrada</p>
      <Button onClick={goHome}>Voltar para o início</Button>
    </div>
  );
};
