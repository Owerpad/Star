import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'

export default function AddGame() {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [genre, setGenre] = useState('')
  const [coverUrl, setCoverUrl] = useState('')
  const [screenshots, setScreenshots] = useState('')
  const [rawgQuery, setRawgQuery] = useState('')
  const [error, setError] = useState('')

  const handleRawgSearch = async () => {
    if (!rawgQuery) return
    setError('')
    try {
      const res = await api.get('/games/rawg/search', { params: { query: rawgQuery } })
      const data = res.data
      setTitle(data.title)
      setDescription(data.description)
      setGenre(data.genre)
      setCoverUrl(data.cover_url)
      setScreenshots(data.screenshots)
    } catch (err) {
      setError(err.response?.data?.detail || 'Ошибка поиска на RAWG')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const res = await api.post('/games', { title, description, genre, cover_url: coverUrl, screenshots })
      navigate(`/games/${res.data.id}`)
    } catch (err) {
      setError(err.response?.data?.detail || 'Ошибка при добавлении игры')
    }
  }

  return (
    <div className="form-page-wide">
      <div className="page-header">
        <h1 className="page-title">Добавить игру</h1>
        <p className="page-subtitle">Пополните каталог новой игрой</p>
      </div>

      <div className="rawg-box">
        <div className="rawg-box-title">Быстрый импорт из RAWG</div>
        <div className="rawg-row">
          <input
            className="input"
            placeholder="Название игры на RAWG..."
            value={rawgQuery}
            onChange={(e) => setRawgQuery(e.target.value)}
          />
          <button type="button" className="btn btn-outline" onClick={handleRawgSearch}>Импорт</button>
        </div>
      </div>

      {error && <p className="form-error">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Название *</label>
          <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div className="form-group">
          <label className="form-label">Описание</label>
          <textarea className="input" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Жанр</label>
          <input className="input" value={genre} onChange={(e) => setGenre(e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Ссылка на обложку</label>
          <input className="input" value={coverUrl} onChange={(e) => setCoverUrl(e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Скриншоты (JSON-массив ссылок)</label>
          <textarea className="input" value={screenshots} onChange={(e) => setScreenshots(e.target.value)} style={{ minHeight: 60 }} />
        </div>
        <button type="submit" className="btn btn-primary">Добавить</button>
      </form>
    </div>
  )
}
