import { createClient,
         createImageUrlBuilder,
        createPreviewSubscriptionHook 
    } from 'next-sanity';
import { config } from './sanityClient';

if(!config.projectId) {
    throw Error(
        'The Project Id is not set. Check your environment variables.'
    )
}

export const urlFor = sourse => 
    createImageUrlBuilder(client).image(source);

export const imageBuilder = source =>
    createImageUrlBuilder(client).image(source);

export const usePreviewSubscription = 
    createPreviewSubscriptionHook(client);
