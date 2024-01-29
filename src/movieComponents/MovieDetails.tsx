import { useEffect, useRef, useState } from 'react';
import StarRating from './StarRating';
import { Movie, WatchedMovie } from '../typesAndConstants/types';
import { KEY } from '../typesAndConstants/constants';
import Loader from '../widgets/Loader';
import ErrorMessage from '../widgets/ErrorMessage';
import { useKey } from '../hooks/useKey';

export default function MovieDetails({
    selectedId,
    watchedMovies,
    onCloseMovie,
    onAddWatched,
}: {
    selectedId: string;
    watchedMovies: WatchedMovie[];
    onCloseMovie(): void;
    onAddWatched(m: WatchedMovie): void;
}) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [movie, setMovie] = useState<Movie | null>(null);
    const [userRating, setUserRating] = useState<number>(0);

    //Don't want to trigger re-render, since it is not data that will be rendered
    const countRef = useRef(0);

    useEffect(
        function () {
            (async () => {
                try {
                    setError('');
                    setIsLoading(true);
                    const resp = await fetch(
                        `http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`
                    );

                    if (!resp.ok)
                        throw new Error(
                            'Something went wrong with catching movies'
                        );
                    const data = await resp.json();

                    if (data.Response === 'False')
                        throw new Error('Movie not found');

                    console.log(data);
                    setMovie(data);
                } catch (err) {
                    if (typeof err === 'string') {
                        console.error(err);
                        setError(err);
                    } else if (err instanceof Error) {
                        console.error(err.message);
                        setError(err.message);
                    }
                } finally {
                    setIsLoading(false);
                }
            })();
        },
        [selectedId]
    );

    useEffect(
        function () {
            if (movie?.Title) {
                document.title = `Movie | ${movie.Title}`;
            }
            return () => {
                document.title = 'usePopcorn';
            };
        },
        [movie]
    );

    useKey('Escape', onCloseMovie);

    useEffect(
        function () {
            if (userRating) countRef.current++;
        },
        [userRating]
    );

    function handleAddWatched() {
        if (movie !== null) {
            const newWatchedMovie: WatchedMovie = {
                imdbID: selectedId,
                Title: movie.Title,
                Year: movie.Year,
                Poster: movie.Poster,
                imdbRating: Number(movie.imdbRating),
                userRating,
                runtime: Number(movie.Runtime.split(' ').at(0)),
                countRatingDecision: countRef.current,
            };
            onAddWatched(newWatchedMovie);
            onCloseMovie();
        }
    }

    function handleSetRating(rating: number) {
        setUserRating(rating);
    }

    const watchedMovie = watchedMovies.find((movie) => {
        return selectedId === movie.imdbID;
    });

    return (
        <div className="details">
            {error && <ErrorMessage message={error} />}
            {isLoading ? (
                <Loader />
            ) : (
                <>
                    <header>
                        <button className="btn-back" onClick={onCloseMovie}>
                            {'<'}
                        </button>
                        <img
                            src={movie?.Poster}
                            alt={`Poster of ${movie?.Title}`}
                        />
                        <div className="details-overview">
                            <h2>{movie?.Title}</h2>
                            <p>
                                {movie?.Released} &bull; {movie?.Runtime}
                            </p>
                            <p>{movie?.Genre}</p>
                            <p>
                                <span>⭐</span>
                                {movie?.imdbRating} IMDb rating
                            </p>
                        </div>
                    </header>
                    <section>
                        <div className="rating">
                            {watchedMovie ? (
                                <p>
                                    You rated this movies{' '}
                                    {watchedMovie.userRating}⭐
                                </p>
                            ) : (
                                <>
                                    <StarRating
                                        maxRating={10}
                                        size={24}
                                        onSetRating={handleSetRating}
                                    />
                                    {!!userRating && (
                                        <button
                                            className="btn-add"
                                            onClick={handleAddWatched}
                                        >
                                            + Add to list
                                        </button>
                                    )}
                                </>
                            )}
                        </div>
                        <p>
                            <em>{movie?.Plot}</em>
                        </p>
                        <p>Starring {movie?.Actors}</p>
                        <p>Directed by {movie?.Director}</p>
                    </section>
                </>
            )}
        </div>
    );
}
