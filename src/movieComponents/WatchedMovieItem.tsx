import { WatchedMovie } from '../typesAndConstants/types';

export default function WatchedMovieItem({
    movie,
    onDeleteWatched,
}: {
    movie: WatchedMovie;
    onDeleteWatched(s: string): void;
}) {
    return (
        <li>
            <img src={movie.Poster} alt={`${movie.Title} poster`} />
            <h3>{movie.Title}</h3>
            <div>
                <p>
                    <span>⭐️</span>
                    <span>{movie.imdbRating}</span>
                </p>
                <p>
                    <span>🌟</span>
                    <span>{movie.userRating}</span>
                </p>
                <p>
                    <span>⏳</span>
                    <span>{movie.runtime} min</span>
                </p>
                <button
                    className="btn-delete"
                    onClick={() => onDeleteWatched(movie.imdbID)}
                >
                    X
                </button>
            </div>
        </li>
    );
}
