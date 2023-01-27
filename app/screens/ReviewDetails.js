import React from 'react';
import {View, Text, Button} from 'react-native';
import Card from './Card';

export default function ReviewDetails({navigation, route}) {
  const {title, author, date} = route.params;
  return (
    <View>
      <Card>
        <Text>{title}</Text>
        <Text>{author}</Text>
        <Text>{date}</Text>
      </Card>
    </View>
  );
}
