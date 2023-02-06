import React, {useState, useEffect} from 'react';
// import {FlatList, View, Text} from 'react-native';
import {FlatList, TouchableOpacity} from 'react-native-gesture-handler';
import {View, Text} from 'react-native';
import Card from './Card';
import firestore from '@react-native-firebase/firestore';
import Login from './Login';

export default function UpcomingActivities({route, navigation}) {
  const {name, id} = route.params;
  const [upcomingActivities, setUpcomingActivities] = useState([]);

  const getUpcomingActivities = async name => {
    try {
      listOfUpcomingActivities = [];
      //   console.log('here: ', name);
      listOfUpcomingActivities = await firestore()
        .collection('Users')
        .doc(name)
        .get()
        .then(function (doc) {
          return doc.data().UpcomingActivities; //must return variable, if not cannot access it outside of this block
        });

      setUpcomingActivities([...listOfUpcomingActivities]);
      //   console.log(upcomingActivities);
    } catch (e) {
      console.log('failed');
    }
  };

  getUpcomingActivities(name);

  return (
    <View>
      <FlatList
        data={upcomingActivities}
        renderItem={({item}) => (
          <Card>
            <Text>{item}</Text>
          </Card>
        )}
      />
    </View>
  );
}
