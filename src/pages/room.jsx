import { view } from '@risingstack/react-easy-state'
import axios from 'axios'
import React, { useEffect } from 'react'
import { useRouteMatch } from 'react-router'
import Layout from '../components/layout/layout'
import GameStore from '../stores/game'
import UserStore from '../stores/user'

export default view(function RoomPage() {
  const match = useRouteMatch()

  const chatRoom = GameStore.game.ChatRooms.find(_ => _.Name === decodeURI(match.params.name))
  const messages = GameStore.messageHistory.filter(_ => _.Room === chatRoom.Name)

  useEffect(() => {
    if (messages.length === 0) {
      chatRoom.InitialMessages.forEach(msg => {
        GameStore.sendMessage(msg.Message, msg.From, true, chatRoom.Name, msg.Colour)
      })
    }
  }, []) // eslint-disable-line

  const getTranscript = () => {
    axios.post(process.env.REACT_APP_GAME_API_ENDPOINT + 'transcript', {messages, email: UserStore.email}).then(e => {
      window.alert("We've sent you the chat history!")
    }).catch(err => {
      window.alert('We weren\'t able to send you the email.')
    })
  }

  const sendMessage = () => GameStore.sendMessage(GameStore.messageContent, null, false, chatRoom.Name)

  return (
    <Layout>
      <div className="room">
        <div>
          <h1>{chatRoom.Name}</h1>
          <button onClick={() => getTranscript()}>Get Transcription</button>
        </div>
        <div className="chat">
          <div className="messages" style={{gridArea: 'a'}}>
            <div id="msgBox" style={{maxHeight: 500, overflowY: 'auto', display: 'flex', flexDirection: 'column'}}>
              {/* Chat History */}
              {
                messages.map(msg => {
                  const type = msg.From === UserStore.name ? 'you' : 'them'
                  return (
                    type === 'you' ? <div className={type}>
                      <strong style={{color: msg.Colour}}>{msg.From}</strong>
                      <p>{msg.Message}</p>
                    </div> : <div className={type}>
                      <strong style={{color: msg.Colour}}>{msg.From}</strong>
                      <div dangerouslySetInnerHTML={{__html: msg.Message}} />
                    </div>
                  )
                })
              }
            </div>
          </div>
          <div className="message-input" style={{gridArea: 'b'}}>
            {/* Input */}
            <input type="text" placeholder="Your message" onKeyPress={e => {console.log(e.key);if (e.key === 'Enter') {sendMessage()}}} onChange={_ => GameStore.messageContent = _.target.value} value={GameStore.messageContent} />
            <button onClick={() => sendMessage()}>Send</button>
          </div>
          <div className="users" style={{gridArea: 'c'}}>
            {/* Chat Members */}
            <h2>Users</h2>
            {
              chatRoom.Users.filter(user => !GameStore.left.filter(gs => gs.Room === chatRoom.Name).find(_ => _.Name = user.Name)).map(user => {
                return (<div>
                  <p><strong>Name:</strong> {user.Name}</p>
                  <p><strong>IP:</strong> {user.IP}</p>
                </div>)
              })
            }
            <div style={{backgroundColor: '#47ff51'}}>
              <p><strong>Your Name:</strong> {UserStore.name}</p>
              <p><strong>Your IP:</strong> 172.10.42.230</p>
            </div>
          </div>
        </div>
        
      </div>
    </Layout>
  )
})
