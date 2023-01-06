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

const Stack = createStackNavigator();

const App = () => {
  const [messages, setMessages] = useState([]);

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
    // Get the notification message
    const subscribe = messaging().onMessage(async remoteMessage => {
      // Get the message body
      let message_body = remoteMessage.notification.body;

      // Get the message title
      let message_title = remoteMessage.notification.title;

      // Get message image
      let avatar = remoteMessage.notification.android.imageUrl;

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
            options={{title: 'Login'}}
          />
          <Stack.Screen
            name="Chatbot"
            component={Chatbot}
            options={{title: 'Chat Room'}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
};

export default App;
