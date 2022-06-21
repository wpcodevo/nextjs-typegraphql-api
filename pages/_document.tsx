import { Html, Head, Main, NextScript } from 'next/document';
import dotenv from 'dotenv-safe';
dotenv.config();

export default function Document() {
  return (
    <Html>
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
