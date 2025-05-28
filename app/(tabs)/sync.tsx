import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Switch, ScrollView, Platform } from 'react-native';
import { useAppState } from '@/contexts/AppStateContext';
import Colors from '@/constants/Colors';
import { DeviceCard } from '@/components/DeviceCard';
import { Key as KeyIcon, Laptop, RefreshCw, Smartphone, Trash2 } from 'lucide-react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

type DeviceType = {
  id: string;
  name: string;
  type: 'mobile' | 'desktop';
  lastSync: string;
  isConnected: boolean;
};

// Mock devices for UI demonstration
const mockDevices: DeviceType[] = [
  {
    id: '1',
    name: 'My iPhone',
    type: 'mobile',
    lastSync: '2 minutes ago',
    isConnected: true,
  },
  {
    id: '2',
    name: 'MacBook Pro',
    type: 'desktop',
    lastSync: 'Just now',
    isConnected: true,
  },
  {
    id: '3',
    name: 'Work iPad',
    type: 'mobile',
    lastSync: '3 hours ago',
    isConnected: false,
  },
];

export default function SyncScreen() {
  const { appDirectory } = useAppState();
  const [devices, setDevices] = useState<DeviceType[]>(mockDevices);
  const [autoSync, setAutoSync] = useState(true);
  const [deviceName, setDeviceName] = useState('My Device');
  const [deviceId, setDeviceId] = useState('ABC123XYZ');

  const handleRemoveDevice = (id: string) => {
    setDevices(devices.filter(device => device.id !== id));
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>This Device</Text>
        <View style={styles.card}>
          <View style={styles.deviceInfo}>
            <View style={styles.deviceHeader}>
              {Platform.OS === 'web' ? (
                <Laptop size={24} color={Colors.primary} />
              ) : (
                <Smartphone size={24} color={Colors.primary} />
              )}
              <TextInput
                style={styles.deviceNameInput}
                value={deviceName}
                onChangeText={setDeviceName}
                placeholder="Device Name"
              />
            </View>
            
            <View style={styles.deviceIdContainer}>
              <KeyIcon size={16} color={Colors.secondaryText} />
              <Text style={styles.deviceId}>{deviceId}</Text>
            </View>

            <Text style={styles.storageInfo}>
              Storage Path: {appDirectory || 'Not available on web'}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sync Settings</Text>
        <View style={styles.card}>
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Auto-sync files</Text>
            <Switch
              value={autoSync}
              onValueChange={setAutoSync}
              trackColor={{ false: Colors.border, true: Colors.primary }}
              thumbColor={Colors.background}
            />
          </View>

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Sync frequency</Text>
            <Text style={styles.settingValue}>
              {autoSync ? 'Real-time' : 'Manual only'}
            </Text>
          </View>

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Network restrictions</Text>
            <Text style={styles.settingValue}>Wi-Fi only</Text>
          </View>

          <TouchableOpacity style={styles.syncButton}>
            <RefreshCw size={18} color={Colors.background} />
            <Text style={styles.syncButtonText}>Sync Now</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Connected Devices</Text>
        {devices.length > 0 ? (
          devices.map((device, index) => (
            <Animated.View 
              key={device.id}
              entering={FadeInDown.delay(100 * index).springify()}
            >
              <DeviceCard
                device={device}
                onRemove={() => handleRemoveDevice(device.id)}
              />
            </Animated.View>
          ))
        ) : (
          <Animated.View entering={FadeIn.duration(400)}>
            <View style={styles.emptyDevices}>
              <Text style={styles.emptyTitle}>No Connected Devices</Text>
              <Text style={styles.emptyMessage}>
                Pair with another device to sync your files automatically
              </Text>
            </View>
          </Animated.View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Add New Device</Text>
        <View style={styles.card}>
          <Text style={styles.helperText}>
            To connect a new device, open the app on that device and scan this device's unique ID, or enter the other device's ID below.
          </Text>
          
          <View style={styles.codeInputContainer}>
            <TextInput
              style={styles.codeInput}
              placeholder="Enter device ID..."
              placeholderTextColor={Colors.secondaryText}
            />
            <TouchableOpacity style={styles.connectButton}>
              <Text style={styles.connectButtonText}>Connect</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.spacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundDark,
  },
  content: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: Colors.text,
    marginBottom: 12,
  },
  card: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.1)',
      }
    }),
  },
  deviceInfo: {
    marginBottom: 8,
  },
  deviceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  deviceNameInput: {
    fontSize: 18,
    fontFamily: 'Inter-Medium',
    color: Colors.text,
    marginLeft: 12,
    flex: 1,
    padding: 0, // Remove padding for cleaner look
  },
  deviceIdContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  deviceId: {
    fontFamily: 'Inter-Medium',
    color: Colors.secondaryText,
    fontSize: 14,
    marginLeft: 8,
  },
  storageInfo: {
    fontFamily: 'Inter-Regular',
    color: Colors.secondaryText,
    fontSize: 14,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  settingLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.text,
  },
  settingValue: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.secondaryText,
  },
  syncButton: {
    flexDirection: 'row',
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  syncButtonText: {
    color: Colors.background,
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    marginLeft: 8,
  },
  emptyDevices: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 18,
    color: Colors.text,
    marginBottom: 8,
  },
  emptyMessage: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.secondaryText,
    textAlign: 'center',
  },
  helperText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.secondaryText,
    marginBottom: 16,
    lineHeight: 20,
  },
  codeInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  codeInput: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.text,
  },
  connectButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginLeft: 8,
    height: 48,
    justifyContent: 'center',
  },
  connectButtonText: {
    color: Colors.background,
    fontFamily: 'Inter-Medium',
    fontSize: 16,
  },
  spacer: {
    height: 40,
  },
});