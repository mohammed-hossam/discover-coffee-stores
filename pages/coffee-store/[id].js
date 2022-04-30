import React from 'react';
import { useRouter } from 'next/router';

function CoffeeStore() {
  const router = useRouter();
  console.log(router);
  console.log(router.query.id);
  return <div>Coffee-store</div>;
}

export default CoffeeStore;
