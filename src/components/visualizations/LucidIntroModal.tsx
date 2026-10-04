import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Dimensions,
  Animated,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Circle } from 'react-native-svg';
import { useTheme } from '../context/ThemeContext';
import { triggerButtonHaptic } from '../utils/haptics';
import { Easing } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface LucidIntroModalProps {
  visible: boolean;
  onComplete: () => void;
}

const SLIDES = [
  {
    id: 'intro',
    title: 'Lucid Dünyaya Hoş Geldiniz',
    subtitle: 'Bilinçli Rüyalar',
    description: 'Lucid rüya, rüya görürken rüyada olduğunuzun farkında olma durumudur. Bu harika farkındalık seviyesine ulaştığınızda rüyalarınızda uçabilir, yaratabilir ve sınırları aşabilirsiniz.',
    icon: (color: string) => (
      <Svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <Path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </Svg>
    )
  },
  {
    id: 'rc',
    title: 'Gerçeklik Testleri',
    subtitle: 'Farkındalık Alışkanlığı',
    description: 'Gerçeklik testi (Reality Check), gün içinde çevrenizi sorgulamanızı sağlar. Uygulama size rastgele bildirimler gönderir. Bu alışkanlığı kazanmak, rüya içindeyken de kendinizi sorgulamanızı ve "uyanmanızı" (bilinçlenmenizi) sağlar.',
    icon: (color: string) => (
      <Svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <Path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
        <Circle cx="12" cy="12" r="3" />
      </Svg>
    )
  },
  {
    id: 'techniques',
    title: 'İleri Seviye Teknikler',
    subtitle: 'MİLD, WBTB ve SSILD',
    description: 'Sadece testlerle yetinmek istemeyenler için özel tekniklerimiz var:\n\n• MİLD: Rüyayı hatırlamaya niyet etme.\n• WBTB: Uyku döngünüzü planlı bölme.\n• FILD: Uykuya dalarken haptik yönlendirmelerle bilinci açık tutma.\n• SSILD: Görme, duyma ve dokunma duyularına odaklanarak zihni açık tutma.',
    icon: (color: string) => (
      <Svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <Path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
      </Svg>
    )
  },
  {
    id: 'disclaimer',
    title: 'Önemli Uyarı',
    subtitle: 'Sorumluluk Reddi',
    description: 'WBTB gibi teknikler uyku döngünüzü böleceği için yorgunluğa sebep olabilir. Ayrıca rüya pratikleri sırasında geçici uyku felci yaşanabilir (zararsızdır fakat ürkütücü olabilir). Bu teknikleri uygulamak kendi sorumluluğunuzdadır; psikolojik bir rahatsızlığınız varsa lütfen doktorunuza danışın.',
    icon: (color: string) => (
      <Svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <Path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
        <Path d="M12 9v4" />
        <Path d="M12 17h.01" />
      </Svg>
    )
  },
  {
    id: 'ready',
    title: 'Başlamaya Hazırsın!',
    subtitle: 'Yolculuk Başlıyor',
    description: 'Şimdi Lucid Rüya Modu\'nu aktif et ve gerçeklik testleri almaya başla. Rüyalarını kontrol etmek sandığından çok daha yakın.',
    icon: (color: string) => (
      <Svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <Path d="m8 3 4 8 5-5 5 15H2L8 3z" />
      </Svg>
    )
  }
];

