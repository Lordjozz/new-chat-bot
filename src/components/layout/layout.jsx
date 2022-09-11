import React, { useEffect, useState } from 'react'
import { view } from '@risingstack/react-easy-state'
import {Link} from 'react-router-dom'
import layout from './layout.module.scss'
// import ClimbingBoxLoader from 'react-spinners/ClimbingBoxLoader'
// import GetCountryFromISO from '../../helpers/get-country-from-iso'
import GetUserGeo from '../../helpers/get-user-geo'
import GameStore from '../../stores/game'
import UserStore from '../../stores/user'
import GoogleFontLoader from 'react-google-font-loader'
import axios from 'axios'

export default view(function Layout(props) {
  const [loaded, setLoaded] = useState(false)
  useEffect(() => {
    // Get the game

    // Get user location
    // console.log('%cCountry', GetCountryFromISO('gb'))
    GetUserGeo().then(geo => {
      // console.log('GEO', geo)
      UserStore.geo = geo
      // console.log(GetUserCountry(geo))
    }).catch(err => {
      console.log('err', err)
    })

    axios.get(process.env.REACT_APP_GAME_API_ENDPOINT).then(e => {
      if (e.status === 200) {
        GameStore.game = e.data
        setLoaded(true)
      }
    }).catch(e => {
      window.alert('Issue loading game', e.response ? JSON.stringify(e.response.data) : null)
    })

    document.documentElement.style.setProperty('--fonts', GameStore.game ? GameStore.game.Styling.FontFamily : 'Roboto')
  }, [])
  return (
    loaded ? <>
      <div className={layout.layout}>
        <GoogleFontLoader fonts={[{
          font: GameStore.game ? GameStore.game.Styling.FontFamily : 'Roboto',
          weights: [400, '400i'],
        }]} />
        <div className={layout.nav}>
          <img alt="" className={layout.logo} src={GameStore.game ? GameStore.game.Styling.Logo : null} />
          {
            UserStore.setup ? <Link to="/rooms">Chat Rooms</Link> : <Link to="/profile">Your Profile</Link>
          }
          
          {/* {!!UserStore.name ?  : null} */}
        </div>
        <div>
          {props.children}
        </div>
      </div>
    </> : <>
      <div>
        <h1>Loading</h1>
        {/* <ClimbingBoxLoader loading={true} size={15} color="var(--dark-background)" /> */}
      </div>
    </>
  )
})
