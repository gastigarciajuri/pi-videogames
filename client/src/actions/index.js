import axios from 'axios';


export const getGames = () => {
    return async function(dispatch){
            return await axios.get('http://localhost:3001/videogames')
            .then(response =>{
                dispatch ({
                    type: 'GET_GAMES',
                    payload: response.data
                })               
            })
        }
}

export const getGenres = () => {
    return async function(dispatch){
            return await axios.get('http://localhost:3001/genres')
            .then(response =>{
                dispatch ({
                    type: 'GET_GENRES',
                    payload: response.data
                })               
            })
    }
}

export function filterGamesByGenres(payload){
    return {
        type: 'FILTER_BY_GENRE',
        payload
    }
}


