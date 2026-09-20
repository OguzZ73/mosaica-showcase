import notifee, { AndroidImportance, TriggerType } from '@notifee/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

export interface RealityCheckItem {
  id: string;
  text: string;
}

export const REALITY_CHECKS: readonly RealityCheckItem[] = [
  { id: 'rc_hand', text: 'Ellerine bak — kaç parmak var? Gözlerini kapat, tekrar say.' },
  { id: 'rc_text', text: 'Yakındaki bir yazıyı oku. Gözünü al, tekrar bak. Değişti mi?' },
  { id: 'rc_clock', text: 'Saate bak, başını çevir, tekrar bak. Aynı saati gösteriyor mu?' },
  { id: 'rc_finger', text: 'İşaret parmağını diğer avucuna bastır. Geçiyor mu?' },
];

export class LucidNotificationService {
  async setup(): Promise<boolean> {
    const hasPermission = await notifee.requestPermission();
    if (hasPermission.authorizationStatus === 0) {
      return false; // Denied
    }

    if (Platform.OS === 'android') {
      await notifee.createChannel({
        id: 'reality-check-v6',
        name: 'Gerçeklik Testleri',
        importance: AndroidImportance.HIGH,
        sound: 'warning_ui',
      });
      await notifee.createChannel({
        id: 'sleep-quality-v5',
        name: 'Uyku Kalitesi',
        importance: AndroidImportance.HIGH,
        sound: 'warning_ui',
      });
      await notifee.createChannel({
        id: 'wbtb-alarm-v3',
        name: 'WBTB Alarmı',
        importance: AndroidImportance.HIGH,
        sound: 'wbtb_alarm',
      });
    } else if (Platform.OS === 'ios') {
      await notifee.setNotificationCategories([
        {
          id: 'REALITY_CHECK',
          actions: [
            { id: 'skip', title: 'Atla' },
            { id: 'done', title: '✓ Yaptım', foreground: true }
          ]
        },
        {
          id: 'SLEEP_QUALITY',
          actions: [
            { id: 'no_dream', title: 'Rüya yoktu' },
            { id: 'log_dream', title: '📝 Kaydet', foreground: true }
          ]
        }
      ]);
    }
    return true;
  }

  async cancelAll(): Promise<void> {
    const notifications = await notifee.getTriggerNotifications();
    const idsToCancel = notifications
      .map(n => n?.notification?.id)
      .filter((id): id is string => Boolean(id && (id.startsWith('rc_') || id.startsWith('sq_'))));

    if (idsToCancel.length > 0) {
      await notifee.cancelTriggerNotifications(idsToCancel);
    }
    await AsyncStorage.removeItem('lucid_last_scheduled');
  }

  async scheduleRealityChecks(): Promise<void> {
    const notifications = await notifee.getTriggerNotifications();
    const idsToCancel = notifications
      .map(n => n?.notification?.id)
      .filter((id): id is string => Boolean(id && id.startsWith('rc_')));
    if (idsToCancel.length > 0) {
      await notifee.cancelTriggerNotifications(idsToCancel);
    }

    const now = new Date();
    for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
      const targetDate = new Date(now);
      targetDate.setDate(now.getDate() + dayOffset);

      const periods = [
        { start: 9, end: 12 },
        { start: 13, end: 18 },
      ];

      for (let i = 0; i < periods.length; i++) {
        const p = periods[i];
        const hour = p.start + Math.floor(Math.random() * (p.end - p.start));
        const minute = Math.floor(Math.random() * 60);

        const scheduledTime = new Date(targetDate);
        scheduledTime.setHours(hour, minute, 0, 0);

        if (scheduledTime.getTime() > now.getTime()) {
          const test = REALITY_CHECKS[Math.floor(Math.random() * REALITY_CHECKS.length)];
          const index = `${dayOffset}_${i}_${scheduledTime.getTime()}`;
          
          await notifee.createTriggerNotification({
            id: `rc_${index}`,
            title: '🔍 Gerçeklik Testi',
            subtitle: 'Hemen etrafına bak!',
            body: test.text,
            data: { type: 'REALITY_CHECK', testId: test.id },
            android: {
              channelId: 'reality-check-v6',
              actions: [
                { title: 'Atla', pressAction: { id: 'skip' } },
                { title: '✓ Yaptım', pressAction: { id: 'done', launchActivity: 'default' } },
              ],
            },
            ios: {
              categoryId: 'REALITY_CHECK',
              interruptionLevel: 'timeSensitive',
              threadId: 'reality_checks',
              sound: 'warning_ui.wav'
            }
          }, {
            type: TriggerType.TIMESTAMP,
            timestamp: scheduledTime.getTime(),
            alarmManager: Platform.OS === 'android' ? { allowWhileIdle: true } : undefined,
          });
        }
      }
    }

    await AsyncStorage.setItem('lucid_last_scheduled', now.toISOString());
  }

  async scheduleWBTBNotification(timestamp: number): Promise<void> {
    await notifee.createTriggerNotification({
      id: 'wbtb_alarm',
      title: '⏰ Uyan ve Tekrar Uyu (WBTB)',
      subtitle: 'Lucid Rüya Zamanı',
      body: 'Uyanma vakti! Biraz rüya günlüğünü oku ve MİLD tekniğiyle tekrar uyu.',
      data: { type: 'WBTB_ALARM' },
      android: {
        channelId: 'wbtb-alarm-v3',
        importance: AndroidImportance.HIGH,
        actions: [
          { title: 'Uyandım', pressAction: { id: 'wbtb_wake', launchActivity: 'default' } },
        ],
      },
      ios: {
        interruptionLevel: 'timeSensitive',
        threadId: 'wbtb',
        sound: 'wbtb_alarm.wav'
      }
    }, {
      type: TriggerType.TIMESTAMP,
      timestamp,
      alarmManager: Platform.OS === 'android' ? { allowWhileIdle: true } : undefined,
    });
  }
}

export default new LucidNotificationService();
