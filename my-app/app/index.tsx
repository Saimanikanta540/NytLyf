// App Entry - Redirect to appropriate screen
import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { getToken } from '../src/api/authStorage';

export default function Index() {
  const [ready, setReady] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    getToken()
      .then(token => {
        setLoggedIn(!!token);
        setReady(true);
      })
      .catch(() => setReady(true));
  }, []);

  if (!ready) return null;

  return loggedIn ? <Redirect href="/(tabs)/home" /> : <Redirect href="/(auth)/welcome" />;
}
