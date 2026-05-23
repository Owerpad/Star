import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../api'
import GameCard from '../components/GameCard'

export default function Home() {
  const [games, setGames] = useState([])
  const [search, setSearch] = useState('')
  const [genre, setGenre] = useState('')
  const [minRating, setMinRating] = useState('')
  const [sort, setSort] = useState('')
  const [loading, setLoading] = useState(true)

  const fetchGames = () => {
    setLoading(true)
    const params = {}
    if (search) params.search = search
    if (genre) params.genre = genre
    if (minRating) params.min_rating = minRating
    if (sort) params.sort = sort
    api.get('/games', { params }).then((res) => {
      setGames(res.data)
      setLoading(false)
    })
  }

  useEffect(() => {
    fetchGames()
  }, [])

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <span style={{ fontSize: 40, lineHeight: 1 }}>⭐</span>
        <div>
          <h1 className="page-title">Звёздочка</h1>
          <p className="page-subtitle">Ищете, оценивайте и обсуждайте видеоигры</p>
        </div>
      </div>

      <div className="filter-bar">
        <input
          className="input filter-search"
          placeholder="Поиск по названию..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <input
          className="input filter-short"
          placeholder="Жанр"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
        />
        <input
          className="input filter-short"
          placeholder="Мин. рейтинг"
          type="number"
          min="0"
          max="5"
          step="0.1"
          value={minRating}
          onChange={(e) => setMinRating(e.target.value)}
        />
        <select className="input filter-short" value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="">Сортировка</option>
          <option value="rating">По рейтингу</option>
          <option value="title">По названию</option>
        </select>
        <button className="btn btn-primary" onClick={fetchGames}>Найти</button>
      </div>

      {loading ? (
        <div className="loading">Загрузка...</div>
      ) : games.length === 0 ? (
        <div className="empty-state">
          <p>Игр пока нет</p>
          <Link to="/add"><button className="btn btn-primary">Добавить игру</button></Link>
        </div>
      ) : (
        <div className="games-grid">
          {games.map((game) => (
            <Link key={game.id} to={`/games/${game.id}`}>
              <GameCard game={game} />
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
