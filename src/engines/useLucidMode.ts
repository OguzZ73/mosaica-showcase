import { useState, useEffect } from 'react';
import { Alert, AppState, Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import notifee, { EventType } from '@notifee/react-native';
import LucidNotificationService from '../services/LucidNotificationService';
import { supabase } from '../utils/supabaseClient';

export function useLucidMode() {
  const [isActive, setIsActive] = useState(false);
  const [isMildActive, setIsMildActive] = useState(false);
  const [isFildActive, setIsFildActive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [streak, setStreak] = useState(0);

  const [isSsildWbtbActive, setIsSsildWbtbActive] = useState(false);
  const [isSsildRoutineActive, setIsSsildRoutineActive] = useState(false);

  const [isWbtbActive, setIsWbtbActive] = useState(false);
  const [wbtbHistory, setWbtbHistory] = useState([]); // Array of ISO date strings
  
  const [isWbtbSessionActive, setIsWbtbSessionActive] = useState(false);
  const [wbtbSessionEndTime, setWbtbSessionEndTime] = useState(null);

  const checkWbtbSession = async () => {
    try {
      const attemptId = await AsyncStorage.getItem('lucid_wbtb_current_attempt_id');
      if (attemptId) {
        const { data: attempt } = await supabase
          .from('wbtb_attempts')
          .select('status, scheduled_for')
          .eq('id', attemptId)
          .single();

        if (attempt && attempt.status === 'pending') {
          const scheduledTime = new Date(attempt.scheduled_for).getTime();
          const now = new Date().getTime();
          const windowMs = 60 * 60 * 1000;
          // Alarm has rung and it is within the 1 hour window
          if (now >= scheduledTime && now <= scheduledTime + windowMs) {
            setIsWbtbSessionActive(true);
            setWbtbSessionEndTime(scheduledTime + windowMs);
          } else if (now > scheduledTime + windowMs) {
            await supabase
              .from('wbtb_attempts')
              .update({ status: 'failed' })
              .eq('id', attemptId);
            await AsyncStorage.removeItem('lucid_wbtb_current_attempt_id');
            setIsWbtbSessionActive(false);
            setWbtbSessionEndTime(null);
          } else {
            setIsWbtbSessionActive(false);
            setWbtbSessionEndTime(null);
          }
        } else {
          setIsWbtbSessionActive(false);
          setWbtbSessionEndTime(null);
        }
      } else {
        setIsWbtbSessionActive(false);
        setWbtbSessionEndTime(null);
      }
    } catch (e) {
      console.error(e);
      setIsWbtbSessionActive(false);
      setWbtbSessionEndTime(null);
    }
  };

  useEffect(() => {
    const loadState = async () => {
      try {
        const val = await AsyncStorage.getItem('lucid_mode_active');
        setIsActive(val === 'true');
        
        const mildVal = await AsyncStorage.getItem('lucid_mild_active');
        setIsMildActive(mildVal === 'true');

        const fildVal = await AsyncStorage.getItem('lucid_fild_active');
        setIsFildActive(fildVal === 'true');

        const wbtbVal = await AsyncStorage.getItem('lucid_wbtb_active');
        setIsWbtbActive(wbtbVal === 'true');

        const ssildWbtbVal = await AsyncStorage.getItem('lucid_ssild_wbtb_active');
        setIsSsildWbtbActive(ssildWbtbVal === 'true');

        const ssildRoutineVal = await AsyncStorage.getItem('lucid_ssild_routine_active');
        setIsSsildRoutineActive(ssildRoutineVal === 'true');

        const historyStr = await AsyncStorage.getItem('lucid_wbtb_history');
        if (historyStr) {
          const parsed = JSON.parse(historyStr);
          // Only keep history from the last 7 days
          const oneWeekAgo = new Date();
          oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
          const recentHistory = parsed.filter(d => new Date(d) > oneWeekAgo);
          setWbtbHistory(recentHistory);
          if (recentHistory.length !== parsed.length) {
            await AsyncStorage.setItem('lucid_wbtb_history', JSON.stringify(recentHistory));
          }
        }

        const streakStr = await AsyncStorage.getItem('lucid_streak');
        setStreak(streakStr ? parseInt(streakStr, 10) : 0);

        // Gece uyanılamayan WBTB alarmlarını ve aktif oturumu kontrol et
        await checkWbtbSession();
      } catch (err) {
        console.error('Error loading lucid mode state:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadState();

    const subscription = AppState.addEventListener('change', nextAppState => {
      if (nextAppState === 'active') {
        checkWbtbSession();
      }
    });

    const notifeeUnsub = notifee.onForegroundEvent(async ({ type, detail }) => {
      if (type === EventType.DELIVERED && detail.notification?.data?.type === 'WBTB_ALARM') {
        checkWbtbSession();
      }
    });

    return () => {
      subscription.remove();
      notifeeUnsub();
    };
  }, []);

  const toggleLucidMode = async (wakeHour = 8, wakeMinute = 0) => {
    const newValue = !isActive;
    setIsActive(newValue); // Optimistic UI update

    try {
      if (!newValue) {
        // Kapatırken
        await LucidNotificationService.cancelAll();
        await AsyncStorage.removeItem('lucid_mode_active');
      } else {
        // Açarken
        const setupSuccess = await LucidNotificationService.setup();
        if (!setupSuccess) {
          setIsActive(false); // Rollback
          Alert.alert(
            'İzin Gerekli',
            'Bildirim izni vermediğiniz için bu özellik kullanılamıyor. Lütfen cihaz ayarlarından bildirimlere izin verin.',
            [
              { text: 'Vazgeç', style: 'cancel' },
              { text: 'Ayarlara Git', onPress: () => Linking.openSettings() }
            ]
          );
          return;
        }

        await LucidNotificationService.scheduleRealityChecks();
        await LucidNotificationService.scheduleMorningNotifications(wakeHour, wakeMinute);
        await AsyncStorage.setItem('lucid_mode_active', 'true');
      }
    } catch (err) {
      console.error('Error toggling lucid mode:', err);
      setIsActive(!newValue); // Rollback
      Alert.alert('Hata', 'İşlem sırasında bir sorun oluştu.');
    }
  };

  const canScheduleMild = async () => {
    const { data: authData } = await supabase.auth.getUser();
    if (!authData?.user) return { allowed: false, reason: 'Giriş yapmanız gerekiyor.' };

    const { count: dreamCount } = await supabase
      .from('dreams')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', authData.user.id);
      
    if (dreamCount === null || dreamCount < 3) {
      return { allowed: false, reason: 'MILD tekniğini aktif edebilmek için uygulamaya en az 3 rüya kaydetmiş olmanız gerekmektedir.' };
    }
    return { allowed: true, reason: '' };
  };

  const toggleMildMode = async () => {
    const newValue = !isMildActive;
    
    // Optimistic UI update
    if (newValue) {
      setIsMildActive(true);
      // MILD açılmak isteniyor, kuralı kontrol et
      const check = await canScheduleMild();
      if (!check.allowed) {
        setIsMildActive(false); // Rollback
        return check;
      }
    } else {
      setIsMildActive(false);
    }

    try {
      await AsyncStorage.setItem('lucid_mild_active', newValue ? 'true' : 'false');
      return { allowed: true, reason: '' };
    } catch (err) {
      console.error('Error toggling mild mode:', err);
      setIsMildActive(!newValue); // Rollback
      return { allowed: false, reason: 'Bir hata oluştu.' };
    }
  };

  const toggleFildMode = async () => {
    // Eğer SSILD (Routine) açıksa FILD açılamaz
    if (!isFildActive && isSsildRoutineActive) {
      Alert.alert('Çakışma', 'SSILD Uyku Rutini modu aktifken FILD açılamaz. Lütfen önce SSILD (Uyku Rutini) modunu kapatın.');
      return { allowed: false, reason: 'SSILD (Uyku Rutini) ile çakışıyor.' };
    }

    const newValue = !isFildActive;
    
    // Optimistic UI update
    setIsFildActive(newValue);

    try {
      await AsyncStorage.setItem('lucid_fild_active', newValue ? 'true' : 'false');
      return { allowed: true, reason: '' };
    } catch (err) {
      console.error('Error toggling fild mode:', err);
      setIsFildActive(!newValue); // Rollback
      return { allowed: false, reason: 'Bir hata oluştu.' };
    }
  };

  const toggleSsildWbtbMode = async () => {
    const newValue = !isSsildWbtbActive;
    setIsSsildWbtbActive(newValue);
    try {
      await AsyncStorage.setItem('lucid_ssild_wbtb_active', newValue ? 'true' : 'false');
      return { allowed: true, reason: '' };
    } catch (err) {
      console.error('Error toggling ssild wbtb mode:', err);
      setIsSsildWbtbActive(!newValue);
      return { allowed: false, reason: 'Bir hata oluştu.' };
    }
  };

  const toggleSsildRoutineMode = async () => {
    // Eğer FILD açıksa SSILD Routine açılamaz
    if (!isSsildRoutineActive && isFildActive) {
      Alert.alert('Çakışma', 'FILD modu aktifken SSILD Uyku Rutini açılamaz. Lütfen önce FILD modunu kapatın.');
      return { allowed: false, reason: 'FILD ile çakışıyor.' };
    }

    const newValue = !isSsildRoutineActive;
    setIsSsildRoutineActive(newValue);
    try {
      await AsyncStorage.setItem('lucid_ssild_routine_active', newValue ? 'true' : 'false');
      return { allowed: true, reason: '' };
    } catch (err) {
      console.error('Error toggling ssild routine mode:', err);
      setIsSsildRoutineActive(!newValue);
      return { allowed: false, reason: 'Bir hata oluştu.' };
    }
  };

  const canScheduleWbtb = async () => {
    // 1. Check max 2 times a week
    if (wbtbHistory.length >= 2) {
      return { allowed: false, reason: 'Haftalık limit (2/2) doldu. Etkisini kaybetmemesi için haftada en fazla 2 kez yapılmalıdır.' };
    }
    
    // 2. Check time (must be between 22:00 and 02:00)
    const currentHour = new Date().getHours();
    const isAllowedTime = (currentHour >= 22) || (currentHour >= 0 && currentHour < 2);
    
    if (!isAllowedTime) {
      return { allowed: false, reason: 'WBTB modunu sadece gece 22:00 ile 02:00 saatleri arasında aktif edebilirsiniz.' };
    }
    
    // 3. Yaş ve MILD kısıtlamaları
    const { data: authData } = await supabase.auth.getUser();
    if (!authData?.user) return { allowed: false, reason: 'Giriş yapmanız gerekiyor.' };

    const { data: profile } = await supabase.from('users').select('birth_date').eq('id', authData.user.id).single();
    if (!profile?.birth_date) {
      return { allowed: false, reason: 'WBTB modunu kullanabilmek için profilinizde doğum tarihinizi belirtmiş olmalısınız.' };
    }
    const age = new Date().getFullYear() - new Date(profile.birth_date).getFullYear();
    if (age < 18) {
      return { allowed: false, reason: 'WBTB modunu kullanabilmek için 18 yaşından büyük olmalısınız.' };
    }
    
    return { allowed: true, reason: '' };
  };

  const cancelWbtbMode = async () => {
    setIsWbtbActive(false); // Optimistic Update
    try {
      await LucidNotificationService.cancelWBTBNotification();
      
      const attemptId = await AsyncStorage.getItem('lucid_wbtb_current_attempt_id');
      if (attemptId) {
        await supabase.from('wbtb_attempts').update({ status: 'cancelled' }).eq('id', attemptId);
        await AsyncStorage.removeItem('lucid_wbtb_current_attempt_id');
      }

      await AsyncStorage.setItem('lucid_wbtb_active', 'false');
    } catch (err) {
      console.error('Error cancelling wbtb mode:', err);
      setIsWbtbActive(true); // Rollback
    }
  };

  // Test alarmı işlevi kaldırıldı

  const scheduleWbtb = async (hours, minutes) => {
    setIsWbtbActive(true); // Optimistic Update

    const check = await canScheduleWbtb();
    if (!check.allowed) {
      setIsWbtbActive(false); // Rollback
      Alert.alert('Kullanılamaz', check.reason);
      return false;
    }

    try {
      // Setup permission if not already
      const hasPermission = await LucidNotificationService.setup();
      if (!hasPermission) {
        setIsWbtbActive(false); // Rollback
        Alert.alert(
          'İzin Gerekli', 
          'Bildirim izni vermediğiniz için alarm kurulamıyor. Lütfen cihaz ayarlarından bildirimlere izin verin.',
          [
            { text: 'Vazgeç', style: 'cancel' },
            { text: 'Ayarlara Git', onPress: () => Linking.openSettings() }
          ]
        );
        return false;
      }

      // Calculate sleep time
      const now = new Date();
      let sleepDate = new Date();
      sleepDate.setHours(hours, minutes, 0, 0);

      // If it's currently evening (e.g. 23:00) and selected time is early morning (e.g. 01:00), 
      // the sleep date is actually tomorrow.
      if (now.getHours() > 12 && hours < 12) {
        sleepDate.setDate(sleepDate.getDate() + 1);
      }
      
      // If it's currently early morning (e.g. 01:00) and selected time is evening (e.g. 23:00),
      // the sleep date is actually yesterday.
      if (now.getHours() < 12 && hours > 12) {
        sleepDate.setDate(sleepDate.getDate() - 1);
      }

      // WBTB alarm is exactly 4.5 hours after sleep time
      const wakeTime = new Date(sleepDate.getTime() + 4.5 * 60 * 60 * 1000);

      // Background veritabanı kaydı
      supabase.auth.getUser().then(async ({ data: userData }) => {
        if (userData?.user) {
          const { data: wbtbRecord } = await supabase
            .from('wbtb_attempts')
            .insert({
              user_id: userData.user.id,
              scheduled_for: wakeTime.toISOString(),
              status: 'pending'
            })
            .select('id')
            .single();
            
          if (wbtbRecord) {
            await AsyncStorage.setItem('lucid_wbtb_current_attempt_id', wbtbRecord.id);
          }
        }
      });

      // Schedule notification
      await LucidNotificationService.scheduleWBTBNotification(wakeTime.getTime());
      
      // Update state & history
      await AsyncStorage.setItem('lucid_wbtb_active', 'true');

      const newHistory = [...wbtbHistory, new Date().toISOString()];
      setWbtbHistory(newHistory);
      await AsyncStorage.setItem('lucid_wbtb_history', JSON.stringify(newHistory));

      // Also ensure MILD is active, as WBTB relies on it
      if (!isMildActive) {
        toggleMildMode(); // Background call
      }

      return wakeTime;
    } catch (err) {
      console.error('Error scheduling wbtb:', err);
      setIsWbtbActive(false); // Rollback
      return false;
    }
  };

  const requestManualRC = async () => {
    try {
      const lastManualRCDate = await AsyncStorage.getItem('lucid_last_manual_rc_date');
      const today = new Date().toISOString().split('T')[0]; // "YYYY-MM-DD"
      
      // TEST AŞAMASI: Günde 1 sınırını geçici olarak kaldırdık
      // if (lastManualRCDate === today) {
      //   return false; 
      // }

      const hasPermission = await LucidNotificationService.setup();
      if (!hasPermission) {
        Alert.alert(
          'İzin Gerekli', 
          'Bildirim izni vermediğiniz için bu özellik kullanılamıyor. Lütfen cihaz ayarlarından bildirimlere izin verin.',
          [
            { text: 'Vazgeç', style: 'cancel' },
            { text: 'Ayarlara Git', onPress: () => Linking.openSettings() }
          ]
        );
        return false;
      }

      await LucidNotificationService.triggerManualRealityCheck();
      await AsyncStorage.setItem('lucid_last_manual_rc_date', today);
      return true;
    } catch (err) {
      console.error('Error triggering manual RC:', err);
      return false;
    }
  };

  const resumeWbtbSession = async () => {
    try {
      await LucidNotificationService.cancelWBTBNotification();
      const attemptId = await AsyncStorage.getItem('lucid_wbtb_current_attempt_id');
      if (attemptId) {
        await supabase.from('wbtb_attempts').update({ status: 'success' }).eq('id', attemptId);
        await AsyncStorage.removeItem('lucid_wbtb_current_attempt_id');
      }
      setIsWbtbSessionActive(false);
    } catch (e) {
      console.error('Error resuming wbtb session:', e);
    }
  };

  return { 
    isActive, 
    isMildActive, 
    isFildActive,
    isWbtbActive,
    wbtbHistory,
    isSsildWbtbActive,
    isSsildRoutineActive,
    isLoading, 
    streak, 
    toggleLucidMode, 
    toggleMildMode,
    toggleFildMode,
    toggleSsildWbtbMode,
    toggleSsildRoutineMode,
    canScheduleWbtb,
    scheduleWbtb,
    cancelWbtbMode,
    requestManualRC,
    isWbtbSessionActive,
    wbtbSessionEndTime,
    resumeWbtbSession
  };
}
