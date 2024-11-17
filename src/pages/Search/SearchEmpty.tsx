import "./SearchEmpty.scss"
import type React from "react"

const SearchEmpty: React.FC = () => {
  return (
    <div className="search-empty">
      <img alt={"Empty search icon."}/>
      <span>Search results will appear here.</span>
      <span>Go search something.</span>
    </div>
  )
}

export default SearchEmpty