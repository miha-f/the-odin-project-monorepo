import { NavLink, Outlet } from 'react-router-dom';

const MyNavLink = ({ name, url }) => {
    return (
        <NavLink
            to={url}
            className={({ isActive }) =>
                isActive ? 'text-yellow-400' : 'hover:text-yellow-300'
            }
        >
            {name}
        </NavLink>
    );
}

const MainLayout = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <header className="bg-gray-800 text-white p-4">
                <nav className="container mx-auto flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Shopping Cart</h1>
                    <div className="space-x-4">
                        <MyNavLink name="Home" url="/" />
                        <MyNavLink name="Shop" url="/shop" />
                    </div>
                </nav>
            </header>

            <main className="flex-1 container mx-auto p-4">
                <Outlet />
            </main>

            <footer className="bg-gray-100 text-center text-sm p-4 text-gray-600">
                © {(new Date().getFullYear())} Shopping cart. All rights reserved.
            </footer>
        </div>
    );
}

export default MainLayout; 
