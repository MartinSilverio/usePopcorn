import { Movie } from '../typesAndConstants/types';

export default function MovieItem({
    movie,
    onSelectMovie,
}: {
    movie: Movie;
    onSelectMovie(s: string): void;
}) {
    return (
        <li onClick={() => onSelectMovie(movie.imdbID)}>
            <img src={movie.Poster} alt={`${movie.Title} poster`} />
            <h3>{movie.Title}</h3>
            <div>
                <p>
                    <span>🗓</span>
                    <span>{movie.Year}</span>
                </p>
            </div>
        </li>
    );
}
