import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { StateContextProvider } from '../client/context';
import { QueryClientProvider, Hydrate } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { CookiesProvider } from 'react-cookie';
import { queryClient } from '../client/requests/graphqlRequestClient';
import PageLayout from '../client/components/Layout';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <CookiesProvider>
      <QueryClientProvider client={queryClient}>
        <Hydrate state={pageProps.dehydratedState}>
          <PageLayout
            requireAuth={pageProps.requireAuth}
            enableAuth={pageProps.enableAuth}
          >
            <Component {...pageProps} />
          </PageLayout>
          <ReactQueryDevtools initialIsOpen={false} />
        </Hydrate>
      </QueryClientProvider>
    </CookiesProvider>
  );
}

export default MyApp;
