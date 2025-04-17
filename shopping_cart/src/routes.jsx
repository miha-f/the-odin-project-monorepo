import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Product from "./pages/Product";

const routes = [
    {
        path: "/",
        element: <MainLayout />,
        // errorElement: <App />,
        children: [
            { path: "", element: <Home /> },
            { path: "shop", element: <Shop /> },
            { path: "product/:id", element: <Product /> },
        ]
    },
];

export default routes;

