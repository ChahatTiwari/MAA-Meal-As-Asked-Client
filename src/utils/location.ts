import * as Location from "expo-location";

export const requestLocationPermission = async () => {
  let permission = await Location.getForegroundPermissionsAsync();

  if (permission.status === "granted") return "granted";

  permission = await Location.requestForegroundPermissionsAsync();

  return permission.status; // "granted" | "denied" | "undetermined"
};

export const getCurrentLocation = async () => {
  return await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.High,
  });
};
