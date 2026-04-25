import { useState } from 'react';
import { CATEGORY_LABELS } from '../types';
import type { Category } from '../types';

const CATEGORIES = Object.keys(CATEGORY_LABELS) as Category[];

export function MyList() {
  const [activeCategory, setActiveCategory] = useState<Category>('all');

  return (
    <div className="mylist">
      <h1 className="mylist__title">My List</h1>

      <div className="mylist__tabs" role="tablist" aria-label="Filter by category">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            role="tab"
            aria-selected={activeCategory === cat}
            className={`mylist__tab${activeCategory === cat ? ' mylist__tab--active' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>

      <div className="mylist__content" role="tabpanel">
        <div className="mylist__empty">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z" />
          </svg>
          <p>
            {activeCategory === 'all'
              ? 'Your list is empty. Search for movies or TV shows to add them.'
              : `No entries in "${CATEGORY_LABELS[activeCategory]}" yet.`}
          </p>
        </div>
      </div>
    </div>
  );
}
