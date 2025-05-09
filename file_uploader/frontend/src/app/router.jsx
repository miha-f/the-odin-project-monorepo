import { createBrowserRouter } from 'react-router-dom';
import App from './App'
import Layout from './Layout'
import AuthLayout from './AuthLayout'
import Login from './pages/Login'
import Register from './pages/Register'

export const router = createBrowserRouter([
    {
        element: <Layout />,
        children: [
            { path: '/', element: <App /> },
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
