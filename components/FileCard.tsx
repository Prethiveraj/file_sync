import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { FileItem, deleteFile } from '@/utils/fileSystem';
import { formatDate } from '@/utils/dateUtils';
import { getFileIcon } from '@/utils/fileSystem';
import Colors from '@/constants/Colors';
import { MoveHorizontal as MoreHorizontal, Trash2 } from 'lucide-react-native';

type FileCardProps = {
  file: FileItem;
  onPress: () => void;
  onRefresh: () => void;
};

export function FileCard({ file, onPress, onRefresh }: FileCardProps) {
  const [showOptions, setShowOptions] = React.useState(false);

  const toggleOptions = (e: any) => {
    e.stopPropagation();
    setShowOptions(!showOptions);
  };

  const handleDelete = async (e: any) => {
    e.stopPropagation();
    setShowOptions(false);
    
    const confirmDelete = Platform.OS === 'web' 
      ? confirm('Are you sure you want to delete this file?')
      : true; // For native, we'd use Alert
    
    if (confirmDelete) {
      await deleteFile(file);
      onRefresh();
    }
  };

  const FileIcon = getFileIcon(file);

  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        <FileIcon size={24} color={Colors.primary} />
      </View>
      
      <View style={styles.content}>
        <Text style={styles.fileName} numberOfLines={1}>
          {file.name}
        </Text>
        <Text style={styles.fileInfo}>
          Modified {formatDate(file.modifiedAt)}
        </Text>
      </View>
      
      <View style={styles.actions}>
        <TouchableOpacity 
          style={styles.moreButton} 
          onPress={toggleOptions}
          hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
        >
          <MoreHorizontal size={20} color={Colors.secondaryText} />
        </TouchableOpacity>
        
        {showOptions && (
          <View style={styles.optionsMenu}>
            <TouchableOpacity 
              style={styles.optionItem}
              onPress={handleDelete}
            >
              <Trash2 size={16} color={Colors.error} />
              <Text style={styles.deleteText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
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
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: Colors.backgroundDark,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  fileName: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.text,
    marginBottom: 4,
  },
  fileInfo: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.secondaryText,
  },
  actions: {
    position: 'relative',
  },
  moreButton: {
    padding: 4,
  },
  optionsMenu: {
    position: 'absolute',
    top: 30,
    right: 0,
    backgroundColor: Colors.background,
    borderRadius: 8,
    padding: 8,
    minWidth: 120,
    zIndex: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
      }
    }),
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  deleteText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.error,
    marginLeft: 8,
  },
});