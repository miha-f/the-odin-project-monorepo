import '@mantine/core/styles.css';

import React from 'react';
import { ColorSchemeScript, mantineHtmlProps, MantineProvider, Container } from '@mantine/core';
import { theme } from '../theme';
import Header from '@/components/layout/Header';
import { AuthProvider } from "@/utils/AuthContext";

export const metadata = {
    title: 'Mantine Next.js template',
    description: 'I am using Mantine with Next.js!',
};

export default function RootLayout({ children }: { children: any }) {
    return (
        <html lang="en" {...mantineHtmlProps}>
            <head>
                <ColorSchemeScript />
                <link rel="shortcut icon" href="/favicon.svg" />
                <meta
                    name="viewport"
                    content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
                />
            </head>
            <body>
                <MantineProvider theme={theme}>
                    <AuthProvider>
                        <Header />
                        <Container size={1200}>
                            {children}
                        </Container>
                    </AuthProvider>
                </MantineProvider>
            </body>
        </html>
    );
}
