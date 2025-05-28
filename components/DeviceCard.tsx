import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Laptop, Smartphone, Trash2 } from 'lucide-react-native';
import Colors from '@/constants/Colors';

type DeviceType = {
  id: string;
  name: string;
  type: 'mobile' | 'desktop';
  lastSync: string;
  isConnected: boolean;
};

type DeviceCardProps = {
  device: DeviceType;
  onRemove: () => void;
};

export function DeviceCard({ device, onRemove }: DeviceCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.deviceInfo}>
        <View style={styles.iconContainer}>
          {device.type === 'mobile' ? (
            <Smartphone size={24} color={Colors.primary} />
          ) : (
            <Laptop size={24} color={Colors.primary} />
          )}
        </View>
        
        <View style={styles.textContainer}>
          <Text style={styles.deviceName}>{device.name}</Text>
          <View style={styles.statusContainer}>
            <View 
              style={[
                styles.statusIndicator,
                device.isConnected ? styles.connectedIndicator : styles.disconnectedIndicator
              ]} 
            />
            <Text style={styles.statusText}>
              {device.isConnected ? 'Connected' : 'Disconnected'}
            </Text>
          </View>
        </View>
      </View>
      
      <View style={styles.actions}>
        <Text style={styles.syncTime}>
          Last sync: {device.lastSync}
        </Text>
        
        <TouchableOpacity 
          style={styles.removeButton}
          onPress={onRemove}
          hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
        >
          <Trash2 size={20} color={Colors.secondaryText} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
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
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.backgroundDark,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  deviceName: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.text,
    marginBottom: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  connectedIndicator: {
    backgroundColor: Colors.success,
  },
  disconnectedIndicator: {
    backgroundColor: Colors.secondaryText,
  },
  statusText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.secondaryText,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  syncTime: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.secondaryText,
  },
  removeButton: {
    padding: 4,
  },
});