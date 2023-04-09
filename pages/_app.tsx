import "@/styles/globals.css";
import { Inter } from "@next/font/google";
import type { AppProps } from "next/app";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

declare global {
  interface Window {
    VANTA: any;
  }
}

export default function App({ Component, pageProps }: AppProps<{}>) {
  return (
    <main className={inter.className}>
      <Component {...pageProps} />

      {/* TODO: refactor to hooks */}
      <div>
        <div id="background" className='w-screen h-screen !absolute -z-10 top-0 left-0'>
        </div>
        <style>{`
          .vanta-canvas {
            width: 100% !important;
            height: 100% !important;
          }
        `}</style>

        <Script
          defer
          src="https://cdn.jsdelivr.net/npm/vanta/dist/vanta.net.min.js"
          onReady={() => {
            window.VANTA.NET({
              el: '#background',
              color: '#06b6d4'
            })
          }}
        />
      </div>
    </main>
  );
}
