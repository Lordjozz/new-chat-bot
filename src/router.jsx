import { view } from '@risingstack/react-easy-state';
import React, { useEffect } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import RoomPage from './pages/room';
import UserStore from './stores/user';

export default view(function Router() {
  useEffect(() => {
    const cachedLocal = localStorage.getItem('user-stores');
    if (cachedLocal) {
      const parsedUserStore = JSON.parse(cachedLocal);

      Object.keys(parsedUserStore).forEach(
        (_) => (UserStore[_] = parsedUserStore[_])
      );
    }
  }, []);

  return (
    <BrowserRouter>
      <Switch>
        <Route path="/rooms/:name" component={RoomPage} />
      </Switch>
    </BrowserRouter>
  );
});
