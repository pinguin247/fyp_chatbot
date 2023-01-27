import React from 'react';
import {StyleSheet, View} from 'react-native';

export default function Card(props) {
  return (
    <View>
      <View>{props.children}</View>
    </View>
  );
}

// const styles = StyleSheet.create({
//   card: {},
//   cardContent: {},
// });
