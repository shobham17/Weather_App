// components/DailyCard.tsx
import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const DailyCard = ({
  day,
  date,
  icon,
  temp,
}: {
  day: string;
  date: string;
  icon: any;
  temp: string;
}) => {
  return (
    <View style={styles.card}>
      <Text style={styles.day}>{day}</Text>
      <Text style={styles.date}>{date}</Text>
      <Image source={icon} style={styles.icon} />
      <Text style={styles.temp}>{temp}</Text>
    </View>
  );
};




const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1a1a1a',
  padding: 12,
  borderRadius: 30,
  marginBottom: 10,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',          
  },
  date: { color: '#aaa', fontSize: 12, marginBottom: 5 },
  day: { color: '#fff', fontSize: 14 },
  icon: { width: 40, height: 40, marginVertical: 6 },  
  temp: { color: '#ccc', fontSize: 12 },               
});


export default DailyCard;
