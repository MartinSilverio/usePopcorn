import { useState } from 'react';
import { WatchedMovie } from './typesAndConstants/types';
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
import { useMovies } from './hooks/useMovies';
import { useLocalStorageState } from './hooks/useLocalStorageState';

export default function App() {
    const [selectedId, setSelectedId] = useState('');
    const [query, setQuery] = useState('');
    const { movies, isLoading, error } = useMovies(query);
    const [watched, setWatched] = useLocalStorageState<WatchedMovie[]>(
        [],
        'watched'
    );

    //Don't do useState(localStorage.getItem('watched')) because that would result in calling the method every re-render

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

    function handleSelectMovie(id: string) {
        if (id === selectedId) setSelectedId('');
        else setSelectedId(id);
    }

    function handleCloseMovie() {
        setSelectedId('');
    }

    function handleAddWatched(movie: WatchedMovie) {
        setWatched((curr) => [...curr, movie]);

        //If we want to do it this wayWe need to do it this way b/c setting watched is async, so setting it
        //as just current watched will set stale data
        // localStorage.setItem('watched', JSON.stringify([...watched, movie]));
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
