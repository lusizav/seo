import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { BulkSniper } from './pages/BulkSniper';
import { CreativeMixer } from './pages/CreativeMixer';
import { Portfolio } from './pages/Portfolio';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/bulk" element={<BulkSniper />} />
        <Route path="/mixer" element={<CreativeMixer />} />
        <Route path="/portfolio" element={<Portfolio />} />
      </Routes>
    </Router>
  );
}

export default App;
