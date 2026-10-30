import { BrowserRouter, Route, Routes } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import { DemoModeProvider } from '@/context/DemoModeContext';
import { RoutesProvider } from '@/context/RoutesContext';
import { SimulationProvider } from '@/context/SimulationContext';
import { TripProvider } from '@/context/TripContext';
import { AuthProvider } from '@/context/AuthContext';
import { Home } from './pages/Home';
import { Tracking } from './pages/Tracking';
import { Driver } from './pages/Driver';
import { LostFound } from './pages/LostFound';
import { Assistant } from './pages/Assistant';
import { About } from './pages/About';
import { NotFound } from './pages/NotFound';
import { PassengerLogin } from './pages/PassengerLogin';
import { PassengerSignup } from './pages/PassengerSignup';
import { PassengerDashboard } from './pages/PassengerDashboard';
import { DriverLogin } from './pages/DriverLogin';
import { RequirePassenger, RequireDriver } from './components/ProtectedRoute';
import { TripStatusOverlay } from './components/TripStatusOverlay';

export default function App() {
  return (
    <AuthProvider>
      <DemoModeProvider>
        <RoutesProvider>
          <SimulationProvider>
            <TripProvider>
              <BrowserRouter>
                <TripStatusOverlay />
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/tracking/:busId" element={<Tracking />} />
                  <Route path="/lost-found" element={<LostFound />} />
                  <Route path="/assistant" element={<Assistant />} />
                  <Route path="/about" element={<About />} />

                  <Route path="/passenger/login" element={<PassengerLogin />} />
                  <Route path="/passenger/signup" element={<PassengerSignup />} />
                  <Route path="/passenger/dashboard" element={<RequirePassenger><PassengerDashboard /></RequirePassenger>} />

                  <Route path="/driver/login" element={<DriverLogin />} />
                  <Route path="/driver" element={<RequireDriver><Driver /></RequireDriver>} />

                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </TripProvider>
          </SimulationProvider>
        </RoutesProvider>
      </DemoModeProvider>
    </AuthProvider>
  );
}
