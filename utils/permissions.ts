import { PermissionsAndroid } from "react-native";

export const requestExternalStoragePermission = async () => {
  const readPermission = PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;
  const hasPermission = await PermissionsAndroid.check(readPermission);
  if (hasPermission) {
    console.log('Permission Granted');
    return true;
  } else {
    try {
      const status = await PermissionsAndroid.request(readPermission);
      if (status === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Permission Granted 222');
        return true;
      } else {
        console.log('Permission Denied');
        return false;
      }
    } catch (error) {
      console.error('Permission Request Error: ', error);
      return false;
    }
  }
};