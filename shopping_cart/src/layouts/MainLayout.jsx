import { NavLink, Outlet } from 'react-router-dom';
import CartContainer from "@/components/CartContainer.jsx";

const MyNavLink = ({ name, url }) => {
    return (
        <NavLink
            to={url}
            className={({ isActive }) =>
                isActive ? 'text-yellow-400' : 'hover:text-yellow-300'
            }
            end
        >
            {name}
        </NavLink>
    );
}

const MainLayout = () => {
    return (
        <div className="min-h-screen flex flex-col max-w-screen-xl mx-auto">
            <header className="bg-gray-800 text-white p-4">
                <nav className="container mx-auto flex flex-col sm:flex-row items-center justify-between">
                    <NavLink to="/" >
                        <h1 className="text-xl font-semibold">Shopping Cart</h1>
                    </NavLink>
                    <div className="space-x-4 w-1/2 container flex items-center mt-3 justify-center sm:justify-end sm:mt-auto">
                        <MyNavLink name="Home" url="/" />
                        <MyNavLink name="Shop" url="/shop" />
                        <MyNavLink name="Checkout" url="/shop/checkout" />
                        <CartContainer />
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
