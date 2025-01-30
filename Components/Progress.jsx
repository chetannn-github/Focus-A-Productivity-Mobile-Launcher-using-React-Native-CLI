import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ProgressBar } from 'react-native-paper';

const Progress = () => {
  return (
    
      <View style={styles.progressContainer}> 
      <Text style={styles.text}>Leetcode Rank: 23321</Text>

        <Text style={styles.text}>Easy: 30%</Text>
        <ProgressBar progress={0.7} color="white" style={styles.progressBar} />
        <Text style={styles.text}>Medium: 30%</Text>
        <ProgressBar progress={0.3} color="white" style={styles.progressBar} />
        <Text style={styles.text}>Hard: 30%</Text>
        <ProgressBar progress={0.7} color="white" style={styles.progressBar} />
      </View>
  );
};

const styles = StyleSheet.create({
  progressContainer: {
    width: '40%',
    // backgroundColor: 'blue',
    padding:5,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#111114',
    marginBottom: 10,
  },
  text: {
    fontSize: 12,
    color: 'white',
    marginBottom: 4,
  },
});

export default Progress;
