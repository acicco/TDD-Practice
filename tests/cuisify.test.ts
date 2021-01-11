import Cuisify from "../components/cuisify";
import { User } from "../interfaces/user";
import { Album } from "../interfaces/album";

describe("Usuarios", function() {
  it("No se pasa ningun usuario", function() {
    const cuisify: Cuisify = new Cuisify();
    expect(() => cuisify.addUser(undefined)).toThrow(
      "No se paso ningun usuario"
    );
  });

  it("Se agrega un usuario", function() {
    const cuisify: Cuisify = new Cuisify();
    const user: User = {
      id: 1,
      name: "Alan",
      age: 26,
      userType: "artist"
    };
    cuisify.addUser(user);
    expect(cuisify.getAmountOfUsers()).toEqual(1);
  });
});

describe("Album", function() {
  describe("Agregar un album", function() {
    it("No se pasa un album", function() {
      const cuisify: Cuisify = new Cuisify();

      const user: User = {
        id: 1,
        name: "Alan",
        age: 26,
        userType: "artist"
      };

      expect(() => cuisify.addAlbum(undefined, user)).toThrow(
        "No se paso ningun album"
      );
    });

    it("No se pasa un usuario", function() {
      const cuisify: Cuisify = new Cuisify();
      const album: Album = {
        id: 1,
        title: "Soy un album"
      };
      expect(() => cuisify.addAlbum(album, undefined)).toThrow(
        "No se paso un usuario"
      );
    });

    it("El usuario que se pasa no es un artista, no se agrega un album", function() {
      const cuisify: Cuisify = new Cuisify();
      const album: Album = {
        id: 1,
        title: "Soy un album"
      };

      const user: User = {
        id: 2,
        name: "Miguel",
        age: 25,
        userType: "music_lover"
      };
      expect(() => cuisify.addAlbum(album, user)).toThrow(
        "El usuario no es un artista"
      );
    });

    it("El usuario es un artista, se agrega un album", function() {
      const cuisify: Cuisify = new Cuisify();
      const album: Album = {
        id: 1,
        title: "Soy un album"
      };

      const user: User = {
        id: 1,
        name: "Alan",
        age: 26,
        userType: "artist"
      };

      expect(cuisify.addAlbum(album, user)).toEqual([
        { id: 1, artistId: 1, title: "Soy un album" }
      ]);
    });
  });
  describe("Escuchar un album", function() {
    it("No se pasa un album", function() {
      const cuisify: Cuisify = new Cuisify();

      const user: User = {
        id: 2,
        name: "Miguel",
        age: 25,
        userType: "music_lover"
      };

      expect(() => cuisify.listenToAlbum(undefined, user)).toThrow(
        "No se paso ningun album"
      );
    });

    it("El usuario es un melomano, se escucha un album, se asignan royalties a artista", function() {
      const cuisify: Cuisify = new Cuisify();
      const album: Album = {
        id: 1,
        artistId: 1,
        title: "Soy un album"
      };

      const musicLover: User = {
        id: 2,
        name: "Miguel",
        age: 25,
        userType: "music_lover"
      };

      const artist: User = {
        id: 1,
        name: "Alan",
        age: 26,
        userType: "artist"
      };

      cuisify.addUser(artist);
      cuisify.addUser(musicLover);
      cuisify.addAlbum(album, artist);
      cuisify.listenToAlbum(album, musicLover);

      const users = cuisify.getUsers();
      const melomano = users.find(user => user.id === musicLover.id);
      const artista = users.find(user => user.id === artist.id);

      expect(melomano.listenedAlbums.length).toBe(1);
      expect(artista.royalties).toBe(10);
    });

    it("El usuario es un artista, se escucha un album, se asignan reputacion a artista", function() {
      const cuisify: Cuisify = new Cuisify();
      const album: Album = {
        id: 1,
        artistId: 1,
        title: "Soy un album"
      };

      const artist: User = {
        id: 1,
        name: "Alan",
        age: 26,
        userType: "artist"
      };

      cuisify.addUser(artist);
      cuisify.addAlbum(album, artist);
      cuisify.listenToAlbum(album, artist);

      const users = cuisify.getUsers();
      const artista = users.find(user => user.id === artist.id);

      expect(artista.listenedAlbums.length).toBe(1);
      expect(artista.reputation).toBe(10);
    });
  });
  describe("Busqueda de usuarios", function() {
    it("No se encuentra ningun usuario que tenga mas de 5 de reputacion", function() {
      const cuisify: Cuisify = new Cuisify();

      expect(() =>
        cuisify.findArtistWithMoreThanFivePointsOfReputation()
      ).toThrow("No se encontro ningun artista");
    });

    it("Se encuentra un usuario que tenga mas de 5 de reputacion", function() {
      const cuisify: Cuisify = new Cuisify();
      const artist: User = {
        id: 1,
        name: "Alan",
        age: 26,
        userType: "artist",
        reputation: 10
      };

      cuisify.addUser(artist);
      expect(cuisify.findArtistWithMoreThanFivePointsOfReputation()).toEqual(
        artist
      );
    });

    it("Cuando hay mas de un usuario, y uno solo tiene mas de 5 de reputacion, se devuelve el artista", function() {
      const cuisify: Cuisify = new Cuisify();
      const artist: User = {
        id: 1,
        name: "Alan",
        age: 26,
        userType: "artist",
        reputation: 10
      };

      cuisify.addUser({
        id: 2,
        name: "Alan",
        age: 26,
        userType: "artist",
        reputation: 0
      });
      cuisify.addUser(artist);

      expect(cuisify.findArtistWithMoreThanFivePointsOfReputation()).toEqual(
        artist
      );
    });

    it("Cuando hay mas de un usuario, y mas de uno tiene mas de 5 de reputacion, se devuelven los artistas", function() {
      const cuisify: Cuisify = new Cuisify();
      const artist: User = {
        id: 1,
        name: "Alan",
        age: 26,
        userType: "artist",
        reputation: 10
      };
      const artist2 = {
        id: 3,
        name: "Pete",
        age: 27,
        userType: "artist",
        reputation: 6
      };

      cuisify.addUser(artist);
      cuisify.addUser(artist2);
      cuisify.addUser({
        id: 2,
        name: "Alan",
        age: 26,
        userType: "artist",
        reputation: 0
      });

      expect(cuisify.findArtistWithMoreThanFivePointsOfReputation()).toEqual([
        artist,
        artist2
      ]);
    });

    it("Si no se encuentra un artista con mas de 100 pesos de regalias", function() {
      const cuisify: Cuisify = new Cuisify();
      expect(() => cuisify.findArtistWithMoreThanHundredRoyalties()).toThrow(
        "No se encontro ningun artista"
      );
    });

    it("Si un artista tiene mas de 100 pesos de regalias, se devuelve el artista", function() {
      const cuisify: Cuisify = new Cuisify();
      const artist: User = {
        id: 1,
        name: "Alan",
        age: 26,
        userType: "artist",
        royalties: 110
      };
      cuisify.addUser(artist);
      expect(cuisify.findArtistWithMoreThanHundredRoyalties()).toEqual(artist);
    });

    it("Si hay varios artistas, y uno tiene mas 100 pesos de regalias, se devuelve el artista", function() {
      const cuisify: Cuisify = new Cuisify();
      const artist: User = {
        id: 1,
        name: "Alan",
        age: 26,
        userType: "artist",
        royalties: 110
      };
      cuisify.addUser({
        id: 2,
        name: "Pete",
        age: 26,
        userType: "artist",
        royalties: 20
      });
      cuisify.addUser(artist);
      expect(cuisify.findArtistWithMoreThanHundredRoyalties()).toEqual(artist);
    });

    it("Si hay varios artistas que tienen mas 100 pesos de regalias, se devuelven los artistas", function() {
      const cuisify: Cuisify = new Cuisify();
      const artist: User = {
        id: 1,
        name: "Alan",
        age: 26,
        userType: "artist",
        royalties: 110
      };
      cuisify.addUser({
        id: 2,
        name: "Pete",
        age: 26,
        userType: "artist",
        royalties: 20
      });
      const artist2 = {
        id: 2,
        name: "Pete",
        age: 26,
        userType: "artist",
        royalties: 120
      };
      cuisify.addUser(artist);
      cuisify.addUser(artist2);
      expect(cuisify.findArtistWithMoreThanHundredRoyalties()).toEqual([
        artist,
        artist2
      ]);
    });

    it("Si no hay apatico, se lanza una excepcion", function() {
      const cuisify = new Cuisify();
      expect(() => cuisify.findApatheticUsers()).toThrow(
        "No se encontraron usuarios apaticos"
      );
    });

    it("Si hay un usuario apatico, se devuelve el artista", function() {
      const cuisify: Cuisify = new Cuisify();
      const artist: User = {
        id: 1,
        name: "Alan",
        age: 26,
        userType: "artist",
        listenedAlbums: []
      };
      cuisify.addUser(artist);
      expect(cuisify.findApatheticUsers()).toEqual(artist);
    });

    it("Si hay varios usuarios, pero solo uno es apatico, se devuelve el artista", function() {
      const cuisify: Cuisify = new Cuisify();
      const artist: User = {
        id: 1,
        name: "Alan",
        age: 26,
        userType: "artist",
        royalties: 110,
        listenedAlbums: []
      };
      cuisify.addUser({
        id: 2,
        name: "Pete",
        age: 26,
        userType: "artist",
        royalties: 20,
        listenedAlbums: [1, 2]
      });
      cuisify.addUser(artist);
      expect(cuisify.findArtistWithMoreThanHundredRoyalties()).toEqual(artist);
    });

    it("Si hay varios artistas apaticos, se devuelven los artistas", function() {
      const cuisify: Cuisify = new Cuisify();
      const artist: User = {
        id: 1,
        name: "Alan",
        age: 26,
        userType: "artist",
        royalties: 110,
        listenedAlbums: []
      };
      cuisify.addUser({
        id: 2,
        name: "Pete",
        age: 26,
        userType: "artist",
        royalties: 20,
        listenedAlbums: []
      });
      const artist2 = {
        id: 2,
        name: "Pete",
        age: 26,
        userType: "artist",
        royalties: 120
      };
      cuisify.addUser(artist);
      cuisify.addUser(artist2);
      expect(cuisify.findArtistWithMoreThanHundredRoyalties()).toEqual([
        artist,
        artist2
      ]);
    });
    it("Se obtiene el promedio de canciones de album por artista", function() {
      const cuisify = new Cuisify();
      cuisify.addAlbum(
        {
          id: 1,
          title: "Soy un album",
          songs: [
            "Soy una cancion",
            "Soy una cancion",
            "Soy una cancion",
            "Soy una cancion",
            "Soy una cancion",
            "Soy una cancion",
            "Soy una cancion",
            "Soy una cancion",
            "Soy una cancion"
          ]
        },
        {
          id: 2,
          name: "Pete",
          age: 26,
          userType: "artist",
          royalties: 120
        }
      );

      cuisify.addAlbum(
        {
          id: 2,
          title: "Soy un album 2",
          songs: [
            "Soy una cancion",
            "Soy una cancion",
            "Soy una cancion",
            "Soy una cancion",
            "Soy una cancion"
          ]
        },
        {
          id: 1,
          name: "Alan",
          age: 26,
          userType: "artist",
          royalties: 50
        }
      );
      expect(cuisify.getAverageAlbumSongsforAllUsers()).toBe(7);
    });
  });
});
