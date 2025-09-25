import { Outlet, createRootRoute, redirect } from '@tanstack/react-router';
// import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { AuthService } from '@/services/authService';

const RootComponent = () => {
  return (
    <>
      <Outlet />
      {/* {import.meta.env.DEV && <TanStackRouterDevtools />} */}
    </>
  );
};

export const Route = createRootRoute({
  component: RootComponent,
  beforeLoad: ({ location }) => {
    // Redirect to login if not authenticated and trying to access protected routes
    const isAuthenticated = AuthService.isAuthenticated();
    const isAuthRoute = location.pathname.startsWith('/login') || 
                       location.pathname.startsWith('/register') ||
                       location.pathname === '/';

    if (!isAuthenticated && !isAuthRoute) {
      throw redirect({
        to: '/login',
        search: {
          redirect: location.href,
        },
      });
    }

    // Redirect to dashboard if authenticated and trying to access auth routes
    if (isAuthenticated && (location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/')) {
      throw redirect({
        to: '/dashboard',
      });
    }
  },
});