export default function LucidIntroModal({ visible, onComplete }: LucidIntroModalProps) {
  const { colors, isDark } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const float1 = useRef(new Animated.Value(0)).current;
  const float2 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start background animations
    Animated.loop(
      Animated.sequence([
        Animated.timing(float1, { toValue: 1, duration: 4000, useNativeDriver: true, easing: Easing.inOut(Easing.sin) }),
        Animated.timing(float1, { toValue: 0, duration: 4000, useNativeDriver: true, easing: Easing.inOut(Easing.sin) }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(float2, { toValue: 1, duration: 5000, useNativeDriver: true, easing: Easing.inOut(Easing.sin) }),
        Animated.timing(float2, { toValue: 0, duration: 5000, useNativeDriver: true, easing: Easing.inOut(Easing.sin) }),
      ])
    ).start();
  }, []);

  useEffect(() => {
    if (visible) {
      setCurrentIndex(0);
      // Ensure the scroll view goes back to the first slide without animation
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({ x: 0, animated: false });
      }, 0);

      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const handleNext = () => {
    triggerButtonHaptic();
    if (currentIndex < SLIDES.length - 1) {
      scrollViewRef.current?.scrollTo({
        x: (currentIndex + 1) * SCREEN_WIDTH,
        animated: true,
      });
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        onComplete();
      });
    }
  };

  const onScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: false }
  );

  const handleMomentumScrollEnd = (event: any) => {
    const newIndex = Math.round(event.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    if (newIndex !== currentIndex) {
      setCurrentIndex(newIndex);
    }
  };

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <Animated.View style={[styles.container, { opacity: fadeAnim, backgroundColor: '#020617' }]}>
        
        {/* Animated Background Gradients */}
        <LinearGradient
          colors={['#020617', '#1e1b4b', '#0f172a']}
          style={StyleSheet.absoluteFill}
        />

        {/* Floating Background Orbs */}
        <Animated.View style={[
          StyleSheet.absoluteFill, 
          { 
            opacity: 0.6,
            transform: [
              { translateY: float1.interpolate({ inputRange: [0, 1], outputRange: [0, -50] }) },
              { scale: float1.interpolate({ inputRange: [0, 1], outputRange: [1, 1.2] }) }
            ]
          }
        ]}>
          <LinearGradient
            colors={['rgba(99, 102, 241, 0.25)', 'transparent']}
            style={{ width: SCREEN_WIDTH * 1.5, height: SCREEN_WIDTH * 1.5, borderRadius: SCREEN_WIDTH, position: 'absolute', top: -SCREEN_WIDTH * 0.5, left: -SCREEN_WIDTH * 0.5 }}
          />
        </Animated.View>

        <Animated.View style={[
          StyleSheet.absoluteFill, 
          { 
            opacity: 0.5,
            transform: [
              { translateY: float2.interpolate({ inputRange: [0, 1], outputRange: [0, 50] }) },
              { scale: float2.interpolate({ inputRange: [0, 1], outputRange: [1, 1.3] }) }
            ]
          }
        ]}>
          <LinearGradient
            colors={['rgba(14, 165, 233, 0.25)', 'transparent']}
            style={{ width: SCREEN_WIDTH * 1.2, height: SCREEN_WIDTH * 1.2, borderRadius: SCREEN_WIDTH, position: 'absolute', bottom: -SCREEN_WIDTH * 0.3, right: -SCREEN_WIDTH * 0.3 }}
          />
        </Animated.View>

        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={onScroll}
          onMomentumScrollEnd={handleMomentumScrollEnd}
          scrollEventThrottle={16}
          bounces={false}
        >
          {SLIDES.map((slide, index) => {
            const inputRange = [
              (index - 1) * SCREEN_WIDTH,
              index * SCREEN_WIDTH,
              (index + 1) * SCREEN_WIDTH,
            ];

            const scale = scrollX.interpolate({
              inputRange,
              outputRange: [0.8, 1, 0.8],
              extrapolate: 'clamp',
            });

            const opacity = scrollX.interpolate({
              inputRange,
              outputRange: [0, 1, 0],
              extrapolate: 'clamp',
            });

            return (
              <View key={slide.id} style={styles.slide}>
                <Animated.View style={[styles.contentWrapper, { transform: [{ scale }], opacity }]}>
                  <View style={[styles.iconContainer, { backgroundColor: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)' }]}>
                    {slide.icon('#38bdf8')}
                  </View>
                  <Text style={[styles.subtitle, { color: '#38bdf8' }]}>{slide.subtitle.toUpperCase()}</Text>
                  <Text style={[styles.title, { color: '#ffffff' }]}>{slide.title}</Text>
                  <Text style={[styles.description, { color: 'rgba(255,255,255,0.8)' }]}>{slide.description}</Text>
                </Animated.View>
              </View>
            );
          })}
        </ScrollView>

        <View style={styles.footer}>
          <View style={styles.pagination}>
            {SLIDES.map((_, i) => {
              const inputRange = [
                (i - 1) * SCREEN_WIDTH,
                i * SCREEN_WIDTH,
                (i + 1) * SCREEN_WIDTH,
              ];
              const dotWidth = scrollX.interpolate({
                inputRange,
                outputRange: [8, 24, 8],
                extrapolate: 'clamp',
              });
              const dotOpacity = scrollX.interpolate({
                inputRange,
                outputRange: [0.3, 1, 0.3],
                extrapolate: 'clamp',
              });
              return (
                <Animated.View
                  key={i}
                  style={[
                    styles.dot,
                    { width: dotWidth, opacity: dotOpacity, backgroundColor: '#38bdf8' }
                  ]}
                />
              );
            })}
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleNext}
            style={styles.buttonWrapper}
          >
            <LinearGradient
              colors={['#0ea5e9', '#3b82f6']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.button}
            >
              <Text style={styles.buttonText}>
                {currentIndex === SLIDES.length - 1 ? 'Hadi Başlayalım' : 'Sonraki Adım'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  slide: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  contentWrapper: {
    alignItems: 'center',
    width: '100%',
    paddingBottom: SCREEN_HEIGHT * 0.1,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    borderWidth: 1,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 2,
    marginBottom: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 40,
  },
  description: {
    fontSize: 16,
    lineHeight: 26,
    textAlign: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 50 : 30,
    left: 30,
    right: 30,
    alignItems: 'center',
  },
  pagination: {
    flexDirection: 'row',
    height: 8,
    marginBottom: 32,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  buttonWrapper: {
    width: '100%',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  button: {
    width: '100%',
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
