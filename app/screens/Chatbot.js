import React, {Component, useEffect, useState} from 'react';
import {View, Text, SafeAreaView} from 'react-native';
import {GiftedChat} from 'react-native-gifted-chat';
import {Dialogflow_V2} from 'react-native-dialogflow';
import {dialogflowConfig} from '../env';
import firestore from '@react-native-firebase/firestore';
import ReactNativeCalendarEvents from 'react-native-calendar-events';
import {create} from 'react-test-renderer';
import {firebase} from '@react-native-firebase/auth';

const botAvatar = require('../assets/images/jjlin.png');

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
    //console.log(this.props);

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

    //load tracker info with the most recent date
    const userid = 212932;
    const dateString = "2024-06-14T06:44:44+0800";
    const now = new Date(dateString);
    const sevenDaysAgo = new Date(now.setDate(now.getDate() - 7));
    const querySnapshot = await firestore()
      .collection('tracker')
      .where('startDate', '>=', sevenDaysAgo.toISOString())
      .orderBy('startDate', 'desc')
      .get();

    //data of past 7 days
    const trackerData = querySnapshot.docs.map(doc => doc.data());
    console.log(trackerData)

    // Determine the intervention message
    const interventionMessage = this.determineIntervention(trackerData);

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
      .collection('Selection')
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
                {
                  _id: 2,
                  text: interventionMessage,
                  createdAt: new Date().getTime(),
                  user: BOT,
                }
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

  firestore()
    .collection('ChatbotHistory')
    .doc(id)
    .collection('Messages')
    .add(
      (msg = {
        text: interventionMessage,
        createdAt: new Date().getTime(),
        user: BOT,
      }),
    );


    msg._id = this.state.messages.length + 2;

    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, [msg]),
    }));
  }

// Determine Intervention to send to user
determineIntervention(data) {
  const dateString = "2024-06-17T06:44:44+0800";
  const now = new Date(dateString);
  let interventions = [];

  if (data.length === 0) {
    return "We noticed you have not clocked any exercise. How about going for a 15 minute briskwalk today after dinner?";
  }

  //====Frequency====
  // Filter out entries with zero duration
  const validExercises = data.filter(entry => entry.duration > 0);
  if (validExercises.length === 0) {
    return "We noticed you have not clocked any exercise. How about going for a 15 minute briskwalk today after dinner?";
  }

  const lastExerciseDate = new Date(validExercises[0].startDate);

  // Calculate the difference in milliseconds between now and the last exercise date
  const msDiff = now.getTime() - lastExerciseDate.getTime();  // Difference in milliseconds
  const daysSinceLastExercise = Math.floor(msDiff / (1000 * 60 * 60 * 24));  // Convert milliseconds to days

  // Log the days since last exercise
  console.log("Days Since Last Exercise:", daysSinceLastExercise);

  if (daysSinceLastExercise === 1) {
    interventions.push("We noticed no exercise was clocked yesterday. How about going for a 15 minute briskwalk today after dinner? You are ___ minutes away from the total MVPA goal today.");
  } else if (daysSinceLastExercise >= 2 && daysSinceLastExercise <= 5) {
    interventions.push("We noticed you have not clocked any exercise for the past 2 days. If you skip exercise for more than 2 consecutive days, you may lose the health benefits of previous days of exercise! How about going for a briskwalk this evening? 15 minutes is all you need!");
  } else if (daysSinceLastExercise > 5) {
    interventions.push("We noticed you have not clocked any exercise over the past 5 days. Let us know if you have any issues. You can reach out to us through this message.");
  } else {
    interventions.push("WOWW SSSLAYYYY");
  }

  return interventions.join("\n");
}


handleGoogleResponse(result) {
  // Check if the result and fulfillmentMessages exist before trying to access text
  if (result && result.queryResult && result.queryResult.fulfillmentMessages) {
    let text = result.queryResult.fulfillmentMessages[0].text.text[0];
    console.log('handleGoogleResponse: ' + text);
    this.sendBotResponse(text); //sends Dialogflow's response to the user
  } else {
    // Log an error or handle the absence of data gracefully
    console.error('Failed to receive a valid response from Dialogflow:', result);
    this.sendBotResponse("Sorry, I couldn't fetch the details. Please try again."); // Send a fallback message
  }
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
