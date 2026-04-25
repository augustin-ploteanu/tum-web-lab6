import { CATEGORY_LABELS } from '../types';
import type { EntryCategory, ListEntry } from '../types';

const ENTRY_CATEGORIES = (
  Object.keys(CATEGORY_LABELS) as (keyof typeof CATEGORY_LABELS)[]
).filter((c): c is EntryCategory => c !== 'all');

interface StatsPanelProps {
  entries: ListEntry[];
}

interface CategoryStats {
  count: number;
  totalEpisodes: number;
  gradedCount: number;
  gradeSum: number;
}

function computeStats(entries: ListEntry[]): Record<EntryCategory, CategoryStats> {
  const init = (): CategoryStats => ({
    count: 0,
    totalEpisodes: 0,
    gradedCount: 0,
    gradeSum: 0,
  });

  const map: Record<EntryCategory, CategoryStats> = {
    completed: init(),
    watching: init(),
    plan_to_watch: init(),
    dropped: init(),
  };

  for (const entry of entries) {
    const s = map[entry.category];
    s.count++;

    // Episode count
    if (entry.item.media_type === 'movie') {
      s.totalEpisodes += 1;
    } else if (entry.episodesWatched === null && entry.totalEpisodes !== null) {
      // completed — all episodes watched
      s.totalEpisodes += entry.totalEpisodes;
    } else if (entry.episodesWatched !== null) {
      s.totalEpisodes += entry.episodesWatched;
    }

    // Grade
    if (entry.grade !== null) {
      s.gradedCount++;
      s.gradeSum += entry.grade;
    }
  }

  return map;
}

export function StatsPanel({ entries }: StatsPanelProps) {
  if (entries.length === 0) {
    return (
      <div className="stats">
        <p className="stats__empty">No entries yet — add something to see stats.</p>
      </div>
    );
  }

  const stats = computeStats(entries);

  // Overall totals
  const totalEps = Object.values(stats).reduce((s, c) => s + c.totalEpisodes, 0);
  const totalGraded = Object.values(stats).reduce((s, c) => s + c.gradedCount, 0);
  const totalGradeSum = Object.values(stats).reduce((s, c) => s + c.gradeSum, 0);
  const overallAvg = totalGraded > 0 ? (totalGradeSum / totalGraded).toFixed(1) : null;

  return (
    <div className="stats">
      {/* Overall summary row */}
      <div className="stats__overview">
        <div className="stats__overview-item">
          <span className="stats__overview-value">{entries.length}</span>
          <span className="stats__overview-label">Total entries</span>
        </div>
        <div className="stats__overview-item">
          <span className="stats__overview-value">{totalEps}</span>
          <span className="stats__overview-label">Episodes watched</span>
        </div>
        <div className="stats__overview-item">
          <span className="stats__overview-value">
            {overallAvg !== null ? overallAvg : '—'}
          </span>
          <span className="stats__overview-label">Average rating</span>
        </div>
      </div>

      {/* Per-category breakdown */}
      <table className="stats__table" aria-label="Stats by category">
        <thead>
          <tr>
            <th>Category</th>
            <th>Entries</th>
            <th>Episodes watched</th>
            <th>Average rating</th>
          </tr>
        </thead>
        <tbody>
          {ENTRY_CATEGORIES.map((cat) => {
            const s = stats[cat];
            const avg =
              s.gradedCount > 0
                ? (s.gradeSum / s.gradedCount).toFixed(1)
                : null;
            return (
              <tr key={cat}>
                <td>
                  <span className="stats__cat-label">{CATEGORY_LABELS[cat]}</span>
                </td>
                <td>{s.count}</td>
                <td>{s.totalEpisodes}</td>
                <td>{avg !== null ? avg : '—'}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
