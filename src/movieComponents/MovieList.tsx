import { Movie } from '../typesAndConstants/types';
import MovieItem from './MovieItem';

export default function MovieList({
    movies,
    onSelectMovie,
}: {
    movies: Movie[];
    onSelectMovie(s: string): void;
}) {
    return (
        <ul className="list list-movies">
            {movies?.map((movie) => (
                <MovieItem
                    onSelectMovie={onSelectMovie}
                    movie={movie}
                    key={movie.imdbID}
                />
            ))}
        </ul>
    );
}
