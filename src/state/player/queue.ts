export interface Queue {
  objects: QueueObject[]
}

export interface QueueObject {
  title: string;
  artist: string;
  totalSeconds: number;
  image: string;
  url: string;
}