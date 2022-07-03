import '../styles/globals.css';
import 'react-toastify/dist/ReactToastify.css';
import type { AppProps } from 'next/app';
import { QueryClientProvider, Hydrate } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { CookiesProvider } from 'react-cookie';
import { queryClient } from '../client/requests/graphqlRequestClient';
import PageLayout from '../client/components/Layout';
import { ToastContainer } from 'react-toastify';

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
          <ToastContainer />
          <ReactQueryDevtools initialIsOpen={false} />
        </Hydrate>
      </QueryClientProvider>
    </CookiesProvider>
  );
}

export default MyApp;
