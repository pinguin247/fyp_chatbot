import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  Button,
  ImageBackground,
  Image,
} from 'react-native';
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
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: '700',
                  color: 'black',
                }}>
                Welcome {user.displayName}
              </Text>
              {/* <Button
                title="Chat Room"
                onPress={() =>
                  navigation.navigate('Chatbot', {
                    name: user.displayName,
                    id: user.uid,
                  })
                }
              /> */}
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('Chatbot', {
                    name: user.displayName,
                    id: user.uid,
                  })
                }>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: 20,
                    backgroundColor: '#FFFFFF',
                    borderRadius: 20,
                    height: 70,
                    marginTop: 20,
                    width: 180,
                  }}>
                  <ImageBackground
                    source={require('../assets/images/chat.png')}
                    style={{width: 50, height: 50}}></ImageBackground>

                  <Text
                    style={{
                      marginLeft: 15,
                      fontSize: 15,
                      fontWeight: '500',
                      color: 'black',
                    }}>
                    Chat Room
                  </Text>
                </View>
              </TouchableOpacity>
              {/* <Button
                title="Article feed"
                onPress={() =>
                  navigation.navigate('ArticleFeed', {
                    name: user.displayName,
                    id: user.uid,
                  })
                }
              /> */}
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('ArticleFeed', {
                    name: user.displayName,
                    id: user.uid,
                  })
                }>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: 20,
                    backgroundColor: '#FFFFFF',
                    borderRadius: 20,
                    height: 70,
                    width: 180,
                    marginTop: 20,
                  }}>
                  <ImageBackground
                    source={require('../assets/images/publication.png')}
                    style={{width: 50, height: 50}}></ImageBackground>

                  <Text
                    style={{
                      marginLeft: 15,
                      fontSize: 15,
                      fontWeight: '500',
                      color: 'black',
                    }}>
                    Article Feed
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('UpcomingActivities', {
                    name: user.displayName,
                    id: user.uid,
                  })
                }>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: 20,
                    backgroundColor: '#FFFFFF',
                    borderRadius: 20,
                    height: 70,
                    width: 180,
                    marginTop: 20,
                  }}>
                  <ImageBackground
                    source={require('../assets/images/upcoming.png')}
                    style={{width: 50, height: 50}}></ImageBackground>

                  <Text
                    style={{
                      marginLeft: 15,
                      fontSize: 15,
                      fontWeight: '500',
                      color: 'black',
                    }}>
                    Schedule
                  </Text>
                </View>
              </TouchableOpacity>

              {/* <Button
                title="Upcoming activities"
                onPress={() =>
                  navigation.navigate('UpcomingActivities', {
                    name: user.displayName,
                    id: user.uid,
                  })
                }
              /> */}
              {/* <Button onPress={signOut} title="Logout" color="red" /> */}
              <TouchableOpacity onPress={signOut}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: 20,
                    backgroundColor: '#FFFFFF',
                    borderRadius: 20,
                    height: 70,
                    width: 180,
                    marginTop: 20,
                  }}>
                  <ImageBackground
                    source={require('../assets/images/logout.png')}
                    style={{width: 50, height: 50}}></ImageBackground>
                  <Text
                    style={{
                      marginLeft: 15,
                      fontSize: 15,
                      fontWeight: '500',
                      color: 'black',
                    }}>
                    Logout
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          ) : (
            <View
              style={{
                fontSize: 20,
                fontWeight: '500',
                color: 'black',
                alignItems: 'center',
              }}>
              <View style={{alignItems: 'center', marginBottom: 20}}>
                <Image
                  source={require('../assets/images/healthy.png')}
                  style={{width: 90, height: 90, marginBottom: 10}}></Image>
              </View>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: '500',
                  color: 'black',
                  alignContent: 'center',
                }}>
                HealthBoost
              </Text>
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: '400',
                  color: 'black',
                  alignContent: 'center',
                }}>
                Your one stop app to keep fit
              </Text>
              <TouchableOpacity onPress={_signIn}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: '#FFFFFF',
                    borderRadius: 20,
                    height: 70,
                    marginTop: 20,
                    width: 220,
                  }}>
                  <ImageBackground
                    source={require('../assets/images/login-.png')}
                    style={{width: 50, height: 50}}></ImageBackground>

                  <Text
                    style={{
                      marginLeft: 15,
                      fontSize: 15,
                      fontWeight: '500',
                      color: 'black',
                    }}>
                    Login using Google
                  </Text>
                </View>
              </TouchableOpacity>
              {/* <Button
                onPress={_signIn}
                title="Login using Google"
                color="red"></Button> */}
            </View>
          )}
        </View>
      </SafeAreaView>
    </>
  );
}
