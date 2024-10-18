import "./Search.scss";
import { useAppDispatch, useAppSelector } from "../../state/hooks"
import type { AppDispatch, RootState } from "../../state/store"
import React, { useState } from "react"
import { SearchObject } from "../../state/search/searchObject"
import { searchAsync } from "../../state/search/searchSlice"
import { addToQueueAsync } from "../../state/player/playerSlice"
import { convertTimeSpanStringToSeconds } from "./searchUtils"

const downloadEndpoint = "http://localhost:5226/Audio/Download";
let codec = "Opus";
let bitrate = "192";

const Search = () => {
  const search = useAppSelector((state: RootState) => state.search.objects);
  const dispatch = useAppDispatch<AppDispatch>();

  const [keywords, setKeywords] = useState("");
  return (
    <div className="search">
      <div className="search-bar">
        <input type="text" placeholder="Keywords..."
               onChange={(e) => setKeywords(e.target.value)} />
        <button onClick={() => dispatch(searchAsync(keywords))}>Search</button>
      </div>
      <div className="search-results">
        {search.map(result => SearchResult(result))}
      </div>
    </div>
  );
}

interface PlatformInfo {
  identifier: string;
  prettyName: string;
  color: string | null;
}

function getPlatformNameFromIdentifier(id: string): PlatformInfo {
  const split = id.split(":");
  const identifier = split[0];

  let prettyName = "Unknown";
  let color: string | null = null;
  switch (identifier) {
    case "yt":
      prettyName = "YouTube";
      color = "red";
      break;

    case "file":
      prettyName = "Local";
      color = "blue";
      break;

    case "spotify":
      prettyName = "Spotify";
      color = "green";
      break;
  }

  return {
    identifier: identifier,
    prettyName: prettyName,
    color: color
  }
}

const SearchResult: React.FC<SearchObject> =
  ({ ID, Name, Artist, Duration, ThumbnailUrl }) => {
  const dispatch = useAppDispatch<AppDispatch>();
  const info = getPlatformNameFromIdentifier(ID);

  return (
    <div className="search-result">
      <div className="platform-blip" style={{
        background: info.color ?? ""
      }}>{info.prettyName}</div>
      <img src={ThumbnailUrl ?? ""} alt="Thumbnail" />
      <div className="result-names">
        <span className="result-title">{Name}</span>
        <span className="result-artist">{Artist}</span>
      </div>

      <span className="result-duration">{Duration}</span>
      <button onClick={() => dispatch(addToQueueAsync(
        {
          title: Name ?? "",
          artist: Artist ?? "",
          totalSeconds: convertTimeSpanStringToSeconds(Duration),
          image: ThumbnailUrl ?? "",
          url: `${downloadEndpoint}/${codec}/${bitrate}?id=${encodeURI(ID)}`
        }
      ))}>Add to Queue</button>
    </div>
  );
  }

export default Search;