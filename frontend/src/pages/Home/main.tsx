import { Button } from '@/core/components/button';

export const HomePage = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-6 py-12">
      <h1 className="text-4xl font-bold tracking-tight text-gray-900">
        Welcome to Catálogo de Carros
      </h1>
      <p className="max-w-2xl text-center text-lg text-gray-600">
        Find your dream car from our extensive collection of premium vehicles.
      </p>
      <div className="flex gap-4">
        <Button size="lg">Browse Cars</Button>
        <Button variant="outline" size="lg">
          Contact Us
        </Button>
      </div>
    </div>
  );
};
