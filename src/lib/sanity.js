import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

export const client = createClient({
    projectId: 'gn3r7y9o',
    dataset: 'production',
    useCdn: true, // set to `false` to bypass the edge cache
    apiVersion: '2023-05-03', // use current date (YYYY-MM-DD) to target the latest API version
    token: 'skDiL94MoAzZk6iUHOoK44SBFhE3cxGTakFyWgNvpoxMVZstyVf7aJS9dlsttqv9NRh1GtpaSSOFHg1b6tx2fSQcjQ40ilMAATbYmNB9FIAFrfKcCtr8qvNf3ibgW5ZeOHLylFYBblTlDz3Dh0HPCwtYncK7aRlgUpyLdHUXzyRuvjXlSp5S', // Cached for write operations
});

const builder = imageUrlBuilder(client);

export function urlFor(source) {
    if (!source) return null;
    return builder.image(source);
}
