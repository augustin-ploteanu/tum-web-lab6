import { useState } from 'react'
import { SearchBar } from './components/SearchBar'
import { SearchResults } from './components/SearchResults'
import { MyList } from './components/MyList'
import { useSearch } from './hooks/useSearch'
import './App.css'

type View = 'search' | 'list'

function App() {
  const [query, setQuery] = useState('')
  const [view, setView] = useState<View>('search')
  const { results, status, error } = useSearch(query)

  return (
    <>
      <header className="app-header">
        <div className="app-header__inner">
          <button
            className="app-header__logo"
            onClick={() => setView('search')}
            aria-label="Go to search"
          >
            🎬 MyMovieList
          </button>
          <nav className="app-header__nav">
            <button
              className={`nav-btn${view === 'list' ? ' nav-btn--active' : ''}`}
              onClick={() => setView('list')}
              aria-current={view === 'list' ? 'page' : undefined}
            >
              My List
            </button>
          </nav>
        </div>
      </header>

      <main className="app-main">
        {view === 'search' ? (
          <>
            <section className="search-section">
              <h1 className="search-section__title">Find Movies &amp; TV Shows</h1>
              <SearchBar value={query} onChange={setQuery} />
            </section>
            <SearchResults results={results} status={status} error={error} query={query} />
          </>
        ) : (
          <MyList />
        )}
      </main>
    </>
  )
}

export default App
