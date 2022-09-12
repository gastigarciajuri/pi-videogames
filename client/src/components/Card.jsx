import React from "react";

export default function GameCard({ name, image, genres, rating }) {
    return (
        <div>
            <h2>{name}</h2>
            <h4>{genres.join(", ")}</h4>
            {console.log("GENEROS", genres)}
            <img src= {image} alt="img not found" width="400px" height="250px" />
            <h4>⭐ {rating}</h4>
        </div>
    )
}

// export default function GameCard({ name, image, genres, rating }) {
//     return (
//         <div className="card">
//             <div>
//                 <img src= {image} alt={name} className="image-card" width="200px" height="150px" />
//             <h3 className="rating-card">{rating}</h3>
//             </div>
//             <div className="texto-card">
//                 <h2 className="name-card">{name}<br/></h2>

//                 <h3 className="genre-card">{genres.join(", ")}</h3>
//             </div>
//         </div>
//     )
// }









