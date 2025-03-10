import { getRequestConfig } from 'next-intl/server';
import { locales } from './navigation';

export default getRequestConfig(async ({ locale }) => ({
  messages: (
    await (locales.includes(locale)
      ? import(`./public/locales/${locale}.json`)
      : import('./public/locales/en.json'))
  ).default,
}));
