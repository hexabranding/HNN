import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* Additional pages will be added here step by step with user approval */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
