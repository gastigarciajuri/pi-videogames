
const initialState = {
    games: [],
    genres: []
}

function rootReducer (state = initialState, action){
    switch (action.type) {
        case "GET_GAMES": {
            return {
                ...state,
                games: action.payload
            }
        }     
        case "GET_GENRES": {
            return {
                ...state,
                genres: action.payload
            }
        } 
        default:
            return {
                ...state
            }
    }
}

export default rootReducer;