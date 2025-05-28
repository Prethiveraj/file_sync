import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Platform, KeyboardAvoidingView } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import * as FileSystem from 'expo-file-system';
import { useAppState } from '@/contexts/AppStateContext';
import { FileItem, getFileContents, saveFileContents } from '@/utils/fileSystem';
import { ChevronLeft, Delete, Download, MoveHorizontal as MoreHorizontal, Save, Share as ShareIcon } from 'lucide-react-native';
import { Loader } from '@/components/Loader';
import Colors from '@/constants/Colors';
import { formatDate } from '@/utils/dateUtils';
import * as Sharing from 'expo-sharing';

export default function FileDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { appDirectory } = useAppState();
  
  const [file, setFile] = useState<FileItem | null>(null);
  const [content, setContent] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    loadFile();
  }, [id, appDirectory]);

  const loadFile = async () => {
    if (!appDirectory || !id) return;
    
    try {
      setIsLoading(true);
      const fileUri = `${appDirectory}${id}.json`;
      const fileInfo = await FileSystem.getInfoAsync(fileUri);
      
      if (fileInfo.exists) {
        const fileData = await getFileContents(appDirectory, id as string);
        setFile(fileData);
        setContent(fileData.content || '');
        setFileName(fileData.name);
      } else {
        console.error('File does not exist');
        router.back();
      }
    } catch (error) {
      console.error('Error loading file:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveFile = async () => {
    if (!appDirectory || !id || !file) return;
    
    try {
      setIsSaving(true);
      
      const updatedFile: FileItem = {
        ...file,
        name: fileName,
        content,
        modifiedAt: new Date().toISOString(),
      };
      
      await saveFileContents(appDirectory, updatedFile);
      setFile(updatedFile);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving file:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const shareFile = async () => {
    if (!file || !appDirectory) return;
    
    if (Platform.OS === 'web') {
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${fileName}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      // For native platforms
      try {
        const tempFilePath = `${FileSystem.cacheDirectory}${fileName}.txt`;
        await FileSystem.writeAsStringAsync(tempFilePath, content);
        
        const isAvailable = await Sharing.isAvailableAsync();
        if (isAvailable) {
          await Sharing.shareAsync(tempFilePath);
        }
      } catch (error) {
        console.error('Error sharing file:', error);
      }
    }
  };

  const deleteFile = async () => {
    if (!appDirectory || !id) return;
    
    const confirmDelete = Platform.OS === 'web' 
      ? confirm('Are you sure you want to delete this file?')
      : true; // For native, we'll use Alert
    
    if (confirmDelete) {
      try {
        const fileUri = `${appDirectory}${id}.json`;
        await FileSystem.deleteAsync(fileUri);
        router.back();
      } catch (error) {
        console.error('Error deleting file:', error);
      }
    }
  };

  if (isLoading) {
    return <Loader message="Loading file..." />;
  }

  return (
    <>
      <Stack.Screen 
        options={{
          headerShown: true,
          headerTitle: "",
          headerLeft: () => (
            <TouchableOpacity 
              style={styles.headerButton} 
              onPress={() => router.back()}
            >
              <ChevronLeft size={24} color={Colors.text} />
              <Text style={styles.headerButtonText}>Back</Text>
            </TouchableOpacity>
          ),
          headerRight: () => (
            <View style={styles.headerRightContainer}>
              {isEditing ? (
                <TouchableOpacity 
                  style={[styles.headerActionButton, styles.saveButton]} 
                  onPress={saveFile}
                  disabled={isSaving}
                >
                  <Save size={16} color={Colors.background} />
                  <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
              ) : (
                <>
                  <TouchableOpacity style={styles.headerIconButton} onPress={shareFile}>
                    <ShareIcon size={20} color={Colors.text} />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.headerIconButton} onPress={deleteFile}>
                    <Delete size={20} color={Colors.error} />
                  </TouchableOpacity>
                </>
              )}
            </View>
          ),
        }}
      />
      
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        <ScrollView 
          style={styles.container} 
          contentContainerStyle={styles.contentContainer}
        >
          {file && (
            <>
              <View style={styles.fileHeader}>
                {isEditing ? (
                  <TextInput
                    style={styles.fileNameInput}
                    value={fileName}
                    onChangeText={setFileName}
                    placeholder="Untitled"
                    autoFocus
                    selectTextOnFocus
                  />
                ) : (
                  <Text style={styles.fileName}>{fileName}</Text>
                )}
                
                <Text style={styles.fileDate}>
                  Modified {formatDate(file.modifiedAt)}
                </Text>
              </View>
              
              <View style={styles.editorContainer}>
                {isEditing ? (
                  <TextInput
                    style={styles.editor}
                    value={content}
                    onChangeText={setContent}
                    multiline
                    placeholder="Write something..."
                    placeholderTextColor={Colors.secondaryText}
                  />
                ) : (
                  <View style={styles.viewModeContainer}>
                    <ScrollView style={styles.contentView}>
                      <Text style={styles.contentText}>
                        {content || 'No content'}
                      </Text>
                    </ScrollView>
                    
                    <TouchableOpacity 
                      style={styles.editButton}
                      onPress={() => setIsEditing(true)}
                    >
                      <Text style={styles.editButtonText}>Edit</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40, // Extra padding at bottom
  },
  headerButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.text,
    marginLeft: 4,
  },
  headerRightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIconButton: {
    padding: 8,
    marginLeft: 8,
  },
  headerActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  saveButton: {
    backgroundColor: Colors.primary,
  },
  saveButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.background,
    marginLeft: 4,
  },
  fileHeader: {
    marginBottom: 24,
  },
  fileName: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: Colors.text,
    marginBottom: 4,
  },
  fileNameInput: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: Colors.text,
    marginBottom: 4,
    padding: 0,
    borderBottomWidth: 1,
    borderBottomColor: Colors.primary,
  },
  fileDate: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.secondaryText,
  },
  editorContainer: {
    flex: 1,
    borderRadius: 12,
    backgroundColor: Colors.backgroundDark,
    minHeight: 300,
  },
  editor: {
    flex: 1,
    padding: 16,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.text,
    textAlignVertical: 'top',
    minHeight: 300,
  },
  viewModeContainer: {
    flex: 1,
  },
  contentView: {
    padding: 16,
    minHeight: 300,
  },
  contentText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.text,
    lineHeight: 24,
  },
  editButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.2)',
      }
    }),
  },
  editButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.background,
  },
});