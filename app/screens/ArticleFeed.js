import React, {useState} from 'react';
// import {FlatList, View, Text} from 'react-native';
import {FlatList, TouchableOpacity} from 'react-native-gesture-handler';
import {View, Text} from 'react-native';
import Card from './Card';

export default function ArticleFeed({navigation}) {
  const [reviews, setReviews] = useState([
    {
      title: 'Easy 5 steps stretches',
      author: 'John Doe',
      date: '1 January 2023',
    },
    {
      title: 'Why you should exercise',
      author: 'Mary Smith',
      date: '22 December 2022',
    },
    {
      title: '5 quick and easy nutritious meals you can make',
      author: 'Jerry Well',
      date: '1 November 2022',
    },
  ]);

  return (
    <View>
      <FlatList
        data={reviews}
        renderItem={({item}) => (
          <TouchableOpacity
            onPress={() => navigation.navigate('ReviewDetails', item)}>
            <Card>
              <Text>{item.title}</Text>
            </Card>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
