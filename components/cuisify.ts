import { User } from "../interfaces/user";
import { Album } from "../interfaces/album";

export default class Cuisify {
  users: User[] = [];
  albums: Album[] = [];

  addUser(user: User): void {
    if (!user) throw new Error("No se paso ningun usuario");
    this.users.push(user);
  }

  getUsers(userType?: string): User[] {
    if (!userType) return this.users;
    if (userType === "artist") {
      return this.users.filter(user => user.userType === "artist");
    }

    if (userType === "music_lover") {
      return this.users.filter(user => user.userType === "music_lover");
    }
  }

  getAmountOfUsers(): number {
    return this.users.length;
  }

  addAlbum(album: Album, user: User) {
    if (!album) throw new Error("No se paso ningun album");
    if (!user) throw new Error("No se paso un usuario");
    if (user.userType !== "artist")
      throw new Error("El usuario no es un artista");

    album.artistId = user.id;
    this.albums.push(album);
    return this.albums;
  }

  listenToAlbum(album: Album, user: User) {
    if (!album) throw new Error("No se paso ningun album");
    if (!user) throw new Error("No se paso un usuario");
    if (user.userType === "music_lover") {
      if (!user.listenedAlbums) {
        user.listenedAlbums = [];
      }
      album.listenedAmount = +1;
      user.listenedAlbums.push(album.id);
      this.agregarRegalias(album.artistId);
    }
    if (user.userType === "artist") {
      if (!user.listenedAlbums) {
        user.listenedAlbums = [];
      }
      album.listenedAmount = +1;
      user.listenedAlbums.push(album.id);
      this.agregarReputation(album.artistId);
    }
  }

  agregarRegalias(userId: number) {
    const album = this.albums.find(album => album.artistId === userId);
    if (album.listenedAmount === 1) {
      this.users.find(user => user.id === userId).royalties = +10;
    }
  }

  agregarReputation(userId: number) {
    this.users.find(user => user.id === userId).reputation = +10;
  }

  findArtistWithMoreThanFivePointsOfReputation(): User | User[] {
    if (this.users.length === 0) {
      throw new Error("No se encontro ningun artista");
    }
    const artists = this.users.filter(user => user.reputation > 5);
    if (artists.length === 1) {
      return artists.find(user => user.reputation > 5);
    } else {
      return artists;
    }
  }

  findArtistWithMoreThanHundredRoyalties(): User | User[] {
    const artists = this.users.filter(user => user.royalties > 100);
    if (artists.length === 0) {
      throw new Error("No se encontro ningun artista");
    }
    if (artists.length === 1) {
      return artists.find(user => user.royalties > 100);
    } else {
      return artists;
    }
  }

  findApatheticUsers() {
    const apatheticUsers = this.users.filter(
      user => user.listenedAlbums.length === 0
    );
    if (apatheticUsers.length === 0) {
      throw new Error("No se encontraron usuarios apaticos");
    }
    if (apatheticUsers.length === 1) {
      return apatheticUsers.find(user => user.listenedAlbums.length === 0);
    } else {
      return apatheticUsers;
    }
  }

  getAverageAlbumSongsforAllUsers(): number {
    const averageSongs = this.albums.reduce(
      (songAmount: any, album) => songAmount.songs.length + album.songs.length
    );

    return +averageSongs / this.albums.length;
  }
}
