import type { Metadata } from 'next';
import { LanguageProvider } from '@/context/language-context';
import { ThemeProvider } from '@/providers/theme-provider';
import AppWrapper from '@/components/layout/app-wrapper';
import './globals.css';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { GoogleMapsProvider } from '@/components/google-maps-provider';

export const metadata: Metadata = {
  title: 'Rota Salihli',
  description: "Sardes'in mirası, paranın merkezi",
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
        <GoogleMapsProvider />
      </head>
      <body className="font-body antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <LanguageProvider>
            <FirebaseClientProvider>
              <AppWrapper>
                {children}
              </AppWrapper>
            </FirebaseClientProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
