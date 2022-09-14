import { view } from '@risingstack/react-easy-state';
import axios from 'axios';
import React, { useEffect } from 'react';
import { useRouteMatch } from 'react-router';
import Layout from '../components/layout/layout';
import GameStore from '../stores/game';
import UserStore from '../stores/user';
import SendIcon from '@mui/icons-material/Send';

export default view(function RoomPage() {
  const match = useRouteMatch();

  // const chatRoom = GameStore.game.ChatRooms.find(
  //   (_) => _.Name === decodeURI(match.params.name)
  // );
  // const messages = GameStore.messageHistory.filter(
  //   (_) => _.Room === chatRoom.Name
  // );

  const chatRoom = { Name: 'Klaus' };

  const messages = [
    { id: 23, From: 'you', Message: 'Hey there' },
    { id: 23, From: '', Message: 'Im klaus' },
  ];

  // useEffect(() => {
  //   if (messages.length === 0) {
  //     chatRoom.InitialMessages.forEach((msg) => {
  //       GameStore.sendMessage(
  //         msg.Message,
  //         msg.From,
  //         true,
  //         chatRoom.Name,
  //         msg.Colour
  //       );
  //     });
  //   }
  // }, []); // eslint-disable-line

  const getTranscript = () => {
    // axios.post(process.env.REACT_APP_GAME_API_ENDPOINT + 'transcript', {messages, email: UserStore.email}).then(e => {
    //   window.alert("We've sent you the chat history!")
    // }).catch(err => {
    //   window.alert('We weren\'t able to send you the email.')
    // })
  };

  const sendMessage = () => console.log('message');
  // GameStore.sendMessage(GameStore.messageContent, null, false, chatRoom.Name);

  function renderMessages() {
    return messages.map((msg) => {
      // const type = msg.From === UserStore.name ? 'you' : 'them';
      const type = msg.From;
      return type === 'you' ? (
        <div className={type}>
          <p>{msg.Message}</p>
        </div>
      ) : (
        <div className={type}>
          <div dangerouslySetInnerHTML={{ __html: msg.Message }} />
        </div>
      );
    });
  }

  return (
    <Layout>
      <div className="room">
        <div className="header">{chatRoom.Name}</div>
        {/* <div>
          <button onClick={() => getTranscript()}>Get Transcription</button>
        </div> */}
        <div className="chat">
          <div className="messages" style={{ gridArea: 'a' }}>
            <div
              id="msgBox"
              style={{
                maxHeight: 500,
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {renderMessages()}
            </div>
          </div>
          <div className="messageWrap">
            {' '}
            <div className="message-input" style={{ gridArea: 'b' }}>
              <input
                type="text"
                placeholder="Type message"
                onKeyPress={(e) => {
                  console.log(e.key);
                  if (e.key === 'Enter') {
                    sendMessage();
                  }
                }}
                onChange={(_) => (GameStore.messageContent = _.target.value)}
                value={GameStore.messageContent}
              />
              <div className="sendIconWrap">
                <SendIcon onClick={() => sendMessage()} />
              </div>
            </div>
          </div>

          {/* <div className="users" style={{ gridArea: 'c' }}> */}
          {/* Chat Members */}
          {/* <h2>Users</h2>
            {chatRoom.Users.filter(
              (user) =>
                !GameStore.left
                  .filter((gs) => gs.Room === chatRoom.Name)
                  .find((_) => (_.Name = user.Name))
            ).map((user) => {
              return (
                <div>
                  <p>
                    <strong>Name:</strong> {user.Name}
                  </p>
                  <p>
                    <strong>IP:</strong> {user.IP}
                  </p>
                </div>
              );
            })} */}
          {/* <div style={{ backgroundColor: '#47ff51' }}>
              <p>
                <strong>Your Name:</strong> {UserStore.name}
              </p>
              <p>
                <strong>Your IP:</strong> 172.10.42.230
              </p>
            </div> */}
          {/* </div> */}
        </div>
      </div>
    </Layout>
  );
});
