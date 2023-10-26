import {
  Html, Head, Main, NextScript,
} from 'next/document';
import { useEffect } from 'react';

export default function Document() {
  return (
    <Html className="h-full" lang="en">
      <Head />
      <body className="h-full">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
