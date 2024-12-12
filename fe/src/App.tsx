
import './App.css'
import { Routes, Route } from 'react-router-dom'
import VacationsPage from './pages/vacationPage/Vacations'
import Login from './pages/loginPage/Login'
import Register from './pages/registerPage/Register'
import About from './pages/aboutPage/About'
import Admin from './pages/adminPage/Admin'
import Add from './pages/addPage/Add'
import Edit from './pages/edditPage/Eddit'
import Reports from './pages/reportsPage/Reports'
import HomePage from './pages/homePage/Home'

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path='/vacations' element={<VacationsPage />} />
        <Route path='/add-vacation' element={<Add />} />
        <Route path='/about' element={<About />} />
        <Route path='/admin' element={<Admin />} />
        <Route path='/reports' element={<Reports />} />
        <Route path='/edit-vacation/:id' element={<Edit />} />
        <Route path='*' element={<div>404 Not Found</div>} />
      </Routes>
    </>
  )
}

export default App
