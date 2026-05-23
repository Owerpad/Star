export default function GameCard({ game }) {
  const rating = Math.round(game.average_rating)

  return (
    <div className="game-card">
      {game.cover_url ? (
        <img className="game-card-cover" src={game.cover_url} alt={game.title} />
      ) : (
        <div className="game-card-cover" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-elevated)' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: 14 }}>Нет обложки</span>
        </div>
      )}
      <div className="game-card-body">
        <div className="game-card-title">{game.title}</div>
        <div className="game-card-genre">{game.genre || '—'}</div>
        <div className="game-card-rating">
          <span className="stars">
            {[1, 2, 3, 4, 5].map((n) => (
              <span key={n} className={n <= rating ? 'star' : 'star-empty'}>★</span>
            ))}
          </span>
          <span className="rating-badge-value">{game.average_rating.toFixed(1)}</span>
        </div>
      </div>
    </div>
  )
}
