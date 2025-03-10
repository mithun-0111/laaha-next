import { createSharedPathnamesNavigation } from 'next-intl/navigation';
import siteConfig from './site.config';

export const locales = Object.keys(siteConfig.locales);

export const { Link, redirect, usePathname, useRouter } = createSharedPathnamesNavigation({
  locales,
});
