const GetUserGeo = () => {
  return new Promise((r) => {
    const resolve = (...args) => {
      r(...args);
    };
    const def = {
      longitude: -1.61525,
      latitude: 54.971402,
    };
    if (navigator && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (geo) => {
          resolve({
            longitude: geo.coords.longitude,
            latitude: geo.coords.latitude,
          });
        },
        (err) => {
          console.log('%cFailed', 'font-weight: 700; color: red;', err);
          resolve(def);
        },
        {
          enableHighAccuracy: false,
          timeout: 3000,
        }
      );
    } else {
      resolve(def);
    }
  });
};

export default GetUserGeo;
