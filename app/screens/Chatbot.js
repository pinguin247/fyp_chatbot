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

const BOT = {
  _id: 2,
  name: 'Mr Bot',
  avatar: botAvatar,
};

class Chatbot extends Component {
  // initial message. id is messages'. id is different from BOT's id and user's id
  state = {
    messages: [],
    id: 1,
    name: '',
  };

  componentDidMount() {
    Dialogflow_V2.setConfiguration(
      dialogflowConfig.client_email,
      dialogflowConfig.private_key,
      Dialogflow_V2.LANG_ENGLISH_US,
      dialogflowConfig.project_id,
    );

    const {name, id} = this.props.route.params;
    console.log(this.props);

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
                _id: 2,
                text: `Hello, ${this.props.route.params.name}. My name is Mr Bot`,
                createdAt: new Date().getTime(),
                user: BOT,
              },
              {
                _id: 1,
                text: 'Hi',
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
  }

  var _signIn = async () => {
    console.log('signIn');
    try {
      console.log('signIn');
      await GoogleSignin.hasPlayServices();
      const {accessToken, idToken} = await GoogleSignin.signIn();
      setLoggedIn(true);
      const credential = auth.GoogleAuthProvider.credential(
        idToken,
        accessToken,
      );
      await auth().signInWithCredential(credential);
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
