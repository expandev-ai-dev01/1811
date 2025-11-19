import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { ErrorBoundary } from '@/core/components/error-boundary';
import { LoadingSpinner } from '@/core/components/loading-spinner';
import { MainLayout } from '@/layouts/MainLayout';

const HomePage = lazy(() =>
  import('@/pages/Home').then((module) => ({ default: module.HomePage }))
);
const CarDetailsPage = lazy(() =>
  import('@/pages/CarDetails').then((module) => ({ default: module.CarDetailsPage }))
);
const NotFoundPage = lazy(() =>
  import('@/pages/NotFound').then((module) => ({ default: module.NotFoundPage }))
);

const routes = createBrowserRouter([
  {
    path: '/',
    element: (
      <ErrorBoundary>
        <MainLayout />
      </ErrorBoundary>
    ),
    children: [
      {
        index: true,
        element: (
          <Suspense
            fallback={
              <div className="flex h-96 items-center justify-center">
                <LoadingSpinner />
              </div>
            }
          >
            <HomePage />
          </Suspense>
        ),
      },
      {
        path: 'car/:id',
        element: (
          <Suspense
            fallback={
              <div className="flex h-96 items-center justify-center">
                <LoadingSpinner />
              </div>
            }
          >
            <CarDetailsPage />
          </Suspense>
        ),
      },
      {
        path: '*',
        element: (
          <Suspense
            fallback={
              <div className="flex h-96 items-center justify-center">
                <LoadingSpinner />
              </div>
            }
          >
            <NotFoundPage />
          </Suspense>
        ),
      },
    ],
  },
]);

export { routes };
