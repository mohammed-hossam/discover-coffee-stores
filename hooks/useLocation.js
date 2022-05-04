import { useState, useContext } from 'react';
import { ContextStore, actions } from '../store/store';

function useLocation() {
  const { dispatch } = useContext(ContextStore);
  const [locationErrorMsg, setLocationErrorMsg] = useState('');
  // const [latLng, setLatLng] = useState('');
  const [isFindingLocation, setIsFindingLocation] = useState(false);
  function error() {
    setIsFindingLocation(false);
    setLocationErrorMsg('unable to get your location');
  }
  function success(position) {
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;
    // setLatLng(`${lat},${lng}`);
    dispatch({
      type: actions.SET_LAT_LONG,
      payLoad: `${lat},${lng}`,
    });
    setLocationErrorMsg('');
    setIsFindingLocation(false);
  }

  function handleLocation() {
    setIsFindingLocation(true);

    if (!navigator.geolocation) {
      setLocationErrorMsg('Geolocation is not supported by your browser');
      setIsFindingLocation(false);
    } else {
      navigator.geolocation.getCurrentPosition(success, error);
    }
  }

  // return { latLng, handleLocation, locationErrorMsg, isFindingLocation };
  return { handleLocation, locationErrorMsg, isFindingLocation };
}

export default useLocation;
