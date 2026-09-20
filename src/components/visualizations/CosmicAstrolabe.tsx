import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import Svg, { Circle, Defs, G, Path, RadialGradient, Stop } from 'react-native-svg';

interface CosmicAstrolabeProps {
  isDark?: boolean;
}

export const CosmicAstrolabe: React.FC<CosmicAstrolabeProps> = ({ isDark = true }) => {
  const anim1 = useRef(new Animated.Value(0)).current;
  const anim2 = useRef(new Animated.Value(0)).current;
  const anim3 = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(anim1, {
        toValue: 1,
        duration: 30000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    Animated.loop(
      Animated.timing(anim2, {
        toValue: 1,
        duration: 45000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    Animated.loop(
      Animated.timing(anim3, {
        toValue: 1,
        duration: 60000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 3000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 3000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const spin1 = anim1.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  const spin2 = anim2.interpolate({ inputRange: [0, 1], outputRange: ['360deg', '0deg'] });
  const spin3 = anim3.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  const pulseScale = pulseAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.25] });
  const pulseOpacity = pulseAnim.interpolate({ inputRange: [0, 1], outputRange: [0.4, 1] });

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <View style={[StyleSheet.absoluteFill, styles.centered]}>
        <Animated.View style={{ width: '150%', height: '150%', transform: [{ scale: pulseScale }], opacity: pulseOpacity }}>
          <Svg width="100%" height="100%" viewBox="0 0 100 100">
            <Defs>
              <RadialGradient id="coreGlow" cx="50" cy="50" r="50" fx="50" fy="50">
                <Stop offset="0%" stopColor="#3b82f6" stopOpacity={isDark ? "0.8" : "0.6"} />
                <Stop offset="40%" stopColor="#0ea5e9" stopOpacity={isDark ? "0.4" : "0.3"} />
                <Stop offset="100%" stopColor={isDark ? "#000" : "#fff"} stopOpacity="0" />
              </RadialGradient>
            </Defs>
            <Circle cx="50" cy="50" r="50" fill="url(#coreGlow)" />
          </Svg>
        </Animated.View>
      </View>

      <View style={[StyleSheet.absoluteFill, styles.centered]}>
        {/* Outer Ring */}
        <Animated.View style={{ position: 'absolute', transform: [{ rotate: spin3 }] }}>
          <Svg width="320" height="320" viewBox="0 0 320 320">
            <Circle cx="160" cy="160" r="150" fill="none" stroke="rgba(14, 165, 233, 0.3)" strokeWidth="1" strokeDasharray="4 8" />
            <Circle cx="160" cy="160" r="145" fill="none" stroke="rgba(139, 92, 246, 0.4)" strokeWidth="2" strokeDasharray="1 12" />
            <Path d="M160 5 L160 15 M160 315 L160 305 M5 160 L15 160 M315 160 L305 160" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" />
          </Svg>
        </Animated.View>

        {/* Middle Ring */}
        <Animated.View style={{ position: 'absolute', transform: [{ rotate: spin2 }] }}>
          <Svg width="240" height="240" viewBox="0 0 240 240">
            <Circle cx="120" cy="120" r="110" fill="none" stroke="rgba(139, 92, 246, 0.5)" strokeWidth="1.5" />
            <Circle cx="120" cy="120" r="105" fill="none" stroke="rgba(14, 165, 233, 0.6)" strokeWidth="1" strokeDasharray="10 5 2 5" />
            <G transform="translate(120 120)">
              {Array.from({ length: 12 }).map((_, i) => (
                <G key={i} transform={`rotate(${i * 30})`}>
                  <Path d="M 0 -110 L 4 -104 L -4 -104 Z" fill="rgba(139, 92, 246, 0.6)" />
                  <Circle cx="0" cy="-95" r="2" fill="#0ea5e9" />
                </G>
              ))}
            </G>
          </Svg>
        </Animated.View>

        {/* Core Jewel */}
        <Animated.View style={{ position: 'absolute', opacity: pulseOpacity }}>
          <Svg width="40" height="40" viewBox="0 0 40 40">
            <Defs>
              <RadialGradient id="jewel" cx="20" cy="20" r="20">
                <Stop offset="0%" stopColor={isDark ? "#fff" : "#0ea5e9"} stopOpacity="1" />
                <Stop offset="30%" stopColor="#38bdf8" stopOpacity="0.9" />
                <Stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
              </RadialGradient>
            </Defs>
            <Circle cx="20" cy="20" r="15" fill="url(#jewel)" />
            <Path d="M 20 5 L 22 18 L 35 20 L 22 22 L 20 35 L 18 22 L 5 20 L 18 18 Z" fill={isDark ? "#fff" : "#38bdf8"} opacity="0.8" />
          </Svg>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
