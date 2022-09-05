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
  const apiUrl = await axios.get(
    `https://api.rawg.io/api/games?key=${YOUR_API_KEY}`
  );
  const apiInfo = await apiUrl.data.results.map((e) => {
    return {
      image: e.background_image,
      name: e.name,
      genres: e.genres.map((x) => x),
      description: e.description,
      rating: e.rating,
      platforms: e.platforms.map((x) => x),
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
  });
};

const getAllGames = async () => {
  const apiInfo = await getApiInfo();
  const dbInfo = await getDbInfo();
  const infoTotal = apiInfo.concat(dbInfo);
  return infoTotal;
};

router.get("/videogame", async (req, res) => {
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
      res.status(200).send(gameTotal);
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
module.exports = router;
