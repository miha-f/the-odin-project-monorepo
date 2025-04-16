import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Shop from "./pages/Shop";

const routes = [
    {
        path: "/",
        element: <MainLayout />,
        // errorElement: <App />,
        children: [
            { path: "", element: <Home /> },
            { path: "shop", element: <Shop /> },
        ]
    },
];

export default routes;

