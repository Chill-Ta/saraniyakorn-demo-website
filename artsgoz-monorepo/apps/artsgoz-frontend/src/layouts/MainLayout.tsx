import { Outlet } from 'react-router';
import { Navbar } from '../components/Navbar/index.js';
import { ScrollToTopButton } from '../components/ScrollToTopButton/index.js';

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      {/* Spacer to prevent page content from being pushed under the fixed navbar */}
      <div className="h-[65px] lg:h-[81px] shrink-0" />

      <main className="flex-1">
        <Outlet />
      </main>

      <ScrollToTopButton />
    </div>
  );
}
