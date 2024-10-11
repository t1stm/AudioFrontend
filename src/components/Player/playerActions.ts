export const PLAY = 'PLAY';
export const PAUSE = 'PAUSE';
export const STOP = 'STOP';
export const NEXT = 'NEXT';
export const PREVIOUS = 'PREVIOUS';
export const SHUFFLE = 'SHUFFLE';
export const SET_BUFFERED_PROGRESS = 'SET_BUFFERED_PROGRESS';
export const SET_CURRENT_PROGRESS = 'SET_CURRENT_PROGRESS';

export interface PlayAction {
  type: typeof PLAY;
}

export interface PauseAction {
  type: typeof PAUSE;
}

export interface StopAction {
  type: typeof STOP;
}

export interface NextAction {
  type: typeof NEXT;
}

export interface PreviousAction {
  type: typeof PREVIOUS;
}

export interface ShuffleAction {
  type: typeof SHUFFLE;
}

export interface SetBufferedProgressAction {
  type: typeof SET_BUFFERED_PROGRESS;
  payload: number;
}

export interface SetCurrentProgressAction {
  type: typeof SET_CURRENT_PROGRESS;
  payload: number;
}

// Union type for all actions
export type PlayerActionTypes =
  | PlayAction
  | PauseAction
  | StopAction
  | NextAction
  | PreviousAction
  | ShuffleAction
  | SetBufferedProgressAction
  | SetCurrentProgressAction;
