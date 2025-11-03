'use client';

import { Inter } from 'next/font/google';
import './globals.css';
import { Provider } from 'react-redux';
import { store } from '../store/store';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setAuthFromStorage } from '../store/slices/userSlice';
import { Toaster } from 'react-hot-toast';

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
        <title>Abk Shop</title>
        <meta name="description" content="Shop the latest products with great deals" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={inter.className}>
        <Provider store={store}>
          <AuthInitializer>
            {children}
          </AuthInitializer>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#fff',
                color: '#363636',
                padding: '16px',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 4000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </Provider>
      </body>
    </html>
  );
}