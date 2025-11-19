export interface VideoType {
  id: number;
  title: string;
  url: string;
}

export interface VideoRating {
  videoUrl: string;
  rating: number;
}

export interface VideoBounds {
  left: number;
  top: number;
  bottom: number;
  right: number;
}
