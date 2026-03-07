import React, { useState, useEffect, memo } from 'react';
import { Text, StyleSheet } from 'react-native';
import { formatTime } from '../../Constants/functions';

const ClockView = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timeId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timeId);
  }, []);

  return (
    <Text style={styles.timeText}>
      {formatTime(currentTime)}
    </Text>
  );
};

export default memo(ClockView);

const styles = StyleSheet.create({
  timeText: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: '300',
    letterSpacing: 2,
  },
});