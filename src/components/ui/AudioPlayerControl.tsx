import { Pressable, Text, View } from "react-native";
import { Pause, Play } from "lucide-react-native";
import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio";

type AudioPlayerControlProps = {
  uri: string;
};

function formatSeconds(seconds: number): string {
  const safeSeconds = Number.isFinite(seconds) ? seconds : 0;
  const minutes = Math.floor(safeSeconds / 60);
  const remaining = Math.floor(safeSeconds % 60);
  return `${minutes}:${remaining.toString().padStart(2, "0")}`;
}

export function AudioPlayerControl({ uri }: AudioPlayerControlProps) {
  const player = useAudioPlayer(uri);
  const status = useAudioPlayerStatus(player);

  const toggle = () => {
    if (status.playing) {
      player.pause();
    } else {
      player.play();
    }
  };

  return (
    <View className="flex-row items-center gap-3 rounded-xl bg-page px-3 py-2">
      <Pressable
        onPress={toggle}
        className="h-8 w-8 items-center justify-center rounded-full bg-primary-600"
      >
        {status.playing ? <Pause size={16} color="#ffffff" /> : <Play size={16} color="#ffffff" />}
      </Pressable>
      <Text className="text-xs text-text-muted">
        {formatSeconds(status.currentTime)} / {formatSeconds(status.duration)}
      </Text>
    </View>
  );
}
