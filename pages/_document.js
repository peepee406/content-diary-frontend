import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html>
      <Head />
      <body>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.ENV_BACKEND_URL = "${process.env.NEXT_PUBLIC_BACKEND_URL}";
              window.ENV_RAPIDAPI_KEY = "${process.env.NEXT_PUBLIC_RAPIDAPI_KEY}";
            `,
          }}
        />
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}