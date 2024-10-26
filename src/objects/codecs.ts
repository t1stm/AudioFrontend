export interface CodecInfo {
  name: string;
  type: string;
  goodBitrate: number;
}

export const Opus: CodecInfo = {
  name: 'Opus',
  type: "audio/ogg; codecs=\"opus\"",
  goodBitrate: 112,
}

export const AAC: CodecInfo = {
  name: 'AAC',
  type: "audio/aac",
  goodBitrate: 192
}

export const Vorbis: CodecInfo = {
  name: 'OGG Vorbis',
  type: 'audio/ogg',
  goodBitrate: 224
}

export const MP3: CodecInfo = {
  name: 'MP3',
  type: 'audio/mp3',
  goodBitrate: 256
}

export const FLAC: CodecInfo = {
  name: 'FLAC',
  type: 'audio/flac',
  goodBitrate: 1411
}

export type Codec =
  | typeof Opus
  | typeof AAC
  | typeof Vorbis
  | typeof MP3
  | typeof FLAC