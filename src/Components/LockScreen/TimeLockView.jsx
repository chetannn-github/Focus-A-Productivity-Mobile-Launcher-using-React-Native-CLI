import React from "react";
import { View, Text, Animated, StyleSheet, Platform } from "react-native";

export const TimeLockView = ({ remainingTime, blinkAnim, floatAnim, quote }) => {
  const minutes = Math.floor(remainingTime / 60);
  const seconds = String(remainingTime % 60).padStart(2, "0");

  return (
    <View style={timeLockStyles.centerBlock}>
      
      {/* 1. TOP FLOATING BADGE (Calibrating vibe) */}
      <Animated.View style={[timeLockStyles.statusBadge, { transform: [{ translateY: floatAnim }] }]}>
        <View style={timeLockStyles.greenDot} />
        <Text style={timeLockStyles.badgeText}>STATUS: EXECUTION_IN_PROGRESS</Text>
      </Animated.View>

      {/* 2. MAIN TIMER CARD (IDE Component Style) */}
      <View style={timeLockStyles.timerCard}>
        {/* Subtle Background Elements */}
        <View style={timeLockStyles.topBarDecoration}>
           <View style={timeLockStyles.dot} />
           <View style={timeLockStyles.dot} />
        </View>

        <View style={timeLockStyles.timerWrapper}>
          <Text style={timeLockStyles.massiveTimer}>
            {minutes}
            <Text style={{ color: '#5C6370', fontWeight: '100' }}>:</Text>
            {seconds}
          </Text>
          <Animated.Text style={[timeLockStyles.cursor, { opacity: blinkAnim }]}>
            _
          </Animated.Text>
        </View>

        {/* Data Grid inside card */}
        <View style={timeLockStyles.infoGrid}>
          <View style={timeLockStyles.infoItem}>
            <Text style={timeLockStyles.infoLabel}>TYPE</Text>
            <Text style={timeLockStyles.infoValue}>[ TEMPORAL ]</Text>
          </View>
          <View style={timeLockStyles.infoItem}>
            <Text style={timeLockStyles.infoLabel}>KERNEL</Text>
            <Text style={timeLockStyles.infoValue}>[ DEEP_WORK ]</Text>
          </View>
        </View>

        {/* Bottom Progress Pips (Visual Decoration) */}
        <View style={timeLockStyles.pipsContainer}>
           {[1,2,3,4,5,6].map(i => <View key={i} style={[timeLockStyles.pip, i < 4 && {backgroundColor: '#61AFEF'}]} />)}
        </View>
      </View>

      {/* 3. CODE COMMENT QUOTE BOX */}
      <View style={timeLockStyles.quoteContainer}>
        <View style={timeLockStyles.quoteLine} />
        <Text style={timeLockStyles.quoteText}>
          <Text style={{ color: '#5C6370' }}>/**{"\n"} * </Text>
          {quote}
          <Text style={{ color: '#5C6370' }}>{"\n"} */</Text>
        </Text>
        <View style={timeLockStyles.quoteLine} />
      </View>

      {/* 4. CONSOLE OUTPUT FOOTER */}
      <View style={timeLockStyles.consoleWrapper}>
        <View style={timeLockStyles.consoleLine}>
           <Text style={timeLockStyles.consoleIcon}>❯</Text>
           <Text style={timeLockStyles.subStatus}> lock_engine --state=</Text>
           <Text style={{ color: '#98C379', fontFamily: 'monospace', fontSize: 12 }}>ACTIVE</Text>
        </View>
        <View style={timeLockStyles.consoleLine}>
           <Text style={timeLockStyles.consoleIcon}>❯</Text>
           <Text style={timeLockStyles.subStatus}> sys_integrity: </Text>
           <Text style={{ color: '#61AFEF', fontFamily: 'monospace', fontSize: 12 }}>STABLE</Text>
        </View>
      </View>

    </View>
  );
};

const timeLockStyles = StyleSheet.create({
  centerBlock: { 
    alignItems: 'center', 
    width: '100%', 
    paddingHorizontal: 15 
  },
  
  // Status Badge
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0D1117',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#30363D',
    marginBottom: 30,
  },
  greenDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#30D158',
    marginRight: 10,
    shadowColor: '#30D158',
    shadowOpacity: 0.5,
    shadowRadius: 5,
  },
  badgeText: {
    color: '#8B949E',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.5,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },

  // Timer Card
  timerCard: {
    width: '100%',
    backgroundColor: '#0D1117',
    borderRadius: 16,
    paddingVertical: 40,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#30363D',
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
  },
  topBarDecoration: {
    position: 'absolute',
    top: 12,
    left: 15,
    flexDirection: 'row',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#21262D',
    marginRight: 6,
  },
  timerWrapper: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  massiveTimer: { 
    color: '#F0F6FC', 
    fontSize: 88, 
    fontWeight: '200', 
    letterSpacing: -2, 
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  cursor: {
    fontSize: 60,
    color: '#61AFEF',
    marginLeft: 4,
    fontWeight: '200'
  },

  // Info Grid
  infoGrid: {
    flexDirection: 'row',
    marginTop: 35,
    width: '85%',
    justifyContent: 'space-around',
  },
  infoItem: { alignItems: 'center' },
  infoLabel: {
    color: '#C678DD', // Purple Keyword
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 2,
    marginBottom: 6,
  },
  infoValue: {
    color: '#D19A66', // Orange String
    fontSize: 12,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },

  // Pips Decoration
  pipsContainer: {
    flexDirection: 'row',
    marginTop: 40,
  },
  pip: {
    width: 12,
    height: 3,
    backgroundColor: '#21262D',
    marginHorizontal: 3,
    borderRadius: 2,
  },

  // Quote Box
  quoteContainer: {
    marginTop: 40,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  quoteLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#21262D',
  },
  quoteText: {
    color: '#98C379', 
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    paddingHorizontal: 15,
    maxWidth: '85%',
  },

  // Console Styles
  consoleWrapper: {
    marginTop: 40,
    width: '100%',
    backgroundColor: '#0A0A0A',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1A1A1A',
  },
  consoleLine: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  consoleIcon: {
    color: '#61AFEF',
    fontSize: 12,
    marginRight: 8,
  },
  subStatus: { 
    color: '#5C6370', 
    fontSize: 12, 
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace' 
  },
});