import React, { useContext, useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { ProgressBar } from 'react-native-paper';
import { SettingsContext } from '../Context/SettingsContext';

const Progress = () => {
  const { leetcodeUsername } = useContext(SettingsContext);
  const [leetcodeData, setLeetcodeData] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchLeetcodeAPI = async () => {
    try {
      const response = await fetch(`https://leetcode-stats-api.herokuapp.com/${leetcodeUsername}`);
      const data = await response.json();
      setLeetcodeData(data);
    } catch (error) {
      console.error('Error fetching Leetcode data:', error);
    }
  };

  useEffect(() => {
    if (leetcodeUsername) {
      fetchLeetcodeAPI();
    }
  }, [leetcodeUsername]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchLeetcodeAPI();
    setRefreshing(false);
  }, []);

  if (!leetcodeUsername || !leetcodeData) {
    return null;
  }

  

  const easyProgress = leetcodeData.totalEasy ? Math.round((leetcodeData.easySolved / leetcodeData.totalEasy) * 100) : 0;
  const mediumProgress = leetcodeData.totalMedium ? Math.round((leetcodeData.mediumSolved / leetcodeData.totalMedium) * 100) : 0;
  const hardProgress = leetcodeData.totalHard ? Math.round((leetcodeData.hardSolved / leetcodeData.totalHard) * 100) : 0;
  const rank = Number(leetcodeData.ranking).toLocaleString('en-US');

  return (
    <ScrollView
      contentContainerStyle={styles.scrollView}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.progressContainer}>
        <View style= {styles.innerContainer}>
          <Text style={styles.text}>Leetcode Rank: {rank}</Text>

          <Text style={styles.text}>Easy: {leetcodeData.easySolved} / {leetcodeData.totalEasy}</Text>
          <ProgressBar progress={easyProgress / 100} color="white" style={styles.progressBar} />

          <Text style={styles.text}>Medium: {leetcodeData.mediumSolved} / {leetcodeData.totalMedium}</Text>
          <ProgressBar progress={mediumProgress / 100} color="white" style={styles.progressBar} />

          <Text style={styles.text}>Hard: {leetcodeData.hardSolved} / {leetcodeData.totalHard}</Text>
          <ProgressBar progress={hardProgress / 100} color="white" style={styles.progressBar} />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  progressContainer: {
    width: '100%',
    // padding: 5,
  },
  innerContainer:{
    width: '47%',
  },
  progressBar: {
    height: 9,
    backgroundColor: '#111114',
    marginBottom: 10,
  },
  text: {
    fontSize: 13,
    color: 'white',
    marginBottom: 6,
  },
  scrollView: {
    flexGrow: 1,
  },
});

export default Progress;
