import StoreProvider from '../store/store';
import '../styles/globals.css';
// https://github.com/kulkarniankita/discover-coffee-stores

function MyApp({ Component, pageProps }) {
  return (
    <StoreProvider>
      <Component {...pageProps} />
    </StoreProvider>
  );
}

export default MyApp;
