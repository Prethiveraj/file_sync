import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FilePlus2 } from 'lucide-react-native';
import Colors from '@/constants/Colors';

type EmptyStateProps = {
  title: string;
  message: string;
  action?: string;
  onAction?: () => void;
};

export function EmptyState({ title, message, action, onAction }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <FilePlus2 size={64} color={Colors.secondaryText} style={styles.icon} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      
      {action && onAction && (
        <TouchableOpacity style={styles.actionButton} onPress={onAction}>
          <Text style={styles.actionText}>{action}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    minHeight: 300,
  },
  icon: {
    marginBottom: 16,
    opacity: 0.5,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: Colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: Colors.secondaryText,
    textAlign: 'center',
    marginBottom: 24,
  },
  actionButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  actionText: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
});