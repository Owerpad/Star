import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import Home from './pages/Home'
import GamePage from './pages/GamePage'
import AddGame from './pages/AddGame'
import Login from './pages/Login'
import Register from './pages/Register'

export default function App() {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const username = token ? JSON.parse(atob(token.split('.')[1])).sub : null

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/')
  }

  return (
    <div className="app">
      <nav className="navbar">
        <div className="container navbar-inner">
          <Link to="/" className="navbar-logo">Звёздочка</Link>
          <div className="navbar-links">
            <Link to="/" className="navbar-link">Каталог</Link>
            <Link to="/add" className="navbar-link">Добавить игру</Link>
          </div>
          <div className="navbar-right">
            {token ? (
              <>
                <span className="navbar-username">{username}</span>
                <button className="btn btn-ghost btn-sm" onClick={handleLogout}>Выйти</button>
              </>
            ) : (
              <>
                <Link to="/login"><button className="btn btn-ghost btn-sm">Войти</button></Link>
                <Link to="/register"><button className="btn btn-primary btn-sm">Регистрация</button></Link>
              </>
            )}
          </div>
        </div>
      </nav>
      <main className="container" style={{ paddingTop: 28, paddingBottom: 60 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/games/:id" element={<GamePage />} />
          <Route path="/add" element={<AddGame />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>
    </div>
  )
}
