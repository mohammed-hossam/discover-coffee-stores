import { createContext, useReducer } from 'react';

export const ContextStore = createContext();

const initialState = {
  latLng: '',
  coffeeStores: [],
};

export const actions = {
  SET_LAT_LONG: 'SET_LAT_LNG',
  SET_COFFEE_STORES: 'SET_COFFEE_STORES',
};

function stateReducer(state, action) {
  switch (action.type) {
    case actions.SET_LAT_LONG:
      return { ...state, latLng: action.payLoad };

    case actions.SET_COFFEE_STORES:
      return { ...state, coffeeStores: action.payLoad };

    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}

function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(stateReducer, initialState);

  return (
    <ContextStore.Provider value={{ state, dispatch }}>
      {children}
    </ContextStore.Provider>
  );
}
export default StoreProvider;
