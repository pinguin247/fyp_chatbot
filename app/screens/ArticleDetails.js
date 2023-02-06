import React from 'react';
import {View, Text, Button} from 'react-native';
import Card from './Card';

export default function ArticleDetails({navigation, route}) {
  const {title, author, date, content} = route.params;
  return (
    <View>
      <Card>
        <Text>{title}</Text>
        <Text>Author: {author}</Text>
        <Text>Date published: {date}</Text>
        <Text>{content}</Text>
      </Card>
    </View>
  );
}
