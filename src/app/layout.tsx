
import type { Metadata } from 'next';
import { LanguageProvider } from '@/context/language-context';
import { ThemeProvider } from '@/providers/theme-provider';
import AppWrapper from '@/components/layout/app-wrapper';
import './globals.css';
import { FirebaseClientProvider } from '@/firebase/client-provider';

export const metadata: Metadata = {
  title: 'Rota Salihli - Salihli Belediyesi',
  description: "Sardes'in mirası, paranın merkezi",
  manifest: '/manifest.json',
  icons: {
    icon: '/logos.png',
    shortcut: '/logos.png',
    apple: '/logos.png',
  },
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
        <link rel="icon" href="/logos.png" type="image/png" sizes="any" />
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
