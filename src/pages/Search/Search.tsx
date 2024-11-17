import "./Search.scss"
import { useAppDispatch, useAppSelector } from "../../state/hooks"
import type { AppDispatch, RootState } from "../../state/store"
import { useState } from "react"
import { searchAsync } from "../../state/search/searchSlice"
import { SearchResult } from "./SearchResult"
import SearchEmpty from "./SearchEmpty"

const Search = () => {
  const { search, bitrate, codec } = useAppSelector((state: RootState) => {
    return {
      search: state.search.objects ?? [],
      bitrate: state.settings.bitrate,
      codec: state.settings.currentCodec.name
    }
  })
  const dispatch = useAppDispatch<AppDispatch>()

  const [keywords, setKeywords] = useState("")
  return (
    <div className="search">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search..."
          onChange={e => setKeywords(e.target.value)}
          onKeyUp={e => e.key === "Enter" && dispatch(searchAsync(keywords))}
        />
        <button onClick={() => dispatch(searchAsync(keywords))}>Search</button>
      </div>
      <div className="search-results">
        {
          search.length < 1 ?
          <SearchEmpty />
          : search.map(result => (
          <SearchResult key={result.ID} object={result} codec={codec} bitrate={bitrate} />)
        )}
      </div>
    </div>
  )
}

export default Search
