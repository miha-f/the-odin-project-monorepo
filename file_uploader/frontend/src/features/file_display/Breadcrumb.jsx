import { Link, useLocation } from 'react-router-dom';

const Breadcrumbs = () => {
    const location = useLocation();
    location.pathname = location.pathname.replace(/^\/folders\//, "");

    const segments = location.pathname
        .split('/')
        .filter(Boolean)
        .map((segment, index, array) => {
            const path = '/' + array.slice(0, index + 1).join('/');
            return { label: decodeURIComponent(segment), path: `/folders${path}` };
        });

    return (
        <nav className="text-sm text-gray-500 flex items-center space-x-2">
            {segments.map(({ label, path }, i) => (
                <div key={path} className="flex items-center space-x-2">
                    <span>/</span>
                    {i === segments.length - 1 ? (
                        <span className="text-gray-700 font-medium">{label}</span>
                    ) : (
                        <Link to={path} className="hover:underline">{label}</Link>
                    )}
                </div>
            ))}
        </nav>
    );
};

export default Breadcrumbs;
