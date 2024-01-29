// interface Rating {
//     Source: string;
//     Value: string;
// }
export type Movie = {
    imdbID: string;
    Title: string;
    Year: string;
    Poster: string;
    Runtime: string;
    imdbRating: string;
    Released: string;
    Genre: string;
    Plot: string;
    Actors: string;
    Director: string;
};
export type WatchedMovie = Pick<
    Movie,
    'imdbID' | 'Title' | 'Year' | 'Poster'
> & {
    imdbRating: number;
    userRating: number;
    runtime: number;
    countRatingDecision: number;
};
