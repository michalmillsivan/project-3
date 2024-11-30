
import './App.css'
import { Routes, Route } from 'react-router-dom'
import VacationsPage from './pages/vacationPage/Vacations'
import Home from './pages/homePage/Home'
import Login from './pages/loginPage/Login'
import Register from './pages/registerPage/Register'
import About from './pages/aboutPage/About'
import Admin from './pages/adminPage/Admin'

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path='/vacations' element={<VacationsPage />} />
        <Route path='/about' element={<About />} />
        <Route path='/admin' element={<Admin />} />
        <Route path='*' element={<div>404 Not Found</div>} />
      </Routes>
    </>
  )
}

export default App
