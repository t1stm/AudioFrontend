// playerReducer.ts
import {
  PLAY,
  PAUSE,
  STOP,
  NEXT,
  PREVIOUS,
  SHUFFLE,
  SET_BUFFERED_PROGRESS,
  SET_CURRENT_PROGRESS,
  PlayerActionTypes,
} from './playerActions';

interface PlayerState {
  isPlaying: boolean;
  currentTrack: number;
  isShuffling: boolean;
  bufferedProgress: number;
  currentProgress: number;
}

const initialState: PlayerState = {
  isPlaying: false,
  currentTrack: 0,
  isShuffling: false,
  bufferedProgress: 0,
  currentProgress: 0,
};

const playerReducer = (
  state = initialState,
  action: PlayerActionTypes
): PlayerState => {
  switch (action.type) {
    case PLAY:
      return { ...state, isPlaying: true };
    case PAUSE:
      return { ...state, isPlaying: false };
    case STOP:
      return { ...state, isPlaying: false, currentTrack: 0 };
    case NEXT:
      return { ...state, currentTrack: state.currentTrack + 1 };
    case PREVIOUS:
      return { ...state, currentTrack: state.currentTrack - 1 };
    case SHUFFLE:
      return { ...state, isShuffling: !state.isShuffling };
    case SET_BUFFERED_PROGRESS:
      return { ...state, bufferedProgress: action.payload };
    case SET_CURRENT_PROGRESS:
      return { ...state, currentProgress: action.payload };
    default:
      return state;
  }
};

export default playerReducer;
