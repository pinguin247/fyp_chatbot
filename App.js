import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  Button,
  Alert,
} from 'react-native';
import Login from './app/screens/Login';
import Chatbot from './app/screens/Chatbot';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import 'react-native-gesture-handler';
import auth from '@react-native-firebase/auth';
import {
  GoogleSignin,
  GoogleSigninButton,
} from '@react-native-google-signin/google-signin';

import messaging from '@react-native-firebase/messaging';
import {GiftedChat} from 'react-native-gifted-chat';
import PushNotification from 'react-native-push-notification';

import ArticleFeed from './app/screens/ArticleFeed';
import ArticleDetails from './app/screens/ArticleDetails';
import UpcomingActivities from './app/screens/UpcomingActivities';

const Stack = createStackNavigator();

const App = () => {
  const [messages, setMessages] = useState([]);

  async function requestUserPermission() {
    const authorizationStatus = await messaging().requestPermission();

    if (authorizationStatus) {
      console.log('Permission status:', authorizationStatus);
    }
  }

  requestUserPermission();

  // Register background handler
  // Get the notification
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    // Extract the body
    let message_body = remoteMessage.notification.body;
    // Extract the title
    let message_title = remoteMessage.notification.title;
    // Extract the notification image
    let avatar = remoteMessage.notification.android.imageUrl;

    // Add the notification to the messages array
    setMessages(messages =>
      GiftedChat.append(messages, {
        _id: Math.round(Math.random() * 1000000),
        text: message_body,
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'PartyB',
          avatar: avatar,
        },
      }),
    );

    // Send a notification alert
    Alert.alert(message_title, message_body);
  });

  useEffect(() => {
    PushNotification.configure({
      // (optional) Called when Token is generated (iOS and Android)
      onRegister: function (token) {
        console.log('TOKEN:', token);
      },
      // (required) Called when a remote or local notification is opened or received
      onNotification: function (notification) {
        console.log('REMOTE NOTIFICATION ==>', notification);
        // process the notification here
      },
      popInitialNotification: true,
      requestPermissions: true,
    });

    // Get the notification message
    const subscribe = messaging().onMessage(async remoteMessage => {
      // Get the message body
      let message_body = remoteMessage.notification.body;

      // Get the message title
      let message_title = remoteMessage.notification.title;

      // Get message image
      let avatar = remoteMessage.notification.android.imageUrl;

      console.log(message_body);

      // Append the message to the current messages state
      setMessages(messages =>
        GiftedChat.append(messages, {
          _id: Math.round(Math.random() * 1000000),
          text: message_body,
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'PartyB',
            avatar: avatar,
          },
        }),
      );

      // Show an alert to the user
      Alert.alert(message_title, message_body);
    });

    return subscribe;
  }, [messages]);

  return (
    <>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Login"
            component={Login}
            options={{title: 'Home'}}
          />
          <Stack.Screen
            name="Chatbot"
            component={Chatbot}
            options={{title: 'Chat Room'}}
          />
          <Stack.Screen
            name="ArticleFeed"
            component={ArticleFeed}
            options={{title: 'Article feed'}}
          />
          <Stack.Screen
            name="ArticleDetails"
            component={ArticleDetails}
            options={{title: 'Article Details'}}
          />
          <Stack.Screen
            name="UpcomingActivities"
            component={UpcomingActivities}
            options={{title: 'Schedule'}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
};

export default App;
