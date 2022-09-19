import { view } from '@risingstack/react-easy-state';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useRouteMatch } from 'react-router';
import Layout from '../components/layout/layout';
import GameStore from '../stores/game';
import UserStore from '../stores/user';
import SendIcon from '@mui/icons-material/Send';
import me from '../images/me.jpeg';

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

  const sendMessage = () => {
    GameStore.sendMessage(GameStore.messageContent, null, false, chatRoom.Name);
  };

  function renderMessages() {
    return messages.map((msg) => {
      const type = msg.From === UserStore.name ? 'you' : 'them';
      return type === 'you' ? (
        <div key={msg.id} className={type}>
          {msg.Message}
        </div>
      ) : (
        <div key={msg.id} className={type}>
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
      <div className="room" ref={chatRef}>
        <div className="header">
          <img className="characterImage" src={me} alt="Character profile " />
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
