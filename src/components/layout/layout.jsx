import React, { useEffect, useState } from 'react';
import { view } from '@risingstack/react-easy-state';
import { Link } from 'react-router-dom';
import layout from './layout.module.scss';
import GetUserGeo from '../../helpers/get-user-geo';
import GameStore from '../../stores/game';
import UserStore from '../../stores/user';
import GoogleFontLoader from 'react-google-font-loader';
import axios from 'axios';

export default view(function Layout(props) {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    // Get the game
    // Get user location
    GetUserGeo()
      .then((geo) => {
        UserStore.geo = geo;
      })
      .catch((err) => {
        console.log('err', err);
      });

    // axios.get(process.env.REACT_APP_GAME_API_ENDPOINT).then(e => {
    //   if (e.status === 200) {
    //     GameStore.game = e.data
    //     setLoaded(true)
    //   }
    // }).catch(e => {
    //   window.alert('Issue loading game', e.response ? JSON.stringify(e.response.data) : null)
    // })
  }, []);
  return !loaded ? (
    <>
      <div className={layout.layout}>
        <GoogleFontLoader
          fonts={[
            {
              font: GameStore.game
                ? GameStore.game.Styling.FontFamily
                : 'Overpass',
              weights: [400, '400i'],
            },
          ]}
        />
        <div>{props.children}</div>
      </div>
    </>
  ) : (
    <>
      <div>
        <h1>Loading...</h1>
      </div>
    </>
  );
});
