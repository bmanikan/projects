import { useState } from 'react';
import SearchPage from './components/SearchPage';
import CarDashboard from './components/CarDashboard';

export default function App() {
  const [selectedCar, setSelectedCar] = useState<string | null>(null);

  return selectedCar ? (
    <CarDashboard carId={selectedCar} onBack={() => setSelectedCar(null)} />
  ) : (
    <SearchPage onSelect={setSelectedCar} />
  );
}
