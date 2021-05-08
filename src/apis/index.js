import { auth, firebase } from './firebase';

export async function login(data) {
  const url = `${process.env.REACT_APP_SERVER_URL}/auth/login`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  return response;
}

export async function googleLogin() {
  try {
    const provider = new firebase.auth.GoogleAuthProvider();
    await auth.signInWithPopup(provider);

    const token = await auth?.currentUser?.getIdToken(true);

    if (token) {
      const response = await login({ id_token: token });
      const responseBody = await response.json();

      localStorage.setItem('accessToken', responseBody.data.accessToken);

      await firebase.auth().signOut();

      return responseBody;
    } else {
      throw new Error('login fail');
    }
  } catch (err) {
    throw new Error('login fail');
  }
}
