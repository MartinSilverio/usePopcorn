import { useEffect, useRef } from 'react';
import { useKey } from '../hooks/useKey';

export default function Search({
    query,
    setQuery,
}: {
    query: string;
    setQuery(s: string): void;
}) {
    const inputEl = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (inputEl.current) {
            inputEl.current.focus();
        }
    }, []);

    useKey('Enter', () => {
        if (document.activeElement === inputEl?.current) return;
        inputEl.current?.focus();
        setQuery('');
    });

    return (
        <input
            className="search"
            type="text"
            placeholder="Search movies..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            // ref basically tells React that the reference to the input element will be stored in inputlEl
            //(instead of having to do querySelector )
            ref={inputEl}
        />
    );
}
