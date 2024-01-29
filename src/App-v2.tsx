import { useEffect, useState } from 'react';
import { Movie, WatchedMovie } from './typesAndConstants/types';
import { KEY } from './typesAndConstants/constants';
import Loader from './widgets/Loader';
import ErrorMessage from './widgets/ErrorMessage';
import NavBar from './header/NavBar';
import Search from './header/Search';
import NumResults from './header/NumResults';
import MainLayout from './layout/MainLayout';
import WatchedSummary from './movieComponents/WatchedSummary';
import Box from './layout/Box';
import MovieList from './movieComponents/MovieList';
import MovieDetails from './movieComponents/MovieDetails';
import WatchedMovieList from './movieComponents/WatchedMovieList';

export default function App() {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [watched, setWatched] = useState<WatchedMovie[]>([]);
    const [selectedId, setSelectedId] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [query, setQuery] = useState('');

    /* Bad - causes infinite re-render, don't include sid-effects in render logic
    fetch(`http://www.omdbapi.com/?apikey=${KEY}&s=avengers`)
        .then((resp) => {
            return resp.json();
        })
        .then((data) => {
            console.log(data);
            setMovies(data.Search);
        });

    setWatched([])
    */

    //Effects render after browser paint, therefore prints C A B
    /*
    useEffect(function () {
        console.log('After initial render');
    }, []);
    useEffect(function () {
        console.log('After every render');
    });

    useEffect(
        function () {
            console.log('D');
        },
        [query]
    );

    console.log('During render');
    */

    //Function for use-effect can't by async, so we gotta do that inside it
    useEffect(
        function () {
            const controller = new AbortController();

            async function makeQuery() {
                if (query.length < 3) {
                    setMovies([]);
                    setError('');
                    return;
                }

                try {
                    setError('');
                    setIsLoading(true);
                    const resp = await fetch(
                        `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
                        { signal: controller.signal }
                    );

                    if (!resp.ok)
                        throw new Error(
                            'Something went wrong with catching movies'
                        );
                    const data = await resp.json();

                    if (data.Response === 'False')
                        throw new Error('Movie not found');

                    console.log(data);
                    setMovies(data.Search);
                    // console.log(movies); //Most likely show [] because setting state is async (Stale)
                    //Note strict mode calls things twice, which is why console logs are doubled
                } catch (err) {
                    console.log(err);
                    if (typeof err === 'string') {
                        console.error(err);
                        setError(err);
                    } else if (err instanceof Error) {
                        console.error(err.message);
                        if (err.name !== 'AbortError') {
                            setError(err.message);
                        }
                    }
                } finally {
                    setIsLoading(false);
                }
            }
            const timeOut = setTimeout(makeQuery, 300);
            return function () {
                clearTimeout(timeOut);
                controller.abort();
            };
        },
        [query]
    );

    function handleSelectMovie(id: string) {
        if (id === selectedId) setSelectedId('');
        else setSelectedId(id);
    }

    function handleCloseMovie() {
        setSelectedId('');
    }

    function handleAddWatched(movie: WatchedMovie) {
        setWatched((curr) => [...curr, movie]);
    }

    function handleDeleteWatched(id: string) {
        setWatched((curr) => curr.filter((movie) => movie.imdbID !== id));
    }

    return (
        <>
            <NavBar>
                <Search query={query} setQuery={setQuery} />
                <NumResults num={movies.length} />
            </NavBar>
            <MainLayout>
                <Box>
                    {isLoading && <Loader />}
                    {!isLoading && !error && (
                        <MovieList
                            onSelectMovie={handleSelectMovie}
                            movies={movies}
                        />
                    )}
                    {error && <ErrorMessage message={error} />}
                </Box>
                <Box>
                    {selectedId ? (
                        <MovieDetails
                            selectedId={selectedId}
                            watchedMovies={watched}
                            onCloseMovie={handleCloseMovie}
                            onAddWatched={handleAddWatched}
                        />
                    ) : (
                        <>
                            <WatchedSummary watched={watched} />
                            <WatchedMovieList
                                watched={watched}
                                onDeleteWatched={handleDeleteWatched}
                            />
                        </>
                    )}
                </Box>
            </MainLayout>
        </>
    );
}
