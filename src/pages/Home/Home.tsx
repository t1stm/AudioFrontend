import "./Home.scss";
import { useAppDispatch } from "../../state/hooks"
import type { AppDispatch } from "../../state/store"
import { useState } from "react"
import { addToQueueAsync } from "../../state/player/playerSlice"

const Home = () => {
  const dispatch = useAppDispatch<AppDispatch>();

  const [url, setUrl] = useState("http://localhost:5226/Audio/Download/Opus/192?id=yt://U3v-gVNFJSU");
  const [cover, setCover] = useState("https://i.ytimg.com/vi/U3v-gVNFJSU/hq720.jpg");
  const [title, setTitle] = useState("Мамино Анче");
  const [artist, setArtist] = useState("Влади Марков");
  const [seconds, setSeconds] = useState(394);

  return (
    <div className="home">
      <input type="url" placeholder="Url" onChange={(e) => setUrl(e.target.value)} value={url}/>
      <input type="text" placeholder="Title" onChange={(e) => setTitle(e.target.value)} value={title}/>
      <input type="text" placeholder="Artist" onChange={(e) => setArtist(e.target.value)} value={artist}/>
      <input type="url" placeholder="Cover URL" onChange={(e) => setCover(e.target.value)} value={cover}/>
      <input type="number" placeholder="Seconds" onChange={(e) => setSeconds(Number.parseFloat(e.target.value))} value={seconds}/>

      <button onClick={() => {
        dispatch(addToQueueAsync({
          title: title,
          artist: artist,
          url: url,
          image: cover,
          totalSeconds: seconds
        }))
      }}>Add</button>
    </div>
  );
}

export default Home;