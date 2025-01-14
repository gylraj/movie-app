import CustomSlider from '@/components/ui/CustomSlider';
import { useEvent } from 'expo';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  TouchableOpacity,
  BackHandler,
  Text,
  StatusBar,
} from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const videoSource =
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

export default function VideoScreen() {
  const player = useVideoPlayer(videoSource, (player) => {
    player.loop = false;
    player.play();
    player.timeUpdateEventInterval = 1;
  });

  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSliding, setIsSliding] = useState(false);
  const [preventFromClosing, setPreventFromClosing] = useState(0);

  const { isPlaying } = useEvent(player, 'playingChange', { isPlaying: player.playing });

  const { currentTime } = useEvent(player, 'timeUpdate', {
    currentTime: player.currentTime ?? 0,
    currentLiveTimestamp: player.currentLiveTimestamp ?? 0,
    currentOffsetFromLive: player.currentOffsetFromLive ?? 0,
    bufferedPosition: player.bufferedPosition ?? 0,
  });

  const duration = player.duration || 0;

  // Handle navigation back and set portrait mode
  useEffect(() => {
    const handleBackPress = () => {
      if (isFullscreen) {
        ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
        setIsFullscreen(false);
        StatusBar.setHidden(false); // Show status bar when exiting fullscreen
        return true; // Prevent default back navigation in fullscreen
      } else {
        player.pause(); // Pause video when exiting the screen
        router.back(); // Navigate back if not in fullscreen
        return true;
      }
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);

    return () => {
      backHandler.remove(); // Cleanup back handler
    };
  }, [isFullscreen]);

  const toggleFullscreen = async () => {
    try {
      if (isFullscreen) {
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
        StatusBar.setHidden(false); // Show status bar after exiting fullscreen
      } else {
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
        StatusBar.setHidden(true); // Hide status bar in fullscreen
      }
      setIsFullscreen(!isFullscreen);
    } catch (error) {
      console.error('Failed to toggle fullscreen:', error);
    }
  };

  const handleSeek = (value: number) => {
    player.currentTime = value;
    setIsSliding(false);
  };

  const handleSlidingStart = () => {
    setIsSliding(true);
  };

  const skipBackward = () => {
    player.currentTime = Math.max(0, player.currentTime - 10);
    setPreventFromClosing(player.currentTime);
  };

  const skipForward = () => {
    player.currentTime = Math.min(duration, player.currentTime + 10);
    setPreventFromClosing(player.currentTime);
  };

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (showControls && !isSliding) {
      timeout = setTimeout(() => setShowControls(false), 3000);
    }
    return () => clearTimeout(timeout);
  }, [showControls, isSliding, preventFromClosing]);

  return (
    <View style={styles.container}>
      {showControls && (
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => {
              if (isFullscreen) {
                ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
                setIsFullscreen(false);
                StatusBar.setHidden(false);
              }
              player.pause();
              router.back();
            }}
          >
            <Ionicons name="arrow-back" size={30} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Video Player</Text>
        </View>
      )}

      <View style={styles.videoContainer}>
        <VideoView
          style={styles.video}
          player={player}
          allowsFullscreen={false}
          nativeControls={false}
        />
      </View>

      <TouchableWithoutFeedback onPress={() => setShowControls((prev) => !prev)}>
        <View style={styles.touchOverlay}></View>
      </TouchableWithoutFeedback>
      {showControls && (
        <View style={styles.overlay} pointerEvents="box-none">
          <View style={styles.playbackContainer}>
            <TouchableOpacity onPress={skipBackward} style={styles.skipButton}>
              <Ionicons name="play-back-outline" size={50} color="white" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => (isPlaying ? player.pause() : player.play())}
              style={styles.playPauseButton}
            >
              <Ionicons name={isPlaying ? 'pause-circle' : 'play-circle'} size={70} color="white" />
            </TouchableOpacity>

            <TouchableOpacity onPress={skipForward} style={styles.skipButton}>
              <Ionicons name="play-forward-outline" size={50} color="white" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.fullscreenButton} onPress={toggleFullscreen}>
            <Ionicons
              name={isFullscreen ? 'contract-outline' : 'expand-outline'}
              size={40}
              color="white"
            />
          </TouchableOpacity>

          <View style={styles.sliderContainer}>
            <CustomSlider
              currentTime={currentTime}
              duration={duration}
              onSlidingStart={handleSlidingStart}
              onSlidingComplete={handleSeek}
            />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  header: {
    position: 'absolute',
    top: 40,
    left: 10,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 1,
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  videoContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  video: {
    width: '100%',
    height: 300,
  },
  touchOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  playbackContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playPauseButton: {
    marginHorizontal: 20,
  },
  skipButton: {
    marginHorizontal: 10,
  },
  fullscreenButton: {
    position: 'absolute',
    top: 40,
    right: 20,
  },
  sliderContainer: {
    position: 'absolute',
    bottom: 10,
    width: '100%',
    paddingHorizontal: 16,
  },
});
