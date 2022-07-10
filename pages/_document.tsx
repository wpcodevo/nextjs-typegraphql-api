import { Html, Head, Main, NextScript } from 'next/document';
import dotenv from 'dotenv-safe';
dotenv.config();

export default function Document() {
  return (
    <Html>
      <Head>
        <link
          href='https://unpkg.com/boxicons@2.1.2/css/boxicons.min.css'
          rel='stylesheet'
        ></link>
      </Head>
      <body className='font-Poppins'>
        <Main />
        <NextScript />
        <div id='post-modal'></div>
      </body>
    </Html>
  );
}
