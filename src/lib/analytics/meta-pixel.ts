/**
 * Centralized Meta Pixel (Facebook Pixel) Tracking Utility
 * 
 * Provides type-safe wrappers for standard Meta events and client-side pageview tracking.
 * Pixel ID is configurable via NEXT_PUBLIC_META_PIXEL_ID with fallback to production ID.
 */

export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || '1144209198341852';

export type MetaStandardEvent =
  | 'PageView'
  | 'ViewContent'
  | 'CompleteRegistration'
  | 'Lead'
  | 'InitiateCheckout'
  | 'Purchase';

declare global {
  interface Window {
    fbq?: ((...args: any[]) => void) & {
      callMethod?: (...args: any[]) => void;
      queue?: any[];
      loaded?: boolean;
      version?: string;
    };
    _fbq?: any;
  }
}

/**
 * Fires a PageView event on client-side route navigation.
 * Initial page load PageView is handled automatically by the Pixel initialization snippet.
 */
export const pageview = () => {
  if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
    window.fbq('track', 'PageView');
  }
};

/**
 * Dispatches standard Meta business events.
 * 
 * Standard events supported:
 * - PageView
 * - ViewContent (e.g. view model/feature details)
 * - CompleteRegistration (e.g. signup completed)
 * - Lead (e.g. contact inquiry sent)
 * - InitiateCheckout (e.g. pricing tier selected)
 * - Purchase (e.g. subscription payment successful)
 */
export const trackEvent = (
  name: MetaStandardEvent,
  options: Record<string, any> = {}
) => {
  if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
    window.fbq('track', name, options);
  }
};

/**
 * Dispatches custom application events to Meta Pixel.
 */
export const trackCustomEvent = (
  name: string,
  options: Record<string, any> = {}
) => {
  if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
    window.fbq('trackCustom', name, options);
  }
};
