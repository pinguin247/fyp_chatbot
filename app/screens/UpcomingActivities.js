import React, {useState, useEffect} from 'react';
// import {FlatList, View, Text} from 'react-native';
import {FlatList, TouchableOpacity} from 'react-native-gesture-handler';
import {View, Text, SafeAreaView, Image} from 'react-native';
import Card from './Card';
import firestore from '@react-native-firebase/firestore';
import Login from './Login';

export default function UpcomingActivities({route, navigation}) {
  const {name, id} = route.params;
  const [upcomingActivities, setUpcomingActivities] = useState([]);
  const [activitiesNearMe, setActivitiesNearMe] = useState([]);

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

  const getActivitiesNearMe = async name => {
    try {
      listOfActivitiesNearMe = [];
      //   console.log('here: ', name);
      listOfActivitiesNearMe = await firestore()
        .collection('Users')
        .doc(name)
        .get()
        .then(function (doc) {
          return doc.data().ActivitiesNearMe; //must return variable, if not cannot access it outside of this block
        });

      setActivitiesNearMe([...listOfActivitiesNearMe]);
      //   console.log(upcomingActivities);
    } catch (e) {
      console.log('failed');
    }
  };

  getActivitiesNearMe(name);

  return (
    <SafeAreaView>
      <View style={{alignItems: 'center'}}>
        <Image
          source={require('../assets/images/sport.png')}
          style={{width: 90, height: 90}}></Image>
      </View>
      <View style={{alignItems: 'center'}}>
        <Text
          style={{
            fontSize: 20,
            fontWeight: '700',
            marginTop: 10,
            color: 'black',
          }}>
          Your upcoming activities
        </Text>
        <FlatList
          data={upcomingActivities}
          renderItem={({item}) => (
            <Card>
              <Text
                style={{
                  fontSize: 15,
                  color: 'black',
                }}>
                {item}
              </Text>
            </Card>
          )}
        />
      </View>

      <View style={{alignItems: 'center', marginTop: 10}}>
        <Text
          style={{
            fontSize: 20,
            fontWeight: '700',
            color: 'black',
          }}>
          Activities near you
        </Text>
        <Text
          style={{
            fontSize: 15,
            fontWeight: '500',
            color: 'black',
          }}>
          Note: All equipment will be provided by organizer.
        </Text>
        <FlatList
          data={activitiesNearMe}
          renderItem={({item}) => (
            <Card>
              <Text
                style={{
                  fontSize: 15,
                  color: 'black',
                }}>
                {item}
              </Text>
            </Card>
          )}
        />
      </View>
    </SafeAreaView>
  );
}
