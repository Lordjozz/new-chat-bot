import { view } from '@risingstack/react-easy-state';
import axios from 'axios';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useRouteMatch } from 'react-router';
import Layout from '../components/layout/layout';
import GameStore from '../stores/game';
import UserStore from '../stores/user';
import SendIcon from '@mui/icons-material/Send';
import me from '../images/me.jpeg';
import glass from '../images/glass.jpg';

export default view(function RoomPage() {
  const match = useRouteMatch();
  const chatRef = useRef(null);
  const [height, setHeight] = useState(0);
  const [screenChange, setScreenChange] = useState(false);
  const [messageRef, setMessageRef] = useState(null);

  const storedHeight = localStorage.getItem('height');
  const desktop = window.screen.width > 900;
  const headerHeight = 63.5;
  const messageBarHeight = desktop ? 128 : 100;
  const messageWindow = height - (headerHeight + messageBarHeight);
  const disableSubmit = !GameStore.messageContent;

  // could have a switch statement that gets the correct image
  // for the character from the url

  const chatRoom = GameStore?.game?.ChatRooms.find(
    (_) => _.Name === decodeURI(match.params.name)
  );

  const messages = GameStore?.messageHistory.filter(
    (_) => _.Room === chatRoom?.Name
  );

  const onRefChange = useCallback((ref) => {
    // trigger re-render on changes
    setMessageRef(ref);
  }, []);

  // on load scroll to bottom
  useEffect(
    function scrollToBottom() {
      if (messageRef) {
        messageRef.scrollTo({
          behavior: 'smooth',
          top: messageRef.scrollHeight,
        });
      }
    },
    [messageRef]
  );

  // set height in state
  useEffect(() => {
    if (storedHeight && Object.values(storedHeight).length > 0) {
      setHeight(JSON.parse(storedHeight));
    }

    if (chatRef.current) {
      localStorage.setItem(
        'height',
        JSON.stringify(chatRef.current.clientHeight)
      );
      setHeight(chatRef.current.clientHeight);
    }
  }, [screenChange, chatRef, storedHeight]);

  useEffect(() => {
    if (chatRoom && messages.length === 0) {
      chatRoom.InitialMessages.forEach((msg) => {
        GameStore.sendMessage(
          msg.Message,
          msg.From,
          true,
          chatRoom.Name,
          msg.Colour
        );
      });
    }
  }, [chatRoom]);

  // sets off update of height if tablet orientation changes
  useEffect(() => {
    window
      .matchMedia('(orientation: portrait)')
      .addEventListener('change', (m) => {
        if (m.matches) {
          setScreenChange(true);
        } else {
          setScreenChange(true);
        }
      });
    window
      .matchMedia('(orientation: landscape)')
      .addEventListener('change', (m) => {
        if (m.matches) {
          setScreenChange(true);
        } else {
          setScreenChange(false);
        }
      });
  }, [setScreenChange]);

  const getTranscript = () => {
    // axios.post(process.env.REACT_APP_GAME_API_ENDPOINT + 'transcript', {messages, email: UserStore.email}).then(e => {
    //   window.alert("We've sent you the chat history!")
    // }).catch(err => {
    //   window.alert('We weren\'t able to send you the email.')
    // })
  };

  const sendMessage = () => {
    GameStore.sendMessage(GameStore.messageContent, null, false, chatRoom.Name);
  };

  function renderMessages() {
    return messages.map((msg, index) => {
      const isLast = messages.length - 1 === index;
      const type = msg.From === UserStore.name ? 'you' : 'them';
      //const type = msg.From;
      return type === 'you' ? (
        <div key={msg.id} className={type}>
          {msg.Message}
        </div>
      ) : (
        <div key={msg.id} className={type}>
          {msg.messageType === 'image' ? (
            // src={msg.Message}
            <img className="messageImage" src={glass} alt="" />
          ) : (
            <div dangerouslySetInnerHTML={{ __html: msg.Message }} />
          )}
        </div>
      );
    });
  }

  return (
    <Layout>
      <div className="room" ref={chatRef}>
        <div className="header">
          <img className="characterImage" src={me} alt="Character profile " />
          <div className="characterName">{chatRoom?.Name}</div>
        </div>
        {/* <div>
          <button onClick={() => getTranscript()}>Get Transcription</button>
        </div> */}
        <div className="chat">
          <div className="messages">
            <div
              id="msgBox"
              ref={onRefChange}
              style={{
                maxHeight: `${messageWindow}px`,
                overflowY: 'scroll',
                display: 'flex',
                flexDirection: 'column',
                marginBottom: '65px',
              }}
            >
              {renderMessages()}
            </div>
          </div>
          <div className="messageWrap">
            <div className="message-input">
              <input
                type="text"
                placeholder="Type a message"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    sendMessage();
                  }
                }}
                onChange={(_) => (GameStore.messageContent = _.target.value)}
                value={GameStore.messageContent}
              />
              <div className="sendIconWrap">
                <SendIcon
                  style={{ fill: disableSubmit && 'lightGray' }}
                  disabled={disableSubmit}
                  onClick={() => !disableSubmit && sendMessage()}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
});
