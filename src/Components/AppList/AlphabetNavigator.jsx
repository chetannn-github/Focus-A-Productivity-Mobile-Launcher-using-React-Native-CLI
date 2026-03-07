import React, { useState, useMemo, useRef, useEffect, useCallback, memo } from 'react';
import { View, Text, StyleSheet, Animated, PanResponder } from 'react-native';

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ#".split('');

const LetterItem = memo(({ letter, animatedValue, isActive }) => {
  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -80], 
  });
  const scale = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 2.3], 
  });


  const activeOpacity = animatedValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0, 1],
  });

  return (
    <Animated.View style={[styles.letterBox, { transform: [{ translateX }, { scale }] }]}>
      {isActive && (
        <Animated.View style={[styles.minimalDot, { opacity: activeOpacity }]} />
      )}
      
      <Text style={[
        styles.alphabetText, 
        isActive && styles.activeAlphabetText
      ]}>
        {letter}
      </Text>
    </Animated.View>
  );
});

const AlphabetNavigator = ({ processedApps, flatListRef }) => {
  const [activeLetter, setActiveLetter] = useState(null);
  const [isSliding, setIsSliding] = useState(false);

  const barLayout = useRef({ y: 0, height: 0 });
  const currentLetterRef = useRef(null);
  const animatedValues = useRef(ALPHABET.map(() => new Animated.Value(0))).current;
  const lastTouchTime = useRef(0);
  const THROTTLE_MS = 20;

  const letterIndices = useMemo(() => {
    const indices = {};
    processedApps.forEach((app, index) => {
      const firstChar = app.appName.charAt(0).toUpperCase();
      const letter = /[A-Z]/.test(firstChar) ? firstChar : '#';
      if (indices[letter] === undefined) indices[letter] = index;
    });
    return indices;
  }, [processedApps]);

  const processTouch = useCallback((pageY) => {
    const now = Date.now();
    if (now - lastTouchTime.current < THROTTLE_MS) return;
    lastTouchTime.current = now;

    const { y: barTop, height: bHeight } = barLayout.current;
    if (bHeight === 0) return;

    const localY = pageY - barTop;
    const boundedY = Math.max(0, Math.min(bHeight - 0.1, localY));
    const itemHeight = bHeight / ALPHABET.length;
    const index = Math.floor(boundedY / itemHeight);
    const letter = ALPHABET[index];

    if (currentLetterRef.current !== letter && letter) {
      currentLetterRef.current = letter;
      setActiveLetter(letter);

      const targetIndex = letterIndices[letter];
      if (targetIndex !== undefined && flatListRef?.current) {
        flatListRef.current.scrollToIndex({ index: targetIndex, animated: false });
      }
    }
  }, [letterIndices, flatListRef]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderGrant: (evt) => {
        setIsSliding(true);
        processTouch(evt.nativeEvent.pageY);
      },
      onPanResponderMove: (evt) => {
        processTouch(evt.nativeEvent.pageY);
      },
      onPanResponderRelease: () => {
        setIsSliding(false);
        setActiveLetter(null);
        currentLetterRef.current = null;
      },
      onPanResponderTerminate: () => {
        setIsSliding(false);
        setActiveLetter(null);
      }
    })
  ).current;

  useEffect(() => {
    const activeIndex = activeLetter ? ALPHABET.indexOf(activeLetter) : -1;
    const animations = ALPHABET.map((_, index) => {
      let targetValue = 0;
      if (isSliding && activeIndex !== -1) {
        const distance = Math.abs(index - activeIndex);
        if (distance === 0) targetValue = 1;
        else if (distance === 1) targetValue = 0.75;
        else if (distance === 2) targetValue = 0.45;
        else if (distance === 3) targetValue = 0.2;
      }

      return Animated.spring(animatedValues[index], {
        toValue: targetValue,
        useNativeDriver: true,
        tension: 50, 
        friction: 12,
      });
    });

    Animated.parallel(animations).start();
  }, [activeLetter, isSliding]);

  return (
    <View 
      onLayout={(e) => e.target.measure((x, y, w, h, px, py) => { barLayout.current = { y: py, height: h }; })} 
      style={styles.alphabetTouchArea} 
      {...panResponder.panHandlers}
    >
      <View style={styles.alphabetPill} pointerEvents="none">
        {ALPHABET.map((letter, index) => (
          <LetterItem 
            key={letter}
            letter={letter}
            animatedValue={animatedValues[index]}
            isActive={activeLetter === letter}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  alphabetTouchArea: {
    position: 'absolute',
    right: 0,
    top: '12%',
    bottom: '12%',
    width: 65,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 8,
    zIndex: 9999,
  },
  alphabetPill: {
    width: 26,
    height: '100%',
    justifyContent: 'center',
  },
  letterBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  alphabetText: {
    color: '#8E8E93',
    fontSize: 9,
    fontWeight: '700',
  },
  activeAlphabetText: {
    color: '#FFFFFF', 
    fontWeight: '900',
  },
 
  minimalDot: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#0A84FF', 
    opacity: 0.8,
  }
});

export default AlphabetNavigator;