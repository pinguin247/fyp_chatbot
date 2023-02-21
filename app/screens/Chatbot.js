import React, {Component, useEffect, useState} from 'react';
import {View, Text, SafeAreaView} from 'react-native';
import {GiftedChat} from 'react-native-gifted-chat';
import {Dialogflow_V2} from 'react-native-dialogflow';
import {dialogflowConfig} from '../env';
import firestore from '@react-native-firebase/firestore';
import ReactNativeCalendarEvents from 'react-native-calendar-events';
import {create} from 'react-test-renderer';
import {firebase} from '@react-native-firebase/auth';

const botAvatar = require('../assets/images/mascot.png');

const BOT = {
  _id: 2,
  name: 'Mr Bot',
  avatar: botAvatar,
};

var exercise = '';

class Chatbot extends Component {
  // initial message. id is messages'. id is different from BOT's id and user's id
  state = {
    messages: [],
    id: 1,
    name: '',
  };

  async componentDidMount() {
    Dialogflow_V2.setConfiguration(
      dialogflowConfig.client_email,
      dialogflowConfig.private_key,
      Dialogflow_V2.LANG_ENGLISH_US,
      dialogflowConfig.project_id,
    );

    const {name, id} = this.props.route.params;
    console.log(this.props);

    // load exercise 1 based on medical condition
    // get medical condition
    console.log(name);
    medicalCondition = await firestore()
      .collection('Users')
      .doc(name)
      .get()
      .then(function (doc) {
        // console.log(doc.data().medicalCondition);
        return doc.data().medicalCondition; //must return variable, if not cannot access it outside of this block
      });

    console.log(medicalCondition);

    disability = await firestore()
      .collection('Users')
      .doc(name)
      .get()
      .then(function (doc) {
        // console.log(doc.data().medicalCondition);
        return doc.data().disability; //must return variable, if not cannot access it outside of this block
      });

    console.log(disability);

    const snapshot = await firestore()
      .collection(`Selection`)
      .doc(medicalCondition)
      .get()
      .then(function (doc) {
        return doc.data().disability;
      });

    exercise = snapshot[disability];
    // snapshot.docs.map(doc => doc.id)[0];

    if (snapshot.empty) {
      console.log('No matching documents.');
      return;
    }
    console.log(exercise);

    firestore()
      .collection('ChatbotHistory')
      .doc(id)
      .collection('Messages')
      .orderBy('createdAt', 'desc')
      .limit(15)
      .get()
      .then(snapshot => {
        let messages = snapshot.docs.map(doc => {
          const firebaseData = doc.data();

          const data = {
            _id: doc.id,
            text: doc.text,
            createdAt: new Date().getTime(),
            ...firebaseData,
          };

          if (!firebaseData.system) {
            data.user = {
              ...firebaseData.user,
              name: firebaseData.user.name,
            };
          }
          // console.log(data);
          return data;
        });

        // if user has use the bot before, load previous messages. else, load default message
        if (messages.length > 0) {
          this.setState({name, id, messages});
        } else {
          this.setState({
            name,
            id,
            messages: [
              {
                _id: 1,
                text: `Hello, ${this.props.route.params.name}. Let's do some ${exercise} today! It's great for ${medicalCondition} patients like yourself.`,
                createdAt: new Date().getTime(),
                user: BOT,
              },
            ],
          });
        }
      })
      .catch(function (err) {
        console.log(err);
      });

    firestore()
      .collection('ChatbotHistory')
      .doc(id)
      .collection('Messages')
      .add(
        (msg = {
          text: `Hello, ${this.props.route.params.name}. Let's do some ${exercise} today! It's great for ${medicalCondition} patients like yourself.`,
          createdAt: new Date().getTime(),
          user: BOT,
        }),
      );

    msg._id = this.state.messages.length + 1;

    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, [msg]),
    }));
  }

  handleGoogleResponse(result) {
    let text = result.queryResult.fulfillmentMessages[0].text.text[0];
    console.log('handleGoogleResponse: ' + text);

    this.sendBotResponse(text); //sends Dialogflow's response to the user
  }

  async createCalendarEvent() {
    const calendarStatus = await ReactNativeCalendarEvents.requestPermissions();

    if (calendarStatus) {
      console.log('Calendar permission status:', calendarStatus);
    }
    const newDate = new Date();
    newDate.setHours(newDate.getHours() + 2);

    ReactNativeCalendarEvents.saveEvent(exercise, {
      calendarId: '3',
      startDate: newDate.toISOString(),
      endDate: newDate.toISOString(),
      location: 'Punggol Park',
    })
      .then(value => {
        console.log('Event Id--->', value);
        return 1;
      })
      .catch(error => {
        console.log('Error: ', error);
      });

    // add to firestore
    console.log('Name in firestore: ' + this.props.route.params.name);
    await firestore()
      .collection('Users')
      .doc(this.props.route.params.name)
      .update({
        UpcomingActivities: firebase.firestore.FieldValue.arrayUnion(
          exercise +
            ' on ' +
            newDate.toDateString() +
            ' at ' +
            newDate.getHours() +
            ':' +
            newDate.getMinutes(),
        ),
      });
    // .get()
    // .then(function (doc) {

    //   return doc.data().medicalCondition; //must return variable, if not cannot access it outside of this block
    // })
  }

  // display DF's response to user
  sendBotResponse(text) {
    let msg = {
      text,
      createdAt: new Date().getTime(),
      user: BOT, // BOT will forward message to user
    };

    const {id} = this.props.route.params;
    firestore()
      .collection('ChatbotHistory')
      .doc(id)
      .collection('Messages')
      .add(msg);

    msg._id = this.state.messages.length + 1;

    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, [msg]),
    }));

    if (text.includes('What about')) {
      text = text.replace('What about ', '');
      text = text.replace(' instead?', '');
      exercise = text;
    }

    if (
      text == 'Great! Let me know how you feel after exercising.' ||
      text.includes("Let's get moving!")
    ) {
      success = this.createCalendarEvent();

      if (success) {
        msg = {
          text: `${exercise} added to calendar for ${
            new Date().getHours() + 2 + ':' + new Date().getMinutes()
          } successfully.`,
          createdAt: new Date().getTime(),
          user: BOT,
        };

        msg._id = this.state.messages.length + 1;

        this.setState(previousState => ({
          messages: GiftedChat.append(previousState.messages, [msg]),
        }));
      }
    }
  }

  // when user sends a message, chatbot will send to DF
  onSend(messages = []) {
    // appends new message to array with all previous messages so that we can keep track.
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }));

    let text = messages[0].text; //what user types. will be forwarded to Dialogflow

    const {id, name} = this.props.route.params;

    firestore()
      .collection('ChatbotHistory')
      .doc(id)
      .collection('Messages')
      .add({
        text,
        createdAt: new Date().getTime(),
        user: {
          _id: 1,
          name: name,
        },
      });

    const contexts = [
      {
        name: 'username',
        lifespan: 10,
        parameters: {
          name: name,
        },
      },
    ];
    Dialogflow_V2.setContexts(contexts);

    // Dialogflow will select response to send to BOT. stores response inside variable "result"
    Dialogflow_V2.requestQuery(
      text,
      result => this.handleGoogleResponse(result),
      error => console.log(error),
    );
  }

  onQuickReply(quickReply) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, quickReply),
    }));

    let message = quickReply[0].value;

    Dialogflow_V2.requestQuery(
      message,
      result => this.handleGoogleResponse(result),
      error => console.log(error),
    );
  }

  render() {
    return (
      <View style={{flex: 1, backgroundColor: '#fff'}}>
        <GiftedChat
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          // onQuickReply = user chooses options, instead of replying
          onQuickReply={quickReply => this.onQuickReply(quickReply)}
          user={{_id: 1}}
        />
      </View>
    );
  }
}

export default Chatbot;
