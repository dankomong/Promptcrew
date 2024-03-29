'use client';

import { SessionProvider } from 'next-auth/react';

// Higher Order Component
const Provider = ({ children, session }) => {
    return (
        <SessionProvider session={session}>
            {children}
        </SessionProvider>
    );
};

export default Provider;