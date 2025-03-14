import {
  DeviceOrientation,
  DeviceRotationPrompt,
} from "device-rotation-prompt";

/**
 * Initialize the device rotation prompt to enforce landscape orientation on mobile devices
 */
export const initOrientationHandler = () => {
  return new DeviceRotationPrompt({
    orientation: DeviceOrientation.Landscape,
    mobileDetect: true,
    // imageSize: "100vh",
  });
};
