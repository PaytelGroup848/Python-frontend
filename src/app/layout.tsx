import type { Metadata } from 'next';
import Script from 'next/script';
import { QueryProvider } from '@/providers/query-provider';
import { ThemeProvider } from '@/components/providers/theme-provider';
import './globals.css';
import '@/components/landing/landing-navbar.css';
import '@/components/landing/landing-footer.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://patwatoliai.com'),
  title: 'Patwatoli AI',
  description: 'Landing page for Patwatoli AI',
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          id="google-tag-manager"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());

              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-5DFTNG97');
            `,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var b = localStorage.getItem('patwatoli_brightness');
                if (b === 'dim') {
                  document.documentElement.style.filter = 'brightness(0.80)';
                } else if (b === 'soft') {
                  document.documentElement.style.filter = 'brightness(0.90)';
                }
              } catch(e) {}
            `,
          }}
        />
      </head>
      <body suppressHydrationWarning className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-200">
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-5DFTNG97"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem={true}
          disableTransitionOnChange
        >
          <QueryProvider>{children}</QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
