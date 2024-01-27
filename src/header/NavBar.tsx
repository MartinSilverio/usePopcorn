import { ReactNode } from 'react';
import Logo from './Logo';

export default function NavBar({ children }: { children: ReactNode }) {
    return (
        <nav className="nav-bar">
            <Logo />
            {children}
        </nav>
    );
}
