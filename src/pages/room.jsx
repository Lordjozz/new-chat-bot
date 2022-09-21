import { view } from '@risingstack/react-easy-state';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useRouteMatch } from 'react-router';
import Layout from '../components/layout/layout';
import GameStore from '../stores/game';
import UserStore from '../stores/user';
import SendIcon from '@mui/icons-material/Send';
import useSound from 'use-sound';
import lowpop from '../sounds/lowpop.wav';

export default view(function RoomPage() {
  const match = useRouteMatch();
  const [height, setHeight] = useState(0);
  const [screenChange, setScreenChange] = useState(false);
  const [messageRef, setMessageRef] = useState(null);

  const [playAlert] = useSound(lowpop);

  const storedHeight = localStorage.getItem('height');
  const desktop = window.screen.width > 900;
  const headerHeight = 63.5;
  const messageBarHeight = desktop ? 120 : 165;
  const messageWindow = height - (headerHeight + messageBarHeight);
  const disableSubmit = !GameStore.messageContent;
  const storedCount = localStorage.getItem('messageCount');
  const isMobile = window.screen.width < 576;

  const chatRoom = GameStore?.game?.ChatRooms.find(
    (_) => _.Name === decodeURI(match.params.name)
  );
  const messages = GameStore?.messageHistory.filter(
    (_) => _.Room === chatRoom?.Name
  );
  const lastMessage = messages[messages.length - 1];
  const profilePic = GameStore?.game?.Styling?.CharacterPicture;

  // new message check so we can play alert sound
  // as need to use hook
  useEffect(
    function initMessages() {
      if (+storedCount === messages.length - 1 && lastMessage?.From) {
        playAlert();
      }
      if (chatRoom && messages.length > 0) {
        localStorage.setItem('messageCount', JSON.stringify(messages.length));
      }
    },
    [chatRoom, messages, lastMessage, playAlert, storedCount]
  );

  const onRefChange = useCallback((ref) => {
    // trigger re-render on changes.
    setMessageRef(ref);
  }, []);

  const onChatRefChange = useCallback(
    (ref) => {
      if (ref) {
        localStorage.setItem(
          'height',
          JSON.stringify(ref.getBoundingClientRect().height)
        );
        setHeight(ref.getBoundingClientRect().height);
      }
    },
    [screenChange]
  );

  // on load scroll to bottom
  useEffect(
    function scrollToBottom() {
      if (messageRef) {
        messageRef.scrollTo({
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
  }, [storedHeight]);

  useEffect(() => {
    if (chatRoom && messages.length === 0) {
      chatRoom.InitialMessages.forEach((msg) => {
        GameStore.sendMessage(
          msg.Message,
          msg.From,
          true,
          chatRoom.Name,
          msg.Colour,
          msg.Delay,
          msg.messageType
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

  const sendMessage = () => {
    GameStore.sendMessage(GameStore.messageContent, null, false, chatRoom.Name);
  };

  function renderMessages() {
    return messages.map((msg, index) => {
      const type = msg.From === UserStore.name ? 'you' : 'them';
      return type === 'you' ? (
        <div key={index} className={type}>
          {msg.Message}
        </div>
      ) : (
        <div key={index} className={type}>
          {msg.messageType === 'image' ? (
            <img className="messageImage" src={msg.Message} alt="" />
          ) : (
            <div dangerouslySetInnerHTML={{ __html: msg.Message }} />
          )}
        </div>
      );
    });
  }

  return (
    <Layout>
      <div className="room" ref={onChatRefChange}>
        <div className="header">
          <img
            className="characterImage"
            src={profilePic}
            alt="Character profile "
          />
          <div className="characterName">{chatRoom?.Name}</div>
        </div>
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
                marginBottom: isMobile ? '130px' : '65px',
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
