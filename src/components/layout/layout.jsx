import React, { useEffect, useState } from 'react';
import { view } from '@risingstack/react-easy-state';
import layout from './layout.module.scss';
import GameStore from '../../stores/game';
import GoogleFontLoader from 'react-google-font-loader';
import axios from 'axios';

export default view(function Layout(props) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState();
  const isMobile = window.screen.width < 900;

  useEffect(() => {
    // Get the game
    axios
      .get(process.env.REACT_APP_GAME_API_ENDPOINT)
      .then((e) => {
        if (e.status === 200) {
          GameStore.game = e.data;
          document.documentElement.style.setProperty(
            '--fonts',
            e.data ? e.data.Styling.FontFamily : 'Roboto'
          );
          document.documentElement.style.setProperty(
            '--fontColor',
            e.data ? e.data.Styling.FontColour : 'black'
          );
          document.documentElement.style.setProperty(
            '--backgroundColour',
            e.data ? e.data.Styling.BackgroundColour : '#ece5dd'
          );

          // fix mobile to one background
          const pageColour = isMobile
            ? e.data.Styling.BackgroundColour
            : e.data.Styling.PageColour;
          document.documentElement.style.setProperty(
            '--pageBackground',
            e.data ? pageColour : 'rgb(113, 121, 126, 0.3)'
          );
          document.documentElement.style.setProperty(
            '--headerColour',
            e.data ? e.data.Styling.HeaderColour : '#f2f6f8'
          );
          document.documentElement.style.setProperty(
            '--iconColour',
            e.data ? e.data.Styling.IconColour : '#d3d3d3'
          );
          document.documentElement.style.setProperty(
            '--characterBubbleColour',
            e.data ? e.data.Styling.CharacterBubbleColour : '#f9f9f9'
          );
          document.documentElement.style.setProperty(
            '--userBubbleColour',
            e.data ? e.data.Styling.UserBubbleColour : '#3fa09d'
          );
          document.documentElement.style.setProperty(
            '--linkColour',
            e.data ? e.data.Styling.LinkColour : '#3366CC'
          );
          document.documentElement.style.setProperty(
            '--userTextColour',
            e.data ? e.data.Styling.UserTextColour : '#000000'
          );
          document.documentElement.style.setProperty(
            '--characterTextColour',
            e.data ? e.data.Styling.CharacterTextColour : '#000000'
          );
          setLoaded(true);
        }
      })
      .catch((err) => {
        console.log('result', err);
        setError(err);
      });
  }, []);

  if (error) {
    return (
      <div className="background">
        Sorry, there was an issue loading the game, try refreshing the page.
        <div className="error">{error.response.data}</div>
      </div>
    );
  }

  return loaded ? (
    <>
      <div className={layout.layout}>
        <GoogleFontLoader
          fonts={[
            {
              font: GameStore.game ? GameStore.game.Styling.FontFamily : '',
              weights: [400, '400i'],
            },
          ]}
        />
        <div>{props.children}</div>
      </div>
    </>
  ) : (
    <>
      <div className="background">
        <h1>Loading...</h1>
      </div>
    </>
  );
});
