import Head from 'next/head';
import Image from 'next/image';
import Banner from '../compoents/banner/Banner';
import Card from '../compoents/card/Card';
import styles from '../styles/Home.module.css';

import { fetchCoffeeStores } from '../lib/coffee-stores';
import useLocation from '../hooks/useLocation';
import { useEffect, useState, useContext } from 'react';
import { ContextStore, actions } from '../store/store';

export default function Home(props) {
  // const { latLng, handleLocation, locationErrorMsg, isFindingLocation } =
  const { handleLocation, locationErrorMsg, isFindingLocation } = useLocation();
  // const [coffeeStores, setCoffeeStores] = useState(props.coffeeStores || []);
  const { state, dispatch } = useContext(ContextStore);
  const { coffeeStores } = state;
  const [coffeeStoresError, setCoffeeStoresError] = useState(null);
  // const coffeeStores = console.log(props);
  function handleOnBannerBtnClick() {
    handleLocation();
  }

  useEffect(() => {
    async function clientsideCoffeeStores() {
      if (state.latLng) {
        //if condition 3shan 2wel mara el component y3ml render wel useEffect tsht8l, mt3mlsh 7aga.
        try {
          const coffeeStores = await fetchCoffeeStores(state.latLng, 50);
          // console.log(coffeeStores);
          // setCoffeeStores(coffeeStores);
          dispatch({
            type: actions.SET_COFFEE_STORES,
            payLoad: coffeeStores,
          });
          if (!coffeeStores.length) {
            setCoffeeStoresError('No coffeeStores found nearby you');
          } else {
            setCoffeeStoresError('');
          }
        } catch (err) {
          setCoffeeStoresError(err.message);
          console.log(err);
        }
      }
    }
    clientsideCoffeeStores();
  }, [state.latLng, dispatch]);
  console.log(state.latLng);

  return (
    <div className={styles.container}>
      <Head>
        <title>Coffee Connoisseur</title>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="description"
          content="allows you to discover coffee stores"
        ></meta>
      </Head>

      <main className={styles.main}>
        {/* banner section */}
        <Banner
          buttonText={isFindingLocation ? 'Locating...' : 'View stores nearby'}
          handleOnClick={handleOnBannerBtnClick}
        />
        {locationErrorMsg && <p>Something went wrong: {locationErrorMsg}</p>}
        {coffeeStoresError && <p> {coffeeStoresError}</p>}
        <div className={styles.heroImage}>
          <Image
            src="/static/hero-image.png"
            width={700}
            height={400}
            alt="hero image"
          />
        </div>

        {/* cards section */}
        {coffeeStores.length > 0 && (
          <div className={styles.sectionWrapper}>
            <h2 className={styles.heading2}> Stores near me</h2>

            <div className={styles.cardLayout}>
              {coffeeStores.map((el) => {
                return (
                  <Card
                    key={el.id}
                    href={`/coffee-store/${el.id}`}
                    name={el.name}
                    imgUrl={
                      el.imgUrl ||
                      'https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80'
                    }
                  />
                );
              })}
            </div>
          </div>
        )}
        {props.coffeeStores.length > 0 && (
          <div className={styles.sectionWrapper}>
            <h2 className={styles.heading2}>West El Balad stores</h2>

            <div className={styles.cardLayout}>
              {props.coffeeStores.map((el) => {
                return (
                  <Card
                    key={el.id}
                    href={`/coffee-store/${el.id}`}
                    name={el.name}
                    imgUrl={
                      el.imgUrl ||
                      'https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80'
                    }
                  />
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export async function getStaticProps(context) {
  const coffeeStores = await fetchCoffeeStores();
  return {
    props: {
      coffeeStores,
    }, // will be passed to the page component as props
  };
}
