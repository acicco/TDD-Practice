export interface Album {
  id: number;
  artistId?: number;
  title: string;
  listenedAmount?: number;
  songs?: string[];
}
