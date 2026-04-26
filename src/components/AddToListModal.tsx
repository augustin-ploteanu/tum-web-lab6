import { useState, useEffect, useRef } from 'react';
import { IMAGE_BASE_URL, getTVDetails } from '../api/tmdb';
import { CATEGORY_LABELS } from '../types';
import type { EntryCategory, ListEntry, WatchableItem } from '../types';

const ENTRY_CATEGORIES = (
  Object.keys(CATEGORY_LABELS) as (keyof typeof CATEGORY_LABELS)[]
).filter((c): c is EntryCategory => c !== 'all');

interface AddToListModalProps {
  item: WatchableItem;
  existingEntry: ListEntry | null;
  onSave: (entry: ListEntry) => void;
  onClose: () => void;
}

export function AddToListModal({
  item,
  existingEntry,
  onSave,
  onClose,
}: AddToListModalProps) {
  const [category, setCategory] = useState<EntryCategory>(
    existingEntry?.category ?? 'plan_to_watch'
  );
  const [grade, setGrade] = useState<string>(
    existingEntry?.grade != null ? String(existingEntry.grade) : ''
  );
  const [note, setNote] = useState(existingEntry?.note ?? '');
  // null = "all" (auto-set when Completed); stored as string in the input
  const [episodes, setEpisodes] = useState<string>(() => {
    if (item.media_type === 'movie') return '1';
    const e = existingEntry?.episodesWatched;
    return e != null ? String(e) : '';
  });
  const [totalEpisodes, setTotalEpisodes] = useState<number | null>(
    existingEntry?.totalEpisodes ?? null
  );

  const overlayRef = useRef<HTMLDivElement>(null);

  // Fetch total episode count for TV shows
  useEffect(() => {
    if (item.media_type !== 'tv' || totalEpisodes !== null) return;
    getTVDetails(item.id)
      .then((d) => setTotalEpisodes(d.number_of_episodes))
      .catch(() => { /* non-fatal, just won't show total */ });
  }, [item.id, item.media_type, totalEpisodes]);

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  // Prevent body scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  // When switching to Completed for TV, prefill totalEpisodes if episodes is empty
  useEffect(() => {
    if (item.media_type !== 'tv') return;
    if (category === 'completed' && episodes === '' && totalEpisodes !== null) {
      setEpisodes(String(totalEpisodes));
    }
  }, [category, item.media_type, totalEpisodes]);

  function handleOverlayClick(e: React.MouseEvent) {
    if (e.target === overlayRef.current) onClose();
  }

  function handleEpisodesChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value;
    if (raw === '') { setEpisodes(''); return; }
    let num = Math.max(0, parseInt(raw, 10));
    if (totalEpisodes !== null) num = Math.min(num, totalEpisodes);
    setEpisodes(isNaN(num) ? '' : String(num));
  }

  function handleGradeChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value;
    if (raw === '') { setGrade(''); return; }
    const num = Math.min(10, Math.max(1, parseInt(raw, 10)));
    setGrade(isNaN(num) ? '' : String(num));
  }

  function handleSave() {
    const parsedGrade = grade === '' ? null : parseInt(grade, 10);

    let episodesWatched: number | null;
    if (item.media_type === 'movie') {
      episodesWatched = category === 'completed' ? 1 : 0;
    } else {
      episodesWatched = episodes === '' ? null : parseInt(episodes, 10);
    }

    const entry: ListEntry = {
      id: `${item.media_type}-${item.id}`,
      item,
      category,
      grade: parsedGrade,
      note: note.trim(),
      episodesWatched,
      totalEpisodes: item.media_type === 'movie' ? 1 : totalEpisodes,
      addedAt: existingEntry?.addedAt ?? Date.now(),
    };
    onSave(entry);
    onClose();
  }

  const title = item.title ?? item.name ?? 'Unknown';
  const year = (item.release_date ?? item.first_air_date ?? '').slice(0, 4);
  const posterUrl = item.poster_path
    ? `${IMAGE_BASE_URL}${item.poster_path}`
    : null;

  return (
    <div
      className="modal-overlay"
      ref={overlayRef}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-label={`Add ${title} to list`}
    >
      <div className="modal">
        {/* Header */}
        <div className="modal__header">
          {posterUrl && (
            <img className="modal__poster" src={posterUrl} alt="" />
          )}
          <div className="modal__meta">
            <h2 className="modal__title">{title}</h2>
            <p className="modal__subtitle">
              {[year, item.media_type === 'movie' ? 'Movie' : 'TV Show']
                .filter(Boolean)
                .join(' · ')}
            </p>
          </div>
          <button
            className="modal__close"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="modal__body">
          <fieldset className="modal__fieldset">
            <legend className="modal__label">Category</legend>
            <div className="modal__categories">
              {ENTRY_CATEGORIES.map((cat) => (
                <label
                  key={cat}
                  className={`modal__cat-option${category === cat ? ' modal__cat-option--active' : ''}`}
                >
                  <input
                    type="radio"
                    name="modal-category"
                    value={cat}
                    checked={category === cat}
                    onChange={() => setCategory(cat)}
                  />
                  {CATEGORY_LABELS[cat]}
                </label>
              ))}
            </div>
          </fieldset>

          <div className="modal__field">
            <label className="modal__label" htmlFor="modal-grade">
              Grade{' '}
              <span className="modal__label-hint">(1–10)</span>
            </label>
            <input
              id="modal-grade"
              type="number"
              className="modal__input"
              min={1}
              max={10}
              placeholder="—"
              value={grade}
              onChange={handleGradeChange}
            />
          </div>

          {item.media_type === 'tv' && (
            <div className="modal__field">
              <label className="modal__label" htmlFor="modal-episodes">
                Episodes watched{' '}
                <span className="modal__label-hint">
                  {category === 'completed'}
                </span>
              </label>
              <div className="modal__episodes-row">
                <input
                  id="modal-episodes"
                  type="number"
                  className="modal__input"
                  min={0}
                  max={totalEpisodes ?? undefined}
                  placeholder="0"
                  value={episodes}
                  onChange={handleEpisodesChange}
                />
                {totalEpisodes !== null && (
                  <span className="modal__episodes-total">
                    / {totalEpisodes}
                  </span>
                )}
              </div>
            </div>
          )}

          <div className="modal__field">
            <label className="modal__label" htmlFor="modal-note">
              Note{' '}
            </label>
            <textarea
              id="modal-note"
              className="modal__textarea"
              placeholder="Your thoughts…"
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="modal__footer">
          <button
            className="modal__btn modal__btn--cancel"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="modal__btn modal__btn--save"
            onClick={handleSave}
          >
            {existingEntry ? 'Update' : 'Add to List'}
          </button>
        </div>
      </div>
    </div>
  );
}
