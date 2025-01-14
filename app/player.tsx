import CustomSlider from '@/components/ui/CustomSlider';
import { useEvent } from 'expo';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useEffect, useState } from 'react';
import { StyleSheet, View, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';
import { Ionicons } from '@expo/vector-icons';

const videoSource =
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

export default function VideoScreen() {
  // Initialize the video player
  const player = useVideoPlayer(videoSource, (player) => {
    player.loop = false;
    player.play(); // Start playing automatically
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

  const handleSeek = (value: number) => {
    player.currentTime = value;
    console.log('sample');
    setIsSliding(false);
  };

  const handleSlidingStart = (value: number) => {
    console.log('sample1231');
    setIsSliding(true);
  };

  const toggleControls = () => {
    setShowControls((prev) => !prev);
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      player.pause();
    } else {
      player.play();
    }
  };

  const toggleFullscreen = async () => {
    try {
      if (isFullscreen) {
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT); // Exit fullscreen
      } else {
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE); // Enter fullscreen
      }
      setIsFullscreen(!isFullscreen);
    } catch (error) {
      console.error('Failed to toggle fullscreen:', error);
    }
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
      <View style={styles.videoContainer}>
        <VideoView
          style={styles.video}
          player={player}
          allowsFullscreen={false} // Disable default fullscreen to use custom fullscreen control
          nativeControls={false} // Disable default controls to use custom overlay
        />
      </View>

      <TouchableWithoutFeedback onPress={toggleControls}>
        <View style={styles.touchOverlay}></View>
      </TouchableWithoutFeedback>
      {showControls && (
        <View style={styles.overlay} pointerEvents="box-none">
          {/* Play/Pause and Skip Buttons */}
          <View style={styles.playbackContainer}>
            {/* Backward 10 seconds */}
            <TouchableOpacity onPress={skipBackward} style={styles.skipButton}>
              <Ionicons name="play-back-outline" size={50} color="white" />
            </TouchableOpacity>

            {/* Play/Pause Button - Centered */}
            <TouchableOpacity onPress={togglePlayPause} style={styles.playPauseButton}>
              <Ionicons name={isPlaying ? 'pause-circle' : 'play-circle'} size={70} color="white" />
            </TouchableOpacity>

            {/* Forward 10 seconds */}
            <TouchableOpacity onPress={skipForward} style={styles.skipButton}>
              <Ionicons name="play-forward-outline" size={50} color="white" />
            </TouchableOpacity>
          </View>

          {/* Fullscreen Button - Top right */}
          <TouchableOpacity style={styles.fullscreenButton} onPress={toggleFullscreen}>
            <Ionicons
              name={isFullscreen ? 'contract-outline' : 'expand-outline'}
              size={40}
              color="white"
            />
          </TouchableOpacity>

          {/* Custom Slider - Positioned at the bottom */}
          <View style={styles.sliderContainer} pointerEvents="auto">
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
  video: {
    width: '100%',
    height: 300,
  },
  touchOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center', // Centers the overlay and buttons vertically
    backgroundColor: 'transparent',
  },
  videoContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // Semi-transparent background
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // Semi-transparent background
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
    top: 20,
    right: 20,
  },
  sliderContainer: {
    position: 'absolute',
    bottom: 10,
    width: '100%',
    paddingHorizontal: 16,
  },
});
