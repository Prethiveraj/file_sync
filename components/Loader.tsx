import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import Colors from '@/constants/Colors';

type LoaderProps = {
  message?: string;
};

export function Loader({ message = 'Loading...' }: LoaderProps) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={Colors.primary} />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.backgroundDark,
  },
  message: {
    marginTop: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: Colors.secondaryText,
  },
});