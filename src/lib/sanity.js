import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

export const client = createClient({
    projectId: import.meta.env.VITE_SANITY_PROJECT_ID,
    dataset: 'production',
    useCdn: true, // set to `false` to bypass the edge cache
    apiVersion: '2023-05-03', // use current date (YYYY-MM-DD) to target the latest API version
    token: import.meta.env.VITE_SANITY_TOKEN, // Protected via .env
});

const builder = imageUrlBuilder(client);

export function urlFor(source) {
    if (!source) return null;
    return builder.image(source);
}
