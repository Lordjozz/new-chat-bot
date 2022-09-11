import React from 'react'
import { view } from '@risingstack/react-easy-state'
import Layout from '../components/layout/layout'
import GameStore from '../stores/game'
import { useHistory } from 'react-router-dom'
import GetDistanceToCountry from '../helpers/get-distance-to-country'
import UserStore from '../stores/user'
import GetCountryFromISO from '../helpers/get-country-from-iso'
import ReactCountryFlag from "react-country-flag"

export default view(function RoomsPage() {
  const history = useHistory()

  const openChatRoom = (room) => {
    if (room.Password) {
      const answer = window.prompt('What is the password?')
      console.log('answer', answer)

      if (answer !== room.Password) {
        return window.alert('The password you entered is incorrect, try again.')
      }
    }
    history.push(`rooms/${encodeURI(room.Name)}`)
  }
  return (
    <Layout>
      <div style={{backgroundColor: 'white', padding: '1em', borderRadius: 5, height: 500}}>
        <h1 style={{marginTop: 0}}>{GameStore.game.Title}</h1>
        {
          GameStore.game ? <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Users</th>
                <th>Password</th>
                <th>Distance</th>
              </tr>
            </thead>
            <tbody>
            {
              GameStore.game.ChatRooms.map(room => {
                return (<tr>
                  <td style={{textDecoration: 'underline', cursor: 'pointer'}} onClick={() => openChatRoom(room)}>{room.Name}</td>
                  <td>{room.ReservedUserCount}/{room.MaxUsersCount}</td>
                  <td>{room.Password ? <i className="fas fa-lock-alt"></i> : <i className="fas fa-lock-open-alt"></i>}</td>
                  <td><ReactCountryFlag countryCode={room.ISOCountry} /> {((GetDistanceToCountry([UserStore.geo.latitude,UserStore.geo.longitude],[GetCountryFromISO(room.ISOCountry).latitude,GetCountryFromISO(room.ISOCountry).longitude])) / 1000).toFixed(0)} km</td>
                </tr>)
              })
            }
            </tbody>
          </table> : null
        }
      </div>
    </Layout>
  )
})
