import { view } from '@risingstack/react-easy-state';
import React, { useEffect } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import RoomPage from './pages/Room';
import UserStore from './stores/user';

export default view(function Router() {
  useEffect(() => {
    console.log('%cRouter - Loading Game', 'font-weight: 700; color: orange;');
    const cachedLocal = localStorage.getItem('user-stores');
    if (cachedLocal) {
      const parsedUserStore = JSON.parse(cachedLocal);
      Object.keys(parsedUserStore).forEach(
        (_) => (UserStore[_] = parsedUserStore[_])
      );

      const chatBox = document.querySelector('#msgBox');
      // setTimeout(() => {
      //   chatBox.scrollTo({ behavior: "smooth", top: chatBox.scrollHeight });
      // }, 500);
    }
  }, []);
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" component={RoomPage} />
        {/* <Route path="/rooms" component={RoomsPage} /> */}
        {/* <Route path="/" component={LoginPage} /> */}
        {/* { !GameStore.game ? <Redirect to="/" /> : null } */}
      </Switch>
    </BrowserRouter>
  );
});
