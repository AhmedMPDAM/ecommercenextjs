'use client';

import { Inter } from 'next/font/google';
import './globals.css';
import { Provider } from 'react-redux';
import { store } from '../store/store';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setAuthFromStorage } from '../store/slices/userSlice';

const inter = Inter({ subsets: ['latin'] });

function AuthInitializer({ children }) {
  const dispatch = useDispatch();

  useEffect(() => {
     dispatch(setAuthFromStorage());
  }, [dispatch]);

  return <>{children}</>;
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>Modern E-Commerce Store</title>
        <meta name="description" content="Shop the latest products with great deals" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={inter.className}>
        <Provider store={store}>
          <AuthInitializer>
            {children}
          </AuthInitializer>
        </Provider>
      </body>
    </html>
  );
}