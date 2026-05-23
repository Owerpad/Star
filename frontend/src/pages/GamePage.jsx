import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api'

function Stars({ rating }) {
  return (
    <span className="stars">
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} className={n <= rating ? 'star' : 'star-empty'}>★</span>
      ))}
    </span>
  )
}

export default function GamePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [game, setGame] = useState(null)
  const [reviews, setReviews] = useState([])
  const [text, setText] = useState('')
  const [rating, setRating] = useState(5)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const token = localStorage.getItem('token')

  useEffect(() => {
    Promise.all([
      api.get(`/games/${id}`),
      api.get(`/reviews/${id}`),
    ]).then(([gameRes, reviewsRes]) => {
      setGame(gameRes.data)
      setReviews(reviewsRes.data)
      setLoading(false)
    })
  }, [id])

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    api.post('/reviews', { game_id: Number(id), text, rating: Number(rating) })
      .then((res) => {
        setReviews([res.data, ...reviews])
        setText('')
        setRating(5)
        return api.get(`/games/${id}`)
      })
      .then((res) => setGame(res.data))
      .catch((err) => setError(err.response?.data?.detail || 'Ошибка при отправке отзыва'))
  }

  const handleDelete = () => {
    if (!confirm('Вы уверены, что хотите удалить эту игру?')) return
    api.delete(`/games/${id}`)
      .then(() => navigate('/'))
      .catch((err) => setError(err.response?.data?.detail || 'Ошибка при удалении'))
  }

  if (loading) return <div className="loading">Загрузка...</div>
  if (!game) return <div className="loading">Игра не найдена</div>

  const screenshots = (() => {
    try { return JSON.parse(game.screenshots || '[]') } catch { return [] }
  })()

  const r = Math.round(game.average_rating)

  return (
    <div>
      <div className="game-detail">
        <div className="game-detail-cover">
          {game.cover_url ? (
            <img src={game.cover_url} alt={game.title} />
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: 180, color: 'var(--text-muted)', fontSize: 14 }}>
              Нет обложки
            </div>
          )}
        </div>
        <div className="game-detail-info">
          <h1>{game.title}</h1>
          <div className="game-detail-meta">
            <div className="game-detail-meta-item">
              <Stars rating={r} />
              <span className="rating-badge-value" style={{ marginLeft: 4 }}>{game.average_rating.toFixed(1)}</span>
            </div>
            {game.genre && <div className="game-detail-meta-item">🎮 {game.genre}</div>}
          </div>
          {game.description && (
            <p className="game-detail-description">{game.description}</p>
          )}
          {token && (
            <button className="btn btn-outline" style={{ marginTop: 16, color: 'var(--danger)', borderColor: 'var(--danger)' }} onClick={handleDelete}>
              Удалить игру
            </button>
          )}
        </div>
      </div>

      {screenshots.length > 0 && (
        <div className="screenshots">
          {screenshots.map((url, i) => (
            <img key={i} src={url} alt={`Скриншот ${i + 1}`} />
          ))}
        </div>
      )}

      <div className="reviews-section">
        <div className="reviews-header">
          <h2>Отзывы <span className="reviews-count">({reviews.length})</span></h2>
        </div>

        {reviews.length === 0 && <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Отзывов пока нет.</p>}

        {reviews.map((r) => (
          <div key={r.id} className="review-card">
            <div className="review-card-header">
              <div className="review-card-avatar">{r.username[0].toUpperCase()}</div>
              <div className="review-card-user">{r.username}</div>
              <div className="review-card-stars">
                <Stars rating={r.rating} />
              </div>
            </div>
            {r.text && <p className="review-card-text">{r.text}</p>}
          </div>
        ))}

        {token && (
          <form className="review-form" onSubmit={handleSubmit}>
            <h3>Написать отзыв</h3>
            {error && <p className="form-error">{error}</p>}
            <textarea
              className="input"
              placeholder="Поделитесь впечатлениями об игре..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              required
            />
            <div className="review-form-actions">
              <label style={{ fontSize: 14, color: 'var(--text-secondary)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 8 }}>
                Оценка:
                <select className="input" style={{ width: 'auto', padding: '6px 10px' }} value={rating} onChange={(e) => setRating(e.target.value)}>
                  {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{'★'.repeat(n)}{'☆'.repeat(5 - n)}</option>)}
                </select>
              </label>
              <button type="submit" className="btn btn-primary">Отправить</button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
