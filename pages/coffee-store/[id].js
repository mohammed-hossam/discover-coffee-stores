import { useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from '../../styles/coffee-store.module.css';
import Link from 'next/link';
import Head from 'next/head';
import Image from 'next/image';
import { fetchCoffeeStores } from '../../lib/coffee-stores';
import { ContextStore } from '../../store/store';
import { isEmpty } from '../../utils';
import useSWR from 'swr';

const fetcher = (...args) => fetch(...args).then((res) => res.json());
// function fetcher(...args) {
//   return fetch(...args).then((res) => res.json());
// }

function CoffeeStore(initialProps) {
  const router = useRouter();

  const id = router.query.id;
  // console.log(id);

  const [coffeeStore, setCoffeeStore] = useState(
    initialProps.coffeeStore || {}
  );
  // console.log(initialProps.coffeeStore);
  // console.log(coffeeStore);
  const { address, name, neighbourhood, imgUrl } = coffeeStore;

  const {
    state: { coffeeStores },
  } = useContext(ContextStore);

  const [votingCount, setVotingCount] = useState(0);

  async function handleCreateCoffeeStore(coffeeStore) {
    try {
      const { id, name, voting, imgUrl, neighbourhood, address } = coffeeStore;
      await fetch('/api/createCoffeeStore', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          name,
          voting: 0,
          imgUrl,
          neighbourhood: neighbourhood || '',
          address: address || '',
        }),
      });
    } catch (err) {
      console.error('Error creating coffee store', err);
    }
  }

  async function handleUpvoteButton() {
    try {
      const response = await fetch('/api/updateVoteById', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
        }),
      });

      const dbCoffeeStore = await response.json();

      if (dbCoffeeStore && dbCoffeeStore.length > 0) {
        setVotingCount((prevCount) => prevCount + 1);
      }
    } catch (err) {
      console.error('Error upvoting the coffee store', err);
    }
  }

  useEffect(() => {
    //hena lw el sf7a mknsh m3molha ssg w lsa gdeda
    if (isEmpty(initialProps.coffeeStore)) {
      if (coffeeStores.length > 0) {
        const coffeeStoreFromContext = coffeeStores.find(
          (el) => el.id.toString() === id
        );
        if (coffeeStoreFromContext && isEmpty(coffeeStore)) {
          setCoffeeStore(coffeeStoreFromContext);
          handleCreateCoffeeStore(coffeeStoreFromContext);
        }
      }
    } else {
      // SSG
      //hena 3mlna kda bs 3shan el voting button, fa kda heya fl 2wel el mfrod tege mn el ssg w b3d kda tege mn el database 3shan sglnaha 3leh 3shan el voting ykon mtsgl
      handleCreateCoffeeStore(initialProps.coffeeStore);
    }
  }, [id, coffeeStore, coffeeStores, initialProps.coffeeStore]);

  const { data, error } = useSWR(`/api/getCoffeeStoreById?id=${id}`, fetcher);

  useEffect(() => {
    // console.log(data);
    if (data && data.length > 0) {
      setCoffeeStore(data[0]);
      setVotingCount(data[0].voting);
    }
  }, [data]);

  if (error) {
    return <div>Something went wrong retrieving coffee store page</div>;
  }
  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.layout}>
      <Head>
        <title>{name}</title>
        <meta name="description" content={`${name} coffee store`}></meta>
      </Head>
      <div className={styles.container}>
        <div className={styles.col1}>
          <div className={styles.backToHomeLink}>
            <Link href="/">
              <a>← Back to home</a>
            </Link>
          </div>
          <div className={styles.nameWrapper}>
            <h1 className={styles.name}>{name}</h1>
          </div>
          <Image
            src={
              imgUrl ||
              'https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80'
            }
            width={600}
            height={360}
            className={styles.storeImg}
            alt={name}
          ></Image>
        </div>

        <div className={['glass', styles.col2].join(' ')}>
          <div className={styles.iconWrapper}>
            <Image
              src="/static/icons/places.svg"
              width="24"
              height="24"
              alt="places icon"
            />
            <p className={styles.text}>{address}</p>
          </div>
          {neighbourhood && (
            <div className={styles.iconWrapper}>
              <Image
                src="/static/icons/nearMe.svg"
                width="24"
                height="24"
                alt="near me icon"
              />
              <p className={styles.text}>{neighbourhood}</p>
            </div>
          )}
          <div className={styles.iconWrapper}>
            <Image
              src="/static/icons/star.svg"
              width="24"
              height="24"
              alt="star icon"
            />
            <p className={styles.text}>{votingCount}</p>
          </div>

          <button className={styles.upvoteButton} onClick={handleUpvoteButton}>
            Up vote!
          </button>
        </div>
      </div>
    </div>
  );
}

export async function getStaticPaths() {
  const coffeeStores = await fetchCoffeeStores();

  const paths = coffeeStores.map((coffeeStore) => {
    return {
      params: {
        id: coffeeStore.id.toString(),
      },
    };
  });

  return {
    // paths: [
    //   { params: { id: 0 } },
    //   { params: { id: 1 } },
    //   { params: { id: 2 } },
    // ],
    paths,
    fallback: true,
  };
}

export async function getStaticProps(staticProps) {
  const coffeeStores = await fetchCoffeeStores();

  const params = staticProps.params;

  const findCoffeeStoreById = coffeeStores.find((coffeeStore) => {
    return coffeeStore.id.toString() === params.id; //dynamic id
  });
  return {
    props: {
      //hena kda e7na 3mlen handle ll fallback:true 3shan lw ml2ash mydesh error
      coffeeStore: findCoffeeStoreById ? findCoffeeStoreById : {},
    },
  };
}

export default CoffeeStore;
