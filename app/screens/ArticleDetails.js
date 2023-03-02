import React from 'react';
import {View, Text, Button, Image} from 'react-native';
import Card from './Card';

export default function ArticleDetails({navigation, route}) {
  const {title, author, date, content} = route.params;
  formattedContent = content.replaceAll('/', '\n');
  return (
    <View>
      <Card>
        <View style={{alignItems: 'center'}}>
          <Image
            source={require('../assets/images/meal.png')}
            style={{width: 90, height: 90}}></Image>
        </View>
        <Text style={{fontSize: 15, fontWeight: '600', color: 'black'}}>
          {title}
        </Text>
        <Text style={{marginTop: 10, color: 'black'}}>Author: {author}</Text>
        <Text style={{color: 'black'}}>Date published: {date}</Text>
        <Text style={{marginTop: 20, color: 'black'}}>{formattedContent}</Text>
      </Card>
    </View>
  );
}
