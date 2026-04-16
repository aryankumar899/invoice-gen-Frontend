import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Capacitor } from '@capacitor/core';

export const useMobile = () => {
  const isNative = Capacitor.isNativePlatform();

  const vibrateSuccess = async () => {
    if (isNative) {
      await Haptics.impact({ style: ImpactStyle.Medium });
    }
  };

  const vibrateLight = async () => {
    if (isNative) {
      await Haptics.impact({ style: ImpactStyle.Light });
    }
  };

  return { isNative, vibrateSuccess, vibrateLight };
};
