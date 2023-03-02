import React from 'react';
import {StyleSheet, View} from 'react-native';

export default function Card(props) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        marginTop: 10,
        width: 350,
        alignSelf: 'center',
      }}>
      <View>{props.children}</View>
    </View>
  );
}

// const styles = StyleSheet.create({
//   card: {},
//   cardContent: {},
// });
