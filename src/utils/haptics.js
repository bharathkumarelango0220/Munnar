/**
 * Native Haptic Vibration Feedback for Mobile Devices (Android & supported browsers)
 */
export const triggerHaptic = (pattern = 15) => {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    try {
      navigator.vibrate(pattern);
    } catch (e) {
      // Ignore unsupported environments
    }
  }
};
