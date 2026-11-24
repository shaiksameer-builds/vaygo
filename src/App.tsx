import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AppProvider, useAuth } from './context/AppContext';
import ErrorBoundary from './components/common/ErrorBoundary';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// Renter
import RenterLayout from './layouts/RenterLayout';
import RenterDashboardPage from './pages/renter/RenterDashboardPage';
import RenterSearchPage from './pages/renter/RenterSearchPage';
import RenterBookingsPage from './pages/renter/RenterBookingsPage';
import RenterProfilePage from './pages/renter/RenterProfilePage';

// Host
import HostLayout from './layouts/HostLayout';
import HostDashboardPage from './pages/host/HostDashboardPage';
import HostVehiclesPage from './pages/host/HostVehiclesPage';
import HostAddVehiclePage from './pages/host/HostAddVehiclePage';
import HostRequestsPage from './pages/host/HostRequestsPage';
import HostBookingsPage from './pages/host/HostBookingsPage';
import HostEarningsPage from './pages/host/HostEarningsPage';
import HostProfilePage from './pages/host/HostProfilePage';

// Not Found
import NotFoundPage from './pages/public/NotFoundPage';

/** Redirect unauthenticated users to login. */
function RequireAuth({ role }: { role?: 'renter' | 'host' }) {
  const { currentUser } = useAuth();
  if (!currentUser) return <Navigate to="/login" replace />;
  if (role && currentUser.role !== role) {
    return <Navigate to={currentUser.role === 'host' ? '/host/dashboard' : '/renter/dashboard'} replace />;
  }
  return <Outlet />;
}

/** Redirect already-logged-in users away from auth pages. */
function RedirectIfAuth() {
  const { currentUser } = useAuth();
  if (currentUser) {
    return <Navigate to={currentUser.role === 'host' ? '/host/dashboard' : '/renter/dashboard'} replace />;
  }
  return <Outlet />;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Root → redirect based on auth status */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Auth routes — redirect if already logged in */}
      <Route element={<RedirectIfAuth />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Renter routes */}
      <Route element={<RequireAuth role="renter" />}>
        <Route element={<RenterLayout />}>
          <Route path="/renter/dashboard" element={<RenterDashboardPage />} />
          <Route path="/renter/search" element={<RenterSearchPage />} />
          <Route path="/renter/bookings" element={<RenterBookingsPage />} />
          <Route path="/renter/profile" element={<RenterProfilePage />} />
        </Route>
      </Route>

      {/* Host routes */}
      <Route element={<RequireAuth role="host" />}>
        <Route element={<HostLayout />}>
          <Route path="/host/dashboard" element={<HostDashboardPage />} />
          <Route path="/host/vehicles" element={<HostVehiclesPage />} />
          <Route path="/host/vehicles/add" element={<HostAddVehiclePage />} />
          <Route path="/host/vehicles/edit/:vehicleId" element={<HostAddVehiclePage />} />
          <Route path="/host/requests" element={<HostRequestsPage />} />
          <Route path="/host/bookings" element={<HostBookingsPage />} />
          <Route path="/host/earnings" element={<HostEarningsPage />} />
          <Route path="/host/profile" element={<HostProfilePage />} />
        </Route>
      </Route>

      {/* Legacy route redirects */}
      <Route path="/home" element={<Navigate to="/renter/dashboard" replace />} />
      <Route path="/owner" element={<Navigate to="/host/dashboard" replace />} />

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AppProvider>
          <AppRoutes />
        </AppProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
