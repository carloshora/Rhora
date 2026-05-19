import React, { useState } from 'react';
import HomePage from './pages/HomePage.jsx';
import CreatePage from './pages/CreatePage.jsx';

export default function App() {
  const [page, setPage] = useState('home');

  if (page === 'create') {
    return <CreatePage onBack={() => setPage('home')} />;
  }
  return <HomePage onStart={() => setPage('create')} />;
}
