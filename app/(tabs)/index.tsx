import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Platform, TextInput } from 'react-native';
import { router } from 'expo-router';
import * as FileSystem from 'expo-file-system';
import { useAppState } from '@/contexts/AppStateContext';
import { FileItem, createEmptyFile, getFileIcon, getFileList } from '@/utils/fileSystem';
import { FileCard } from '@/components/FileCard';
import { Loader } from '@/components/Loader';
import { Plus, Search, X , Save} from 'lucide-react-native';
import { EmptyState } from '@/components/EmptyState';
import Colors from '@/constants/Colors';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function FilesScreen() {
  const { appDirectory } = useAppState();
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const loadFiles = async () => {
    if (!appDirectory) return;
    
    try {
      setIsLoading(true);
      const fileList = await getFileList(appDirectory);
      setFiles(fileList);
    } catch (error) {
      console.error('Error loading files:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (appDirectory) {
      loadFiles();
    }
  }, [appDirectory]);

  const handleCreateFile = async () => {
    if (!appDirectory) return;
    
    try {
      const newFile = await createEmptyFile(appDirectory);
      router.push(`/file/${newFile.id}`);
      loadFiles();
    } catch (error) {
      console.error('Error creating file:', error);
    }
  };

  const filteredFiles = files.filter(file => 
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderItem = ({ item }: { item: FileItem }) => (
    <Animated.View entering={FadeInDown.delay(100 * Math.min(files.indexOf(item), 5)).springify()}>
      <FileCard 
        file={item} 
        onPress={() => router.push(`/file/${item.id}`)} 
        onRefresh={loadFiles}
      />
    </Animated.View>
  );

  if (isLoading && files.length === 0) {
    return <Loader message="Loading files..." />;
  }

  return (
    <View style={styles.container}>
      {showSearch ? (
        <View style={styles.searchContainer}>
          <Search size={20} stroke={Colors.secondaryText} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search files..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
          />
          <TouchableOpacity onPress={() => {
            setSearchQuery('');
            setShowSearch(false);
          }}>
            <X size={20} color={Colors.secondaryText} />
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.header}>
          <Text style={styles.title}>My Files</Text>
          <View style={styles.headerButtons}>
            <TouchableOpacity 
              style={styles.iconButton} 
              onPress={() => setShowSearch(true)}
            >
              <Search size={22} color={Colors.text} />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {files.length === 0 ? (
        <EmptyState 
          title="No files yet" 
          message="Create your first file to get started"
          action="Create File"
          onAction={handleCreateFile}
        />
      ) : (
        <FlatList
          data={filteredFiles}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            searchQuery ? (
              <EmptyState 
                title="No matches found" 
                message={`No files matching "${searchQuery}"`}
                action="Clear Search"
                onAction={() => setSearchQuery('')}
              />
            ) : null
          }
        />
      )}

      <TouchableOpacity 
        style={styles.fab} 
        onPress={handleCreateFile}
        activeOpacity={0.8}
      >
        <Plus size={24} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundDark,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: Colors.text,
  },
  headerButtons: {
    flexDirection: 'row',
  },
  iconButton: {
    padding: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    height: 40,
    marginHorizontal: 8,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
  },
  listContent: {
    padding: 16,
    paddingBottom: 100, // Extra space for FAB
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0px 2px 3px rgba(0, 0, 0, 0.3)',
      }
    }),
  },
});