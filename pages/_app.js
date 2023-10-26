import AlertDialogDemo from '@/components/app/AlertDialog';
import { ThemeProvider } from '@/components/theme-provider';
import '@/styles/globals.css';
import { SessionProvider } from 'next-auth/react';
import { RecoilRoot } from 'recoil';
import 'react-loading-skeleton/dist/skeleton.css';
import { HydrationBoundary, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from '@/components/ui/toaster';

export default function App({ Component, pageProps: { session, ...pageProps } }) {
  const [queryClient] = React.useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        refetchOnWindowFocus: false,
        refetchInterval: false,
        
      }
    }
  }));
  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        <HydrationBoundary state={pageProps.dehydratedState}>
          <RecoilRoot>
            <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
              <Component {...pageProps} />
              <Toaster />
            </ThemeProvider>
            <AlertDialogDemo />
          </RecoilRoot>
        </HydrationBoundary>
        <ReactQueryDevtools />
      </QueryClientProvider>
    </SessionProvider>
  );
}
