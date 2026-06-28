import { Platform } from "react-native";
import { AudioQuality, IOSOutputFormat, type RecordingOptions } from "expo-audio";

/**
 * The backend only accepts audio/webm, audio/mpeg, audio/wav, or audio/ogg for
 * recording uploads. expo-audio's built-in presets (RecordingPresets.HIGH_QUALITY/
 * LOW_QUALITY) produce .m4a (audio/mp4) on both iOS and Android, which isn't in
 * that list — uploads using them would 400. This custom config targets accepted
 * formats instead: Linear PCM WAV on iOS (well-supported, verifiable). Android's
 * MediaRecorder has no native WAV output option, so it targets webm — unlike the
 * iOS path, this has not been verified to produce a playable file on a real device.
 */
export const RECORDING_OPTIONS: RecordingOptions = {
  extension: Platform.OS === "ios" ? ".wav" : ".webm",
  sampleRate: 44100,
  numberOfChannels: 2,
  bitRate: 128000,
  android: {
    extension: ".webm",
    outputFormat: "webm",
    audioEncoder: "aac",
  },
  ios: {
    extension: ".wav",
    outputFormat: IOSOutputFormat.LINEARPCM,
    audioQuality: AudioQuality.HIGH,
    linearPCMBitDepth: 16,
    linearPCMIsBigEndian: false,
    linearPCMIsFloat: false,
  },
  web: {
    mimeType: "audio/webm",
    bitsPerSecond: 128000,
  },
};

export const RECORDING_FILE_EXTENSION = Platform.OS === "ios" ? "wav" : "webm";
export const RECORDING_MIME_TYPE = Platform.OS === "ios" ? "audio/wav" : "audio/webm";
