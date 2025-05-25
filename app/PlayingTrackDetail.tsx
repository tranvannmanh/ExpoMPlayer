import {
	View,
	StyleSheet,
	StatusBar,
	TouchableOpacity,
	Image,
	ImageBackground,
	Text,
} from 'react-native';
import React from 'react';
import { IconChevronDown } from '@/assets/icons';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useTrackContext } from '@/hooks/useTrackContext';
import { ButtonRowSecond } from '@/components/PlayingDetail/ButtonRowSecond';
import ButtonRowMain from '@/components/PlayingDetail/ButtonRowMain';
import { THUMB_WIDTH_USE } from '@/constant/sizes';
import DurationPlayingProcess from '@/components/PlayingDetail/DurationPlayingProcess';

const PlayingTrackDetail = () => {
	const router = useRouter();
	const { currentTrack, trackController } = useTrackContext();

	const trackDuration = React.useMemo(() => {
		if (trackController?.duration) {
			const minutes = Math.floor(trackController.duration / 60);
			const seconds = Math.round(trackController.duration - minutes * 60);
			const secondSS = seconds < 10 ? `0${seconds}` : `${seconds}`;
			return {
				milis: trackController?.duration,
				stringDisplay: `${minutes}:${secondSS}`,
			};
		}
		return { milis: 0, stringDisplay: '0:00' };
	}, [trackController?.duration]);

	const renderTrackInfo = React.useMemo(
		() => (
			<>
				<Image source={currentTrack?.thumbnail} style={styles.trackImage} />
				<View>
					<Text
						numberOfLines={1}
						ellipsizeMode="tail"
						style={styles.trackTitle}
					>
						{currentTrack?.name}
					</Text>
					<Text
						numberOfLines={1}
						ellipsizeMode="tail"
						style={styles.trackAuthor}
					>
						{currentTrack?.author || 'unknown'}
					</Text>
				</View>
			</>
		),
		[currentTrack?.author, currentTrack?.name, currentTrack?.thumbnail]
	);

	console.log('BBBBBBBBBBBBBBBBB');

	return (
		<ImageBackground source={currentTrack?.thumbnail} style={styles.container}>
			<StatusBar
				translucent
				backgroundColor="transparent"
				barStyle="light-content"
			/>
			<LinearGradient
				colors={['transparent', 'transparent', 'rgba(0, 0, 0, 0.8)']}
				style={styles.gradient}
			>
				<BlurView
					style={[styles.container, { paddingTop: StatusBar.currentHeight }]}
					intensity={90}
					tint="dark"
				>
					<View style={styles.header}>
						<TouchableOpacity onPress={() => router.back()}>
							<IconChevronDown width={36} height={36} color="white" />
						</TouchableOpacity>
					</View>
					<View style={styles.mainContent}>
						<View style={styles.trackInfoWrapper}>
							{renderTrackInfo}
							<DurationPlayingProcess
								trackDuration={trackDuration}
								currentTrack={currentTrack}
							/>
						</View>
						<View style={styles.controlsWrapper}>
							<ButtonRowSecond />
							<ButtonRowMain />
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
	gradient: {
		flex: 1,
	},
	header: {
		paddingHorizontal: 16,
	},
	mainContent: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	trackInfoWrapper: {
		gap: 16,
		alignItems: 'center',
	},
	controlsWrapper: {
		width: THUMB_WIDTH_USE + 12,
		marginTop: 16,
		gap: 12,
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
	durationBar: {
		width: THUMB_WIDTH_USE,
		height: 2,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'flex-start',
	},
	durationProgress: {
		width: Math.max(THUMB_WIDTH_USE * 0.3 - 4, 0),
		backgroundColor: 'white',
		height: 2,
	},
	durationDot: {
		width: 6,
		height: 6,
		borderRadius: 4,
		backgroundColor: 'white',
		marginLeft: -2,
	},
	durationTextRow: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginTop: 4,
	},
	durationText: {
		color: 'white',
		fontSize: 12,
	},
	trackImage: {
		width: THUMB_WIDTH_USE,
		height: THUMB_WIDTH_USE,
		borderRadius: 16,
	},
	trackTitle: {
		width: THUMB_WIDTH_USE,
		color: 'white',
		fontSize: 16,
		marginBottom: 4,
	},
	trackAuthor: {
		width: THUMB_WIDTH_USE,
		color: 'white',
		fontSize: 12,
	},
});
