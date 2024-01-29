import { useEffect, useState } from 'react';
import { Movie } from '../typesAndConstants/types';
import { KEY } from '../typesAndConstants/constants';

export function useMovies(query: string) {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

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

    return { movies, isLoading, error };
}
