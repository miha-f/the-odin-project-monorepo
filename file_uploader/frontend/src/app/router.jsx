import { createBrowserRouter } from 'react-router-dom';
import AuthLayout from './AuthLayout'
import FileDisplayPage from './pages/FileDisplay'
import SearchPage from './pages/Search'
import Layout from './Layout'
import Login from './pages/Login'
import Register from './pages/Register'

export const router = createBrowserRouter([
    {
        element: <Layout />,
        children: [
            { path: '/folders/*', element: <FileDisplayPage /> },
            { path: '/search', element: <SearchPage /> },
            { path: '/', element: <FileDisplayPage /> },
        ],
    },
    {
        element: <AuthLayout />,
        children: [
            { path: '/login', element: <Login /> },
            { path: '/register', element: <Register /> },
        ],
    },
]);
