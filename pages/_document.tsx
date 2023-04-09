import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <script defer src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js"></script>
      </Head>

      <body className='text-white bg-slate-800'>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
