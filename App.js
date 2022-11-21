import React, {useState, useEffect} from 'react';
import {SafeAreaView, Text, TouchableOpacity, View, Button} from 'react-native';
import Login from './app/screens/Login';
import Chatbot from './app/screens/Chatbot';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import 'react-native-gesture-handler';
import auth from '@react-native-firebase/auth';
import {
  GoogleSignin,
  GoogleSigninButton,
} from '@react-native-google-signin/google-signin';

const Stack = createStackNavigator();

const App = () => {
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
