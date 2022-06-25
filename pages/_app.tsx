import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { StateContextProvider } from '../client/context';
import { QueryClientProvider, Hydrate } from 'react-query';
import { CookiesProvider } from 'react-cookie';
import { queryClient } from '../client/requests/graphqlRequestClient';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <CookiesProvider>
      <StateContextProvider>
        <QueryClientProvider client={queryClient}>
          <Hydrate state={pageProps.dehydratedState}>
            <Component {...pageProps} />
          </Hydrate>
        </QueryClientProvider>
      </StateContextProvider>
    </CookiesProvider>
  );
}

export default MyApp;
