import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
      </Head>
      <body>
        <Main />
        <NextScript />
        {/* Error boundary for chunk loading errors */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.addEventListener('error', (event) => {
                if (event.message && event.message.includes('ChunkLoadError')) {
                  if (confirm('A new version is available. Please refresh the page to update.')) {
                    window.location.reload();
                  }
                }
              });
              
              // Service worker registration for better caching
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js').then(
                    (registration) => {
                      console.log('ServiceWorker registration successful');
                    },
                    (err) => {
                      console.log('ServiceWorker registration failed: ', err);
                    }
                  );
                });
              }
            `,
          }}
        />
      </body>
    </Html>
  );
}
