import React, {useState, useEffect} from 'react';
import {SafeAreaView, Text, TouchableOpacity, View, Button} from 'react-native';
import auth from '@react-native-firebase/auth';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';

export default function Login({navigation}) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState([]);

  useEffect(() => {
    GoogleSignin.configure({
      scopes: ['email'],
      webClientId:
        '1068011813609-aejjl6h6b4ia9h7tdgtjoaanodpr8c5o.apps.googleusercontent.com',
      offlineAccess: true,
    });
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    console.log('useEffect');
    return subscriber;
  });

  // keep track of user's sign in status
  function onAuthStateChanged(user) {
    setUser(user);
    console.log('onAuthStateChanged');
    console.log(user);
    if (user) setLoggedIn(true); // if user is logged in, set login to true.
  }

  var _signIn = async () => {
    // console.log('signIn');
    try {
      console.log('signIn');
      await GoogleSignin.hasPlayServices();
      const {accessToken, idToken} = await GoogleSignin.signIn(); //problem here. doesn't wait
      console.log('after googlesignin.signin');
      setLoggedIn(true);
      console.log('after setloggedin');
      const credential = auth.GoogleAuthProvider.credential(
        idToken,
        accessToken,
      );

      const randomVar = await auth().signInWithCredential(credential);
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        alert('Cancel');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        alert('Sign in in progress');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        alert('PLAY_SERVICES_NOT_AVAILABLE');
      } else {
      }
    }
    console.log('signIn Success');
  };

  var signOut = async () => {
    try {
      console.log('begin signOut');
      // await GoogleSignin.revokeAccess();
      // console.log('middle signOut');
      await GoogleSignin.signOut();
      console.log('after signOut');
      auth()
        .signOut()
        .then(() => alert('You are signed out.'));
      setLoggedIn(false);
    } catch (error) {
      console.log(error);
    }
  };

  const LoginFailure = response => {
    console.log(response);
    console.log('response');
    swal('Login fail');
  };

  return (
    <>
      <SafeAreaView>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            height: 500,
          }}>
          {user ? (
            <View style={{alignItems: 'center'}}>
              <Text>Welcome {user.displayName}</Text>
              <Button
                title="Go to Chat Room"
                onPress={() =>
                  navigation.navigate('Chatbot', {
                    name: user.displayName,
                    id: user.uid,
                  })
                }
              />
              <Button
                title="Article feed"
                onPress={() =>
                  navigation.navigate('ArticleFeed', {
                    name: user.displayName,
                    id: user.uid,
                  })
                }
              />
              <Button onPress={signOut} title="Logout" color="red" />
            </View>
          ) : (
            <View>
              <Text>Please sign in to use the Chatbot</Text>
              <Button
                onPress={_signIn}
                title="Login using Google"
                color="red"></Button>
            </View>
          )}
        </View>
      </SafeAreaView>
    </>
  );
}
