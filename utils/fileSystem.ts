import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { File, FileText, Image, Music, Video, Archive, Code } from 'lucide-react-native';

export type FileItem = {
  id: string;
  name: string;
  content: string;
  type: string;
  createdAt: string;
  modifiedAt: string;
  size?: number;
};

// For web platform
const WEB_STORAGE_KEY = 'fileManager_files';

// Get all files
export const getFileList = async (directory: string): Promise<FileItem[]> => {
  if (Platform.OS === 'web') {
    try {
      const storedData = localStorage.getItem(WEB_STORAGE_KEY);
      if (storedData) {
        const files = JSON.parse(storedData);
        return Array.isArray(files) ? files : [];
      }
      return [];
    } catch (error) {
      console.error('Error loading files from localStorage:', error);
      return [];
    }
  } else {
    try {
      const files = await FileSystem.readDirectoryAsync(directory);
      const filePromises = files
        .filter(file => file.endsWith('.json'))
        .map(async (file) => {
          try {
            const fileId = file.replace('.json', '');
            const content = await FileSystem.readAsStringAsync(`${directory}${file}`);
            return JSON.parse(content) as FileItem;
          } catch (error) {
            console.error(`Error reading file ${file}:`, error);
            return null;
          }
        });
      
      const fileData = await Promise.all(filePromises);
      return fileData.filter((file): file is FileItem => file !== null)
        .sort((a, b) => new Date(b.modifiedAt).getTime() - new Date(a.modifiedAt).getTime());
    } catch (error) {
      console.error('Error reading directory:', error);
      return [];
    }
  }
};

// Get file contents
export const getFileContents = async (directory: string, fileId: string): Promise<FileItem> => {
  if (Platform.OS === 'web') {
    try {
      const storedData = localStorage.getItem(WEB_STORAGE_KEY);
      if (storedData) {
        const files = JSON.parse(storedData);
        const file = files.find((f: FileItem) => f.id === fileId);
        if (file) {
          return file;
        }
      }
      throw new Error('File not found');
    } catch (error) {
      console.error('Error loading file from localStorage:', error);
      throw error;
    }
  } else {
    try {
      const fileUri = `${directory}${fileId}.json`;
      const content = await FileSystem.readAsStringAsync(fileUri);
      return JSON.parse(content) as FileItem;
    } catch (error) {
      console.error('Error reading file:', error);
      throw error;
    }
  }
};

// Save file contents
export const saveFileContents = async (directory: string, file: FileItem): Promise<void> => {
  if (Platform.OS === 'web') {
    try {
      const storedData = localStorage.getItem(WEB_STORAGE_KEY);
      let files: FileItem[] = [];
      
      if (storedData) {
        files = JSON.parse(storedData);
        const fileIndex = files.findIndex(f => f.id === file.id);
        
        if (fileIndex >= 0) {
          files[fileIndex] = file;
        } else {
          files.push(file);
        }
      } else {
        files = [file];
      }
      
      localStorage.setItem(WEB_STORAGE_KEY, JSON.stringify(files));
    } catch (error) {
      console.error('Error saving file to localStorage:', error);
      throw error;
    }
  } else {
    try {
      const fileUri = `${directory}${file.id}.json`;
      await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(file, null, 2));
    } catch (error) {
      console.error('Error writing file:', error);
      throw error;
    }
  }
};

// Create a new empty file
export const createEmptyFile = async (directory: string): Promise<FileItem> => {
  const now = new Date().toISOString();
  const newFile: FileItem = {
    id: uuidv4(),
    name: 'Untitled Note',
    content: '',
    type: 'text',
    createdAt: now,
    modifiedAt: now,
  };
  
  await saveFileContents(directory, newFile);
  return newFile;
};

// Delete a file
export const deleteFile = async (file: FileItem): Promise<void> => {
  if (Platform.OS === 'web') {
    try {
      const storedData = localStorage.getItem(WEB_STORAGE_KEY);
      
      if (storedData) {
        let files: FileItem[] = JSON.parse(storedData);
        files = files.filter(f => f.id !== file.id);
        localStorage.setItem(WEB_STORAGE_KEY, JSON.stringify(files));
      }
    } catch (error) {
      console.error('Error deleting file from localStorage:', error);
      throw error;
    }
  } else {
    try {
      const fileUri = `${FileSystem.documentDirectory}files/${file.id}.json`;
      await FileSystem.deleteAsync(fileUri);
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  }
};

// Get appropriate icon for file type
export const getFileIcon = (file: FileItem) => {
  switch (file.type) {
    case 'image':
      return Image;
    case 'audio':
      return Music;
    case 'video':
      return Video;
    case 'archive':
      return Archive;
    case 'code':
      return Code;
    default:
      return FileText;
  }
};