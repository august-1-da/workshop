CREATE TABLE IF NOT EXISTS scores (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	photo TEXT NOT NULL,
	first_name TEXT NOT NULL,
	last_name TEXT NOT NULL,
	final_time TEXT NOT NULL,
	final_time_ms INTEGER NOT NULL,
	stopped_at INTEGER NOT NULL CHECK (stopped_at BETWEEN 1 AND 5),
	created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_scores_leaderboard
	ON scores (final_time_ms ASC, created_at ASC);
