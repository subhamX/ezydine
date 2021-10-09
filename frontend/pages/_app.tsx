import 'tailwindcss/tailwind.css'
import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Auth0Provider } from '@auth0/auth0-react'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Auth0Provider
      domain="ezydine.eu.auth0.com"
      clientId="SlQOb5sPpZboWM1GZvec1Qd5xkkUVx8N"
      redirectUri={typeof window !=='undefined' ? window.location.origin : '/'}
    >
      <Component {...pageProps} />
    </Auth0Provider>
  )
}
export default MyApp
