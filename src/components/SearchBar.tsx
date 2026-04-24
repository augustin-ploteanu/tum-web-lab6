import type { ChangeEvent } from 'react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    onChange(e.target.value);
  }

  return (
    <div className="search-bar">
      <svg
        className="search-bar__icon"
        viewBox="0 0 24 24"
        aria-hidden="true"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      >
        <circle cx="11" cy="11" r="6" />
        <line x1="16.5" y1="16.5" x2="22" y2="22" />
      </svg>
      <input
        type="search"
        className="search-bar__input"
        placeholder="Search movies & TV shows…"
        value={value}
        onChange={handleChange}
        aria-label="Search movies and TV shows"
        autoComplete="off"
        spellCheck={false}
      />
    </div>
  );
}
