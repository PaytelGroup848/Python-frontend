'use client';

import { useEffect, useRef, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import Script from 'next/script';
import { META_PIXEL_ID, pageview } from '@/lib/analytics/meta-pixel';

/**
 * Client-side route change tracker for Meta Pixel PageView.
 * Wrapped in Suspense to ensure Next.js App Router static optimization is preserved.
 * Uses initialRenderRef to prevent duplicate PageView on first load (which is fired by script init).
 */
function MetaPixelRouteTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const initialRenderRef = useRef(true);

  useEffect(() => {
    // The initial script execution fires the first PageView.
    // Skip subsequent call on initial component mount to avoid duplicates.
    if (initialRenderRef.current) {
      initialRenderRef.current = false;
      return;
    }

    pageview();
  }, [pathname, searchParams]);

  return null;
}

/**
 * MetaPixel Component
 * 
 * Injects official Meta Pixel script using Next.js afterInteractive strategy.
 * Includes noscript <img> pixel fallback and route transition PageView tracker.
 */
export function MetaPixel() {
  if (!META_PIXEL_ID) return null;

  return (
    <>
      <Script
        id="meta-pixel-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${META_PIXEL_ID}');
            fbq('track', 'PageView');
          `,
        }}
      />
      <Suspense fallback={null}>
        <MetaPixelRouteTracker />
      </Suspense>
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  );
}
