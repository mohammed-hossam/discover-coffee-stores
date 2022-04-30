import Head from 'next/head';
import Image from 'next/image';
import Banner from '../compoents/banner/Banner';
import Card from '../compoents/card/Card';
import styles from '../styles/Home.module.css';

export default function Home() {
  function handleOnBannerBtnClick() {
    console.log('welcome');
  }

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
        <Banner
          // buttonText={isFindingLocation ? "Locating..." : "View stores nearby"}
          buttonText="View stores nearby"
          handleOnClick={handleOnBannerBtnClick}
        />
        <div className={styles.heroImage}>
          <Image
            src="/static/hero-image.png"
            width={700}
            height={400}
            alt="hero image"
          />
        </div>
        <Card
          href="/coffee-store/test"
          name="rgfg"
          imgUrl="/static/hero-image.png"
        />
      </main>
    </div>
  );
}
