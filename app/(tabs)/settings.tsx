import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView, Platform, Alert } from 'react-native';
import { FileCog, Lock, Moon, RefreshCw, Shield, Trash2 } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function SettingsScreen() {
  const [darkMode, setDarkMode] = useState(false);
  const [autoBackup, setAutoBackup] = useState(true);
  const [showFileExtensions, setShowFileExtensions] = useState(true);
  const [encryptFiles, setEncryptFiles] = useState(false);
  
  const handleClearAllData = () => {
    if (Platform.OS === 'web') {
      if (confirm('Are you sure you want to delete all files? This action cannot be undone.')) {
        // Clear data logic would go here
        alert('All data has been cleared');
      }
    } else {
      Alert.alert(
        'Clear All Data',
        'Are you sure you want to delete all files? This action cannot be undone.',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Delete All', 
            style: 'destructive',
            onPress: () => {
              // Clear data logic would go here
              Alert.alert('Success', 'All data has been cleared');
            }
          }
        ]
      );
    }
  };

  const settingsSections = [
    {
      title: 'Appearance',
      settings: [
        {
          id: 'darkMode',
          label: 'Dark Mode',
          type: 'switch',
          value: darkMode,
          onChange: setDarkMode,
          icon: <Moon size={20} color={Colors.text} />,
        },
        {
          id: 'fileExtensions',
          label: 'Show File Extensions',
          type: 'switch',
          value: showFileExtensions,
          onChange: setShowFileExtensions,
          icon: <FileCog size={20} color={Colors.text} />,
        },
      ],
    },
    {
      title: 'Sync & Backup',
      settings: [
        {
          id: 'autoBackup',
          label: 'Auto Backup',
          type: 'switch',
          value: autoBackup,
          onChange: setAutoBackup,
          icon: <RefreshCw size={20} color={Colors.text} />,
        },
      ],
    },
    {
      title: 'Security',
      settings: [
        {
          id: 'encryption',
          label: 'Encrypt Files',
          type: 'switch',
          value: encryptFiles,
          onChange: setEncryptFiles,
          icon: <Lock size={20} color={Colors.text} />,
        },
        {
          id: 'privacy',
          label: 'Privacy Policy',
          type: 'link',
          icon: <Shield size={20} color={Colors.text} />,
        },
      ],
    },
    {
      title: 'Data Management',
      settings: [
        {
          id: 'clearData',
          label: 'Clear All Data',
          type: 'button',
          destructive: true,
          onPress: handleClearAllData,
          icon: <Trash2 size={20} color={Colors.error} />,
        },
      ],
    },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Settings</Text>
      
      {settingsSections.map((section, sectionIndex) => (
        <Animated.View 
          key={section.title}
          entering={FadeInDown.delay(100 * sectionIndex).springify()}
          style={styles.section}
        >
          <Text style={styles.sectionTitle}>{section.title}</Text>
          <View style={styles.card}>
            {section.settings.map((setting, index) => (
              <View 
                key={setting.id}
                style={[
                  styles.settingRow,
                  index < section.settings.length - 1 && styles.settingBorder
                ]}
              >
                <View style={styles.settingLabelContainer}>
                  {setting.icon}
                  <Text 
                    style={[
                      styles.settingLabel,
                      setting.destructive && styles.destructiveText
                    ]}
                  >
                    {setting.label}
                  </Text>
                </View>
                
                {setting.type === 'switch' && (
                  <Switch
                    value={setting.value}
                    onValueChange={setting.onChange}
                    trackColor={{ false: Colors.border, true: Colors.primary }}
                    thumbColor={Colors.background}
                  />
                )}
                
                {setting.type === 'button' && (
                  <TouchableOpacity onPress={setting.onPress}>
                    <Text 
                      style={[
                        styles.buttonText,
                        setting.destructive && styles.destructiveText
                      ]}
                    >
                      {setting.label}
                    </Text>
                  </TouchableOpacity>
                )}
                
                {setting.type === 'link' && (
                  <TouchableOpacity>
                    <Text style={styles.linkText}>View</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>
        </Animated.View>
      ))}
      
      <View style={styles.footer}>
        <Text style={styles.version}>Version 1.0.0</Text>
      </View>
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
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: Colors.text,
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: Colors.secondaryText,
    marginBottom: 8,
    marginLeft: 4,
  },
  card: {
    backgroundColor: Colors.background,
    borderRadius: 12,
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
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  settingBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  settingLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.text,
    marginLeft: 12,
  },
  buttonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.primary,
  },
  linkText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.primary,
  },
  destructiveText: {
    color: Colors.error,
  },
  footer: {
    marginTop: 24,
    marginBottom: 16,
    alignItems: 'center',
  },
  version: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.secondaryText,
  },
});