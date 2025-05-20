import React from 'react';
import Header from './_components/Header.jsx';
import { Footer } from '@/components/Footer.jsx';

const Provider = ({ children }) => {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
                {children}
            </main>
            <Footer/>
        </div>
    );
};

export default Provider;