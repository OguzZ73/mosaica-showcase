import React, { useEffect, useMemo, useState } from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Svg, {
  Circle,
  Defs,
  G,
  Line,
  LinearGradient as SvgLinearGradient,
  RadialGradient as SvgRadialGradient,
  Rect,
  Stop,
} from 'react-native-svg';
import { MockDreamEntry } from '../../mocks/mockDreamsData';

export interface StarNode {
  id: string;
  x: number;
  y: number;
  radius: number;
  color: string;
  title: string;
  lucidity: number;
  category: string;
}

export interface ConstellationEdge {
  id: string;
  source: StarNode;
  target: StarNode;
  opacity: number;
}

interface DreamConstellationMapProps {
  dreams: MockDreamEntry[];
  width?: number;
  height?: number;
  onSelectStar?: (star: StarNode) => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CANVAS_SIZE = 400;

export const DreamConstellationMap: React.FC<DreamConstellationMapProps> = ({
  dreams,
  width = SCREEN_WIDTH - 40,
  height = 360,
  onSelectStar,
}) => {
  const [selectedStarId, setSelectedStarId] = useState<string | null>(null);

  // Map dream entries to star nodes
  const stars: StarNode[] = useMemo(() => {
    return dreams.map((dream, index) => {
      const angle = (index / dreams.length) * Math.PI * 2;
      const radius = 80 + (dream.lucidityLevel * 20);
      const cx = (width / 2) + Math.cos(angle) * radius;
      const cy = (height / 2) + Math.sin(angle) * radius;

      const colors: Record<string, string> = {
        Lucid: '#a855f7',
        Cosmic: '#3b82f6',
        Memory: '#ec4899',
        Subconscious: '#06b6d4',
      };

      return {
        id: dream.id,
        x: cx,
        y: cy,
        radius: 6 + dream.lucidityLevel * 2,
        color: colors[dream.clusterCategory] || '#8b5cf6',
        title: dream.title,
        lucidity: dream.lucidityLevel,
        category: dream.clusterCategory,
      };
    });
  }, [dreams, width, height]);

  // Connect close star nodes with edges
  const edges: ConstellationEdge[] = useMemo(() => {
    const list: ConstellationEdge[] = [];
    for (let i = 0; i < stars.length; i++) {
      for (let j = i + 1; j < stars.length; j++) {
        const dx = stars[i].x - stars[j].x;
        const dy = stars[i].y - stars[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 180) {
          list.push({
            id: `edge_${stars[i].id}_${stars[j].id}`,
            source: stars[i],
            target: stars[j],
            opacity: 1 - (dist / 180),
          });
        }
      }
    }
    return list;
  }, [stars]);

  const activeStar = stars.find(s => s.id === selectedStarId);

  return (
    <View style={[styles.container, { width, height }]}>
      <Svg width={width} height={height} style={styles.svg}>
        <Defs>
          <SvgRadialGradient id="spaceGlow" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor="#1e1b4b" stopOpacity="0.8" />
            <Stop offset="100%" stopColor="#09090b" stopOpacity="1" />
          </SvgRadialGradient>
        </Defs>

        <Rect width={width} height={height} fill="url(#spaceGlow)" rx={16} />

        {/* Constellation Edge Lines */}
        {edges.map(edge => (
          <Line
            key={edge.id}
            x1={edge.source.x}
            y1={edge.source.y}
            x2={edge.target.x}
            y2={edge.target.y}
            stroke="#a78bfa"
            strokeWidth={1.5}
            strokeDasharray="4 4"
            strokeOpacity={edge.opacity * 0.6}
          />
        ))}

        {/* Constellation Star Nodes */}
        {stars.map(star => {
          const isSelected = star.id === selectedStarId;
          return (
            <G key={star.id}>
              {/* Outer Halo Glow */}
              <Circle
                cx={star.x}
                cy={star.y}
                r={star.radius * (isSelected ? 2.5 : 1.6)}
                fill={star.color}
                opacity={isSelected ? 0.4 : 0.2}
              />
              {/* Star Core */}
              <Circle
                cx={star.x}
                cy={star.y}
                r={star.radius}
                fill={star.color}
                onPress={() => {
                  setSelectedStarId(star.id);
                  onSelectStar?.(star);
                }}
              />
            </G>
          );
        })}
      </Svg>

      {/* Selected Star Details Card */}
      {activeStar && (
        <View style={styles.detailOverlay}>
          <Text style={styles.detailTitle}>{activeStar.title}</Text>
          <Text style={styles.detailSubtitle}>
            Kategori: {activeStar.category} • Lüsid Seviye: {activeStar.lucidity}/5
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#09090b',
  },
  svg: {
    borderRadius: 16,
  },
  detailOverlay: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
    padding: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    borderWidth: 1,
    borderColor: '#38bdf844',
  },
  detailTitle: {
    color: '#f8fafc',
    fontSize: 14,
    fontWeight: 'bold',
  },
  detailSubtitle: {
    color: '#94a3b8',
    fontSize: 12,
    marginTop: 2,
  },
});
