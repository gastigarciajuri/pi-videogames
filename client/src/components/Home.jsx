import React from "react";
import {  useEffect  } from "react"; //useState
import { useDispatch, useSelector } from "react-redux";
import { getGames, getGenres } from "../actions";
import { Link } from "react-router-dom";
import { Fragment } from "react";
import Card from  './Card';
//import Paginado from "./Paginado";



export default function Home() {
   const dispatch = useDispatch();
   const allGames = useSelector((state) => state.games);
  // const [currentPage, setCurrentPage] = useState(1);
   //const [gamesPerPage, serCharacterPerPage] = useState(15);
   //const indexLastGame = currentPage * gamesPerPage;
   //const indexFirstGame = indexLastGame - gamesPerPage;
  // const currentGames = allGames.slice(indexFirstGame, indexLastGame);


/* const paginado = (pageNumbers) => {
      setCurrentPage(pageNumbers)
   }*/

   useEffect(() => {
      dispatch(getGames());
   }, [dispatch]);

   //let generos = getGenres.map((e) => e.name)
   //console.log("GENEROOOOOOOS",generos)
   const allGenres = useSelector((state) => state.genres)
   console.log("ALLGENRES", allGenres)
   useEffect(() => {
      dispatch(getGenres())
   }, [dispatch])

   function handleClick(e) {
      e.preventDefault();
      dispatch(getGames());
   } 

   return (
   <div>
      <Link to="/videogame">Crear juego</Link>
      <h1>VIDEOGAMES</h1>
      <button onClick={(e) => { handleClick(e); }}>
      Volver a cargar juegos
      </button>
      <div>
         <select>
            <option value= 'asc'> ⬆️ -- ⬇️ </option>
            <option value= 'desc'> ⬇️ -- ⬆️ </option>
         </select>
         <select>
            <option value='All'>Todos los generos</option>
            <option value='Puzzle'>Puzzle</option>
            <option value='Action'>Action</option>
            <option value='Adventure'>Adventure</option>
            <option value='RPG'>RPG</option>
            <option value='Shooter'>Shooter</option>
            <option value='Indie'>Indie</option>
            <option value='Platformer'>Platformer</option>
            <option value='Massively Multiplayer'>Massively Multiplayer</option>
         </select>        
         {/* <Paginado
         gamesPerPage={gamesPerPage}
         allGames={allGames.length}
         paginado={paginado}
         /> */}
         
         {allGames?.map((e) => {
         return (
            <Fragment>
               <Link to={"/home/" + e.id }>
               <Card name={e.name} image={e.image} genres={e.genres} key={e.id} rating={e.rating}/>
               </Link>
            </Fragment>
         );
      })}

      </div>
   </div>
   );
}
