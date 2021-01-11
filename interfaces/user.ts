export interface User {
  id: number;
  name: string;
  age: number;
  userType: string;
  listenedAlbums?: number[];
  royalties?: number;
  reputation?: number;
}
