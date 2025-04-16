import { Link, Outlet } from 'react-router-dom';

const MainLayout = () => {
    return (
        <div>
            <header className="p-4 bg-gray-800 text-white">My App Header
                <Link to="/">Home</Link> | <Link to="/shop">Shop</Link>

            </header>

            <main className="p-4">
                <Outlet />
            </main>

            <footer className="p-4 bg-gray-200 text-center">© 2025</footer>
        </div>
    );
}

export default MainLayout; 
