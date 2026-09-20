import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export interface CorrelationPoint {
  dayLabel: string;
  sleepHours: number;
  lucidityScore: number; // 1-5
  dreamCount: number;
}

interface SleepDreamCorrelationStatsProps {
  data?: CorrelationPoint[];
}

const DEFAULT_CORRELATION_DATA: CorrelationPoint[] = [
  { dayLabel: 'Pzt', sleepHours: 7.5, lucidityScore: 4, dreamCount: 3 },
  { dayLabel: 'Sal', sleepHours: 6.0, lucidityScore: 2, dreamCount: 1 },
  { dayLabel: 'Çar', sleepHours: 8.2, lucidityScore: 5, dreamCount: 4 },
  { dayLabel: 'Per', sleepHours: 7.0, lucidityScore: 3, dreamCount: 2 },
  { dayLabel: 'Cum', sleepHours: 8.5, lucidityScore: 5, dreamCount: 5 },
];

export const SleepDreamCorrelationStats: React.FC<SleepDreamCorrelationStatsProps> = ({
  data = DEFAULT_CORRELATION_DATA,
}) => {
  const avgSleep = (data.reduce((acc, d) => acc + d.sleepHours, 0) / data.length).toFixed(1);
  const avgLucidity = (data.reduce((acc, d) => acc + d.lucidityScore, 0) / data.length).toFixed(1);

  return (
    <View style={styles.cardContainer}>
      <Text style={styles.cardTitle}>Uyku & Lüsid Korelasyonu</Text>

      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{avgSleep} sa</Text>
          <Text style={styles.statLabel}>Ort. Uyku</Text>
        </View>

        <View style={styles.statBox}>
          <Text style={styles.statValue}>{avgLucidity} / 5</Text>
          <Text style={styles.statLabel}>Ort. Lüsidlik</Text>
        </View>
      </View>

      <View style={styles.chartBarContainer}>
        {data.map((point, index) => {
          const barHeight = (point.sleepHours / 10) * 100;
          return (
            <View key={index} style={styles.barColumn}>
              <View style={[styles.barFill, { height: `${barHeight}%` }]} />
              <Text style={styles.barLabel}>{point.dayLabel}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#0f172a',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  cardTitle: {
    color: '#f8fafc',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statBox: {
    backgroundColor: '#1e293b',
    padding: 12,
    borderRadius: 12,
    flex: 0.48,
    alignItems: 'center',
  },
  statValue: {
    color: '#38bdf8',
    fontSize: 18,
    fontWeight: 'bold',
  },
  statLabel: {
    color: '#94a3b8',
    fontSize: 12,
    marginTop: 4,
  },
  chartBarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 100,
    paddingTop: 10,
  },
  barColumn: {
    alignItems: 'center',
    flex: 1,
    height: '100%',
    justifyContent: 'flex-end',
  },
  barFill: {
    width: 14,
    backgroundColor: '#8b5cf6',
    borderRadius: 6,
  },
  barLabel: {
    color: '#64748b',
    fontSize: 11,
    marginTop: 6,
  },
});
