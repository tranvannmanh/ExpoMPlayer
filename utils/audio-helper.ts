import { ReadDirItem } from "react-native-fs";

export const isAudioFile = (file: ReadDirItem) => {
  return file.isFile() && /\.(mp3|wav|m4a)$/i.test(file.name);
};