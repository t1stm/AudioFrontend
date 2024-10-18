import "./Search.scss"
import { useAppDispatch, useAppSelector } from "../../state/hooks"
import type { AppDispatch, RootState } from "../../state/store"
import { useState } from "react"
import { searchAsync } from "../../state/search/searchSlice"
import { SearchResult } from "./SearchResult"

const Search = () => {
  const { search } = useAppSelector((state: RootState) => {
    return {
      search: state.search.objects
    }
  });
  const dispatch = useAppDispatch<AppDispatch>()

  const [keywords, setKeywords] = useState("")
  return (
    <div className="search">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search..."
          onChange={e => setKeywords(e.target.value)}
        />
        <button onClick={() => dispatch(searchAsync(keywords))}>Search</button>
      </div>
      <div className="search-results">
        {search.map(result => SearchResult(result))}
      </div>
    </div>
  )
}

export default Search