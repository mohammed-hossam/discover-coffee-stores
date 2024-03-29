import Link from 'next/link';
import Image from 'next/image';
import React from 'react';

import styles from './card.module.css';
// import '../../styles/globals.css';

function Card(props) {
  return (
    <Link href={props.href}>
      <a className={styles.cardLink}>
        <div className={['glass', styles.container].join(' ')}>
          {/* <div className={styles.container}> */}
          <div className={styles.cardHeaderWrapper}>
            <h2 className={styles.cardHeader}>{props.name}</h2>
          </div>
          <div className={styles.cardImageWrapper}>
            <Image
              alt={props.name}
              className={styles.cardImage}
              src={props.imgUrl}
              width={260}
              height={160}
            />
          </div>
        </div>
      </a>
    </Link>
  );
}

export default Card;
