import React, {useState} from 'react';
// import {FlatList, View, Text} from 'react-native';
import {FlatList, TouchableOpacity} from 'react-native-gesture-handler';
import {View, Text, Image} from 'react-native';
import Card from './Card';
import firestore from '@react-native-firebase/firestore';

export default function ArticleFeed({navigation}) {
  const [reviews, setReviews] = useState([
    // {
    //   title: 'Easy 5 steps stretches',
    //   author: 'John Doe',
    //   date: '1 January 2023',
    // },
    // {
    //   title: 'Why you should exercise',
    //   author: 'Mary Smith',
    //   date: '22 December 2022',
    // },
    // {
    //   title: '5 quick and easy nutritious meals you can make',
    //   author: 'Jerry Well',
    //   date: '1 November 2022',
    // },
  ]);
  // console.log(reviews);

  const trial = async () => {
    const collectionRef = firestore().collection('Article feed');
    const snapshot = await collectionRef.get();
    list = [];
    snapshot.forEach(doc => {
      list.push(doc.data());
      // console.log(doc.id, '=>', doc.data());
      // console.log(list);
    });
    setReviews([...list]);
  };
  trial();

  return (
    <View>
      <View style={{alignItems: 'center'}}>
        <Image
          source={require('../assets/images/blog.png')}
          style={{width: 90, height: 90, marginBottom: 10}}></Image>
      </View>
      <FlatList
        data={reviews}
        renderItem={({item}) => (
          <TouchableOpacity
            onPress={() => navigation.navigate('ArticleDetails', item)}>
            <Card>
              <Text
                style={{
                  fontSize: 15,
                  color: 'black',
                }}>
                {item.title}
              </Text>
            </Card>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
