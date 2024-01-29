import { Dispatch, SetStateAction, useEffect, useState } from 'react';

export function useLocalStorageState<T>(
    initialState: T,
    key: string
): [T, Dispatch<SetStateAction<T>>] {
    const [value, setValue] = useState<T>(() => {
        const storedValue = localStorage.getItem(key);
        if (storedValue === null) return initialState;

        return JSON.parse(storedValue);
    });

    useEffect(
        function () {
            localStorage.setItem(key, JSON.stringify(value));
        },
        [key, value]
    );

    return [value, setValue];
}
