require("dotenv").config();
const { Router } = require("express");
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');
const axios = require("axios");
// const Videogame = require('../models/Videogame');
// const Genres = require('../models/Genres');
const { Videogame, Genres } = require("../db");
const { YOUR_API_KEY } = process.env;

const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);

const getApiInfo = async () => {
  const apiUrl = await axios.get(`https://api.rawg.io/api/games?key=${YOUR_API_KEY}`);
  const apiInfo = await apiUrl.data.results.map((e) => {
    return {
      image: e.background_image,
      name: e.name,
      genres: e.genres.map((x) => x.name),
      description: e.description,
      releasedDate: e.released,
      rating: e.rating,
      platforms: e.platforms.map((x) => x.platform.name),
      id: e.id,
    };
  });
  return apiInfo;
};

const getDbInfo = async () => {
    return await Videogame.findAll({
      include: {
        model: Genres,
        attributes: ["name"],
        through: {
          attributes: [],
        },
      },
    },
  );
}


const getAllGames = async () => {
  const apiInfo = await getApiInfo();
  const dbInfo = await getDbInfo();
  const infoTotal = apiInfo.concat(dbInfo);
  return infoTotal;
};

router.get("/videogame/:id", async (req, res) =>{
  const id = req.params.id
  const videogameTotal = await getAllGames()
  if(id){
    let videogameId = await videogameTotal.filter( e => e.id == id)
    videogameId.length ?
    res.status(200).json(videogameId) :
    res.status(404).send(`No se encontro un juego asignado al id: ${id}`)
  }
})

router.get("/videogames", async (req, res) => {
  try {
    const name = req.query.name;
    let gameTotal = await getAllGames();
    if (name) {
      let gameName = await gameTotal.filter((e) =>
        e.name.toLowerCase().includes(name.toLowerCase())
      );
      if (gameName.length) {
        if (gameName.length > 15) {
          gameName.slice(0, 14);
          res.status(200).json(gameName);
        }
        res.status(200).json(gameName);
      }
      res.status(404).send(`No hay nada sobre ${name}`);
    } else {
      res.status(200).json(gameTotal);
    }    
  } catch (error) {
    res.status(404).json(error)
  }
});

router.get("/genres", async (req, res) => {
  //no funciona
  try {
    let genresFinal = [];
    const genresApi = await axios.get(
      `https://api.rawg.io/api/games?key=${YOUR_API_KEY}`
    );
    const genres = genresApi.data.results.map((e) =>
      e.genres.map((x) => x.name)
    );
    //console.log(genres, "genres")
    const genresEach = genres.flat();
    //console.log(genresEach, "genreich")
    genresEach.forEach(async (e) => {
      if (genresFinal.includes(e)) {
        return;
      } else {
        genresFinal.push(e);
      }
    });
    console.log(genresFinal);
    genresFinal.forEach(async (el) => {
      await Genres.findOrCreate({
        where: { name: el },
        defaults: { name: el },
      });
    });
    //console.log(genresEach, "esto es genreEach")
    const allGenres = await Genres.findAll();
    res.json(allGenres);
  } catch (error) {
    res.status(404).json(error);
    console.log(error);
  }
});

router.post("/videogame", async (req, res, next)=>{
  let {
    name, 
    description,
    released,
    image,
    rating,
    genres,
    platforms
  } = req.body
  console.log(req.body)
try {
  let videogameCreated = await Videogame.create({  
    name, 
    description,
    released,
    image: image ? image  : "https://es.123rf.com/photo_94358880_bocadillo-de-di%C3%A1logo-c%C3%B3mico-retro-con-error-de-p%C3%A1gina-de-internet-404-en-estilo-pop-art-globo-de-c%C3%B3mic-de-vect.html",
    rating,
    platforms,
    createdInDb: true,
  })
  let genreDb = await Genres.findAll({
    where: { name: genres }
  })
  videogameCreated.addGenre(genreDb);
  res.send("Videojuego creado correctamente")
} catch (error) {
  next(error)
}
})

module.exports = router;