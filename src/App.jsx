import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Register from './pages/Register'
import Workers from './pages/Workers'
import WorkerProfile from './pages/WorkerProfile'
import ServiceRequest from './pages/ServiceRequest'
import AcceptRequest from './pages/AcceptRequest'
import Rate from './pages/Rate'
import Admin from './pages/Admin'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/registrar" element={<Register />} />
      <Route path="/trabajadores" element={<Workers />} />
      <Route path="/trabajador/:id" element={<WorkerProfile />} />
      <Route path="/solicitar/:id" element={<ServiceRequest />} />
      <Route path="/calificar/:id" element={<Rate />} />
      <Route path="/aceptar/:id" element={<AcceptRequest />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="*" element={
        <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-6 text-center">
          <span className="material-icons text-6xl text-gray-300">error_outline</span>
          <h1 className="text-xl font-bold text-gray-700">Página no encontrada</h1>
          <a href="/" className="btn-primary max-w-xs">Volver al inicio</a>
        </div>
      } />
    </Routes>
  )
}
