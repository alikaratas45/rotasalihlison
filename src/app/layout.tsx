import type { Metadata } from 'next';
import { ThemeProvider } from '@/providers/theme-provider';
import { I18nProvider } from '@/providers/i18n-provider';
import AppProviders from '@/providers/app-providers';
import './globals.css';

export const metadata: Metadata = {
  title: 'Rota Salihli',
  description: "Sardes'in Mirası, Gediz'in İncisi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <AppProviders>
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
