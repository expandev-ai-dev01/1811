import { Outlet } from 'react-router-dom';

export const MainLayout = () => {
  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      <main className="flex-1">
        <div className="container relative mx-auto max-w-screen-2xl px-4 py-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
