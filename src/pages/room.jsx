import { view } from '@risingstack/react-easy-state';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useRouteMatch } from 'react-router';
import Layout from '../components/layout/layout';
import GameStore from '../stores/game';
import UserStore from '../stores/user';
import SendIcon from '@mui/icons-material/Send';

export default view(function RoomPage() {
  const match = useRouteMatch();
  const chatRef = useRef(null);
  const [height, setHeight] = useState(0);
  const headerHeight = 63.5;
  const messageBarHeight = 74;
  const messageWindow = height - (headerHeight + messageBarHeight);

  // const chatRoom = GameStore.game.ChatRooms.find(
  //   (_) => _.Name === decodeURI(match.params.name)
  // );
  // const messages = GameStore.messageHistory.filter(
  //   (_) => _.Room === chatRoom.Name
  // );

  useEffect(() => {
    if (chatRef.current) {
      setHeight(chatRef.current.clientHeight);
    }
  }, []);

  // on init, scroll to bottom
  // receive or type new message then scroll to bottom

  console.log('HEIGHT', height);

  const chatRoom = { Name: 'Klaus' };

  const messages = [
    { id: 23, From: 'you', Message: 'Hey Klaus' },
    {
      id: 25,
      From: 'them',
      Message:
        "It sounds like you don't know how I was being blackmailed. I need to know I can trust you. I won't be telling you anything unless you give me a bit more information about how you figured out how I could be blackmailed",
    },
    {
      id: 26,
      From: 'you',
      Message:
        'I dont know what you mean, can you please explain what I should say to you',
    },
    {
      id: 27,
      From: 'them',
      Message:
        "It sounds like you don't know how I was being blackmailed. I need to know I can trust you. I won't be telling you anything unless you give me a bit more information about how you figured out how I could be blackmailed",
    },
    {
      id: 28,
      From: 'you',
      Message:
        'you keep saying thatbut.I dont know what you mean, can you please explain what I should say to you',
    },
    {
      id: 29,
      From: 'them',
      Message:
        "It sounds like you don't know how I was being blackmailed. I need to know I can trust you. I won't be telling you anything unless you give me a bit more information about how you figured out how I could be blackmailed",
    },
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
        <div className={type}>{msg.Message}</div>
      ) : (
        <div className={type}>
          <div dangerouslySetInnerHTML={{ __html: msg.Message }} />
        </div>
      );
    });
  }

  return (
    <Layout>
      <div className="room" ref={chatRef}>
        <div className="header">{chatRoom.Name}</div>
        {/* <div>
          <button onClick={() => getTranscript()}>Get Transcription</button>
        </div> */}
        <div className="chat">
          <div className="messages">
            <div
              id="msgBox"
              style={{
                maxHeight: messageWindow,
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                marginBottom: '65px',
              }}
            >
              {renderMessages()}
            </div>
          </div>
          <div className="messageWrap">
            {' '}
            <div className="message-input">
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
        </div>
      </div>
    </Layout>
  );
});
