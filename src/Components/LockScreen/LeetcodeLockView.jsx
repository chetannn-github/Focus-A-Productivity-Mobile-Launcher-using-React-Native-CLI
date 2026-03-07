import React from "react";
import { 
  View, Text, TouchableOpacity, ActivityIndicator, Animated,
  StyleSheet,
} from "react-native";

import Icon from "react-native-vector-icons/Ionicons";


export const LeetCodeLockView = ({ 
  questionsToSolve, lcStats, quote, 
  isChecking, onCheck, blinkAnim 
}) => {
  return (
    <View style={leetCodeStyles.centerBlock}>
      {/* IDE Window */}
      <View style={leetCodeStyles.ideWindow}>
        <View style={leetCodeStyles.ideHeader}>
          <View style={leetCodeStyles.macDots}>
            <View style={[leetCodeStyles.macDot, { backgroundColor: '#FF5F56' }]} />
            <View style={[leetCodeStyles.macDot, { backgroundColor: '#FFBD2E' }]} />
            <View style={[leetCodeStyles.macDot, { backgroundColor: '#27C93F' }]} />
          </View>
          <Text style={leetCodeStyles.fileName}>lock_protocol.ts</Text>
          <Icon name="code-working-outline" size={16} color="#5C6370" />
        </View>

        <View style={leetCodeStyles.ideBody}>
          <View style={leetCodeStyles.codeRow}>
            <Text style={leetCodeStyles.lineNumber}>1</Text>
            <Text style={leetCodeStyles.codeText}>
              <Text style={leetCodeStyles.keyword}>const </Text>
              <Text style={leetCodeStyles.variable}>status </Text>
              <Text style={leetCodeStyles.operator}>= </Text>
              <Text style={leetCodeStyles.string}>"LOCKED"</Text>
              <Text style={leetCodeStyles.operator}>;</Text>
            </Text>
          </View>

          <View style={leetCodeStyles.codeRow}>
            <Text style={leetCodeStyles.lineNumber}>2</Text>
          </View>

          <View style={leetCodeStyles.codeRow}>
            <Text style={leetCodeStyles.lineNumber}>3</Text>
            <Text style={leetCodeStyles.codeText}>
              <Text style={leetCodeStyles.keyword}>await </Text>
              <Text style={leetCodeStyles.function}>requireSolutions</Text>
              <Text style={leetCodeStyles.operator}>({questionsToSolve});</Text>
            </Text>
          </View>

          <View style={leetCodeStyles.codeRow}>
            <Text style={leetCodeStyles.lineNumber}>4</Text>
          </View>

          <View style={leetCodeStyles.codeRow}>
            <Text style={leetCodeStyles.lineNumber}>5</Text>
            <Text style={leetCodeStyles.codeText}>
              <Text style={leetCodeStyles.keyword}>const </Text>
              <Text style={leetCodeStyles.variable}>current_stats </Text>
              <Text style={leetCodeStyles.operator}>= </Text>
              <Text style={leetCodeStyles.operator}>{'{'}</Text>
            </Text>
          </View>

          <View style={leetCodeStyles.codeRow}>
            <Text style={leetCodeStyles.lineNumber}>6</Text>
            <Text style={leetCodeStyles.codeText}>
              <Text style={leetCodeStyles.property}>  easy</Text>
              <Text style={leetCodeStyles.operator}>: </Text>
              <Text style={leetCodeStyles.number}>{lcStats?.easy || 0}</Text>
              <Text style={leetCodeStyles.operator}>,</Text>
            </Text>
          </View>

          <View style={leetCodeStyles.codeRow}>
            <Text style={leetCodeStyles.lineNumber}>7</Text>
            <Text style={leetCodeStyles.codeText}>
              <Text style={leetCodeStyles.property}>  medium</Text>
              <Text style={leetCodeStyles.operator}>: </Text>
              <Text style={leetCodeStyles.number}>{lcStats?.medium || 0}</Text>
              <Text style={leetCodeStyles.operator}>,</Text>
            </Text>
          </View>

          <View style={leetCodeStyles.codeRow}>
            <Text style={leetCodeStyles.lineNumber}>8</Text>
            <Text style={leetCodeStyles.codeText}>
              <Text style={leetCodeStyles.property}>  hard</Text>
              <Text style={leetCodeStyles.operator}>: </Text>
              <Text style={leetCodeStyles.number}>{lcStats?.hard || 0}</Text>
            </Text>
          </View>

          <View style={leetCodeStyles.codeRow}>
            <Text style={leetCodeStyles.lineNumber}>9</Text>
            <Text style={leetCodeStyles.codeText}>
              <Text style={leetCodeStyles.operator}>{'}'};</Text>
              <Animated.Text style={{ opacity: blinkAnim, color: '#61AFEF' }}>_</Animated.Text>
            </Text>
          </View>
        </View>
      </View>

      <View style={leetCodeStyles.quoteWrapper}>
        <Text style={leetCodeStyles.quoteText}>
          <Text style={{ color: '#5C6370' }}>// output:{"\n"}</Text>
          <Text style={{ color: '#ABB2BF' }}>&gt; </Text>
          "{quote}"
        </Text>
      </View>

      <TouchableOpacity 
        style={[leetCodeStyles.cliButton, isChecking && { opacity: 0.5 }]} 
        onPress={onCheck}
        disabled={isChecking}
        activeOpacity={0.8}
      >
        {isChecking ? (
          <ActivityIndicator color="#61AFEF" size="small" />
        ) : (
          <Text style={leetCodeStyles.cliButtonText}>
            <Text style={{ color: '#E06C75' }}>~</Text>
            <Text style={{ color: '#98C379' }}> npm run </Text>
            <Text style={{ color: '#61AFEF' }}>unlock</Text>
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const leetCodeStyles = StyleSheet.create({
  centerBlock: { alignItems: 'center', width: '100%', marginTop: 20 },
  ideWindow: { width: '100%', backgroundColor: '#0D1117', borderRadius: 12, borderWidth: 1, borderColor: '#30363D', overflow: 'hidden', marginTop: 30, elevation: 10, shadowColor: '#000', shadowOpacity: 0.5, shadowRadius: 15 },
  ideHeader: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#161B22', paddingVertical: 10, paddingHorizontal: 15, borderBottomWidth: 1, borderBottomColor: '#30363D' },
  macDots: { flexDirection: 'row', marginRight: 15 },
  macDot: { width: 10, height: 10, borderRadius: 5, marginRight: 6 },
  fileName: { flex: 1, color: '#8B949E', fontSize: 12, fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace', textAlign: 'center', marginRight: 15 },
  ideBody: { paddingVertical: 15, paddingHorizontal: 10 },
  codeRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  lineNumber: { color: '#495162', fontSize: 13, fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace', width: 25, textAlign: 'right', marginRight: 15 },
  codeText: { fontSize: 13, fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace' },
  keyword: { color: '#C678DD' }, 
  variable: { color: '#E06C75' }, 
  operator: { color: '#ABB2BF' }, 
  string: { color: '#98C379' }, 
  function: { color: '#61AFEF' }, 
  property: { color: '#D19A66' }, 
  number: { color: '#D19A66' }, 
  quoteWrapper: { marginTop: 40, width: '100%', paddingHorizontal: 20 },
  quoteText: { color: '#98C379', fontSize: 13, lineHeight: 22, fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace' },
  cliButton: { backgroundColor: '#0D1117', paddingVertical: 16, paddingHorizontal: 20, borderRadius: 8, marginTop: 50, borderWidth: 1, borderColor: '#30363D', width: '90%', alignItems: 'flex-start' },
  cliButtonText: { fontSize: 14, fontWeight: '600', fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace' },
});