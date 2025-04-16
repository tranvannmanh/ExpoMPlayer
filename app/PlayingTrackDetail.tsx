import {
	View,
	StyleSheet,
	StatusBar,
	Pressable,
	TouchableOpacity,
	Image,
	ImageBackground,
	Text,
} from 'react-native';
import React from 'react';
import {
	IconChevronDown,
	IconPause,
	IconPlay,
	IconRepeatOne,
	IconShuffle,
	IconSkipNext,
	IconSkipPrevious,
} from '@/assets/icons';
import { BlurView } from 'expo-blur';
import { WINDOW_WIDTH } from '@/constant/screen-size';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useTrackContext } from '@/hooks/useTrackContext';

const THUMB_WIDTH = WINDOW_WIDTH - 32;
const THUMB_WIDTH_MAX = 276;
const THUMB_WIDTH_USE = Math.min(THUMB_WIDTH, THUMB_WIDTH_MAX);

// const THUMB_ASSET = require('../assets/images/motion_bird.png');

const PlayingTrackDetail = () => {
	const router = useRouter();
	const {
		currentTrack,
		trackController,
		isTrackPlaying,
		setIsTrackPlaying,
		trackList,
		currentTrackIndex,
		setCurrentTrackIndex,
		setCurrentTrack,
	} = useTrackContext();

	const playToggle = React.useCallback(() => {
		setIsTrackPlaying?.((prev) => {
			if (prev) {
				trackController?.pause();
			} else {
				trackController?.play();
			}
			return !prev;
		});
	}, [setIsTrackPlaying, trackController]);

	const nextAudio = React.useCallback(() => {
		if (
			currentTrackIndex === undefined ||
			currentTrackIndex === -1 ||
			trackList.length < 2
		) {
			return;
		}
		const trackListMaxIdx = trackList.length - 1 || 0;
		let nextTrackIdx = -1;
		if (currentTrackIndex < trackListMaxIdx) {
			nextTrackIdx = currentTrackIndex + 1;
		} else {
			nextTrackIdx = 0;
		}
		setCurrentTrackIndex(nextTrackIdx);
		console.log('next track...', trackList[nextTrackIdx]);
		setCurrentTrack(trackList[nextTrackIdx]);
	}, [currentTrackIndex, setCurrentTrack, setCurrentTrackIndex, trackList]);

	const prevAudio = React.useCallback(() => {
		if (
			currentTrackIndex === undefined ||
			currentTrackIndex === -1 ||
			trackList.length < 2
		) {
			return;
		}
		let nextTrackIdx = -1;
		if (currentTrackIndex > 0) {
			nextTrackIdx = currentTrackIndex - 1;
		} else {
			nextTrackIdx = trackList.length - 1;
		}
		setCurrentTrackIndex(nextTrackIdx);
		setCurrentTrack(trackList[nextTrackIdx]);
	}, [currentTrackIndex, setCurrentTrack, setCurrentTrackIndex, trackList]);

	const trackDuration = React.useMemo(() => {
		if (trackController?.duration) {
			const minutes = Math.floor(trackController.duration / 60);
			const seconds = Math.round(trackController.duration - minutes * 60);
			return `${minutes}:${seconds}`;
		}
		return '0:00';
	}, [trackController?.duration]);

	const renderDurationProcess = React.useMemo(
		() => (
			<View>
				<ImageBackground
					source={currentTrack?.thumbnail}
					style={{
						width: THUMB_WIDTH_USE,
						height: 2,
						borderRadius: 100,
						flexDirection: 'row',
						alignItems: 'center',
						justifyContent: 'flex-start',
					}}
				>
					<View
						style={{
							width: Math.max(THUMB_WIDTH_USE * 0.3 - 4, 0),
							backgroundColor: 'white',
							height: 2,
							borderRadius: 2,
						}}
					/>
					<View
						style={{
							width: 6,
							height: 6,
							borderRadius: 4,
							backgroundColor: 'white',
						}}
					/>
				</ImageBackground>
				<View
					style={{
						flexDirection: 'row',
						alignItems: 'center',
						justifyContent: 'space-between',
						marginTop: 4,
					}}
				>
					<Text style={{ color: 'white', fontSize: 12 }}>0:00</Text>
					<Text style={{ color: 'white', fontSize: 12 }}>{trackDuration}</Text>
				</View>
			</View>
		),
		[currentTrack?.thumbnail, trackDuration]
	);
	const renderButtonRowMain = React.useMemo(
		() => (
			<View style={styles.buttonsRow}>
				<TouchableOpacity style={styles.sideButtons} onPress={prevAudio}>
					<IconSkipPrevious color="white" width={40} height={40} />
				</TouchableOpacity>
				<Pressable style={styles.buttonPlay} onPress={playToggle}>
					{!isTrackPlaying ? (
						<IconPlay width={28} height={28} />
					) : (
						<IconPause width={28} height={28} />
					)}
				</Pressable>
				<TouchableOpacity style={styles.sideButtons} onPress={nextAudio}>
					<IconSkipNext color="white" width={40} height={40} />
				</TouchableOpacity>
			</View>
		),
		[isTrackPlaying, nextAudio, playToggle, prevAudio]
	);
	const renderButtonRowSecond = React.useMemo(
		() => (
			<View style={styles.buttonsRow}>
				<TouchableOpacity style={styles.sideButtons}>
					<IconShuffle width={32} height={32} color="white" />
				</TouchableOpacity>
				<TouchableOpacity style={styles.sideButtons}>
					<IconRepeatOne width={32} height={32} color="white" />
				</TouchableOpacity>
			</View>
		),
		[]
	);
	const renderTrackInfo = React.useMemo(
		() => (
			<>
				<Image
					source={currentTrack?.thumbnail}
					style={{
						width: THUMB_WIDTH_USE,
						height: THUMB_WIDTH_USE,
						borderRadius: 16,
					}}
				/>
				<View>
					<Text
						numberOfLines={1}
						ellipsizeMode="tail"
						style={{
							width: THUMB_WIDTH_USE,
							color: 'white',
							fontSize: 16,
							marginBottom: 4,
						}}
					>
						{currentTrack?.name}
					</Text>
					<Text
						numberOfLines={1}
						ellipsizeMode="tail"
						style={{
							width: THUMB_WIDTH_USE,
							color: 'white',
							fontSize: 12,
						}}
					>
						{currentTrack?.author || 'unknown'}
					</Text>
				</View>
			</>
		),
		[currentTrack?.author, currentTrack?.name, currentTrack?.thumbnail]
	);
	return (
		<ImageBackground source={currentTrack?.thumbnail} style={styles.container}>
			<StatusBar
				translucent
				backgroundColor={'transparent'}
				barStyle={'light-content'}
			/>
			<LinearGradient
				colors={['transparent', 'transparent', 'rgba(0, 0, 0, 0.8)']}
				style={{ flex: 1 }}
			>
				<BlurView
					style={[styles.container, { paddingTop: StatusBar.currentHeight }]}
					intensity={90}
					tint="dark"
				>
					<View style={{ paddingHorizontal: 16 }}>
						<TouchableOpacity onPress={() => router.back()}>
							<IconChevronDown width={36} height={36} color="white" />
						</TouchableOpacity>
					</View>
					<View
						style={{
							flex: 1,
							justifyContent: 'center',
							alignItems: 'center',
						}}
					>
						<View style={{ gap: 16, alignItems: 'center' }}>
							{renderTrackInfo}
							{renderDurationProcess}
						</View>
						<View
							style={{ width: THUMB_WIDTH_USE + 12, marginTop: 16, gap: 12 }}
						>
							{renderButtonRowSecond}
							{renderButtonRowMain}
						</View>
					</View>
				</BlurView>
			</LinearGradient>
		</ImageBackground>
	);
};

export default PlayingTrackDetail;

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	buttonsRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		gap: 32,
	},
	buttonPlay: {
		width: 52,
		height: 52,
		borderRadius: 100,
		backgroundColor: 'white',
		justifyContent: 'center',
		alignItems: 'center',
	},
	sideButtons: {
		borderRadius: 100,
		width: 36,
		height: 36,
		justifyContent: 'center',
		alignItems: 'center',
	},
});
