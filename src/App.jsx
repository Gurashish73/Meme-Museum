import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Login from './pages/Login';
import Museum from './pages/Museum'; 
import Void from './pages/Void';
import Cursor from './components/Cursor'; // <-- Import the cursor!
import Heaven from './pages/Heaven';

function App() {
  return (
    <Router>
      {/* The cursor sits outside the Routes so it never unmounts */}
      <Cursor /> 
      
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/museum" element={<Museum />} />
          <Route path="/void" element={<Void />} />
          <Route path="/heaven" element={<Heaven />} />
        </Routes>
      </AnimatePresence>
    </Router>
  );
}

export default App;