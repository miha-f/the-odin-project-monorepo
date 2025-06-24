import { root } from '@lynx-js/react'

import { MemoryRouter, Routes, Route } from 'react-router';

import { App } from './App.jsx';
import { Layout } from './Layout.jsx';

import { Blogs } from '@/pages/Blogs.jsx';

root.render(
    <MemoryRouter>
        <Routes>
            <Route path="/" element={<Layout />} >
                <Route index element={<App />} />
                {/* <Route path="blogs" element={<Blogs />} /> */}
            </Route>
        </Routes>
    </MemoryRouter>,
);

if (import.meta.webpackHot) {
    import.meta.webpackHot.accept()
}
