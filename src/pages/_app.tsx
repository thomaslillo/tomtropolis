import '@/styles/globals.css'
import type { AppProps } from 'next/app'

// this is the main entrypoint for the app - it wraps all the pages

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
