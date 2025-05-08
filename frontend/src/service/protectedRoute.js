import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token'); // ve se o token existe(ta amarzenado)

  if (!token) {
    return <Navigate to="/login" />; // se n tiver, volta pro login
  }

  return children; // renderizar a pagina
}

export default ProtectedRoute;