import { useState } from 'react'
import { SearchBar } from './components/SearchBar'
import { SearchResults } from './components/SearchResults'
import { useSearch } from './hooks/useSearch'
import './App.css'

function App() {
  const [query, setQuery] = useState('')
  const { results, status, error } = useSearch(query)

  return (
    <>
      <header className="app-header">
        <div className="app-header__inner">
          <span className="app-header__logo" aria-label="MyMovieList">
            🎬 MyMovieList
          </span>
        </div>
      </header>

      <main className="app-main">
        <section className="search-section">
          <h1 className="search-section__title">Find Movies &amp; TV Shows</h1>
          <SearchBar value={query} onChange={setQuery} />
        </section>
        <SearchResults results={results} status={status} error={error} query={query} />
      </main>
    </>
  )
}

export default App
