import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const HourlyCard = ({
  time,
  temp,
  icon,
}: {
  time: string;
  temp: number;
  icon: any;
}) => {
  return (
    <View style={styles.card}>
      <Text style={styles.time}>{time}</Text>
      <Image source={icon} style={styles.icon} />
      <Text style={styles.temp}>{temp}°</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
  backgroundColor: '#1a1a1a',
  borderRadius: 15,
  padding: 8,
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: 10,
  width: 70,
  height: 110, 
},

  icon: {
  width: 30,
  height: 30,
  marginVertical: 5,
  resizeMode: 'contain',
},
time: {
  fontSize: 12,
  color: '#fff',
},
temp: {
  fontSize: 14,
  color: '#ccc',
  marginTop: 5,
},

});

export default HourlyCard;
