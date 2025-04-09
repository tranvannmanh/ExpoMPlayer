import {
	View,
	Text,
	StyleSheet,
	FlatList,
	Pressable,
	Image,
	StatusBar,
} from 'react-native';
import React, { useCallback } from 'react';
import RNFS from 'react-native-fs';
import { AudioFile } from '@/interface/playlist';
import { THUMBNAIL } from '@/mock/thumb';
import { IconPause, IconPlay, IconWave } from '@/assets/icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Link } from 'expo-router';
import { useTrackContext } from '@/hooks/useTrackContext';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const PlayerList = () => {
	// const [audioFiles, setAudioFiles] = React.useState<AudioFile[]>([]);
	// const [currentTrack, setCurrentPlayer] = React.useState<AudioFile>();
	// const [isTrackPlaying, setIsTrackPlaying] = React.useState(false);
	// const trackController?. = useAudioPlayer(currentTrack?.path);
	const {
		isTrackPlaying,
		setIsTrackPlaying,
		trackList,
		setTrackList,
		currentTrack,
		trackController,
		setCurrentTrack,
	} = useTrackContext();
	const directoryReader = React.useCallback(
		async (path: string) => {
			// if (await requestExternalStoragePermission()) {
			const contents = await RNFS.readDir(path);
			const audioFiles = contents
				.filter((f) => f.isFile() && /\.(mp3|wav|m4a)$/i.test(f.name))
				.map((f) => ({
					name: f.name.split('.mp3').join(' '),
					path: f.path,
				}));
			setTrackList?.(audioFiles);
			// setAudioFiles(audioFiles);
			// }
		},
		[setTrackList]
	);
	React.useEffect(() => {
		directoryReader(RNFS.DownloadDirectoryPath);
	}, [directoryReader]);
	React.useEffect(() => {
		if (currentTrack?.path && trackController) {
			trackController?.play();
			setIsTrackPlaying?.(true);
		}
	}, [currentTrack?.path, trackController, setIsTrackPlaying]);
	const playTrack = useCallback(
		(info: AudioFile) => {
			setCurrentTrack(info);
		},
		[setCurrentTrack]
	);
	const renderAudioItem = React.useCallback(
		({ item }: { item: AudioFile }) => {
			let thumb;
			if (item.thumbnail) {
				thumb = item.thumbnail;
			} else {
				const randThumbIdx = Math.floor(Math.random() * THUMBNAIL.length);
				thumb = THUMBNAIL[randThumbIdx];
			}
			return (
				<Pressable
					onPress={() => playTrack({ ...item, thumbnail: thumb })}
					style={styles.itemContainer}
					android_ripple={{
						color: '#00000020',
					}}
				>
					<Image source={thumb} style={styles.thumbImg} />
					<View style={styles.rightContainer}>
						<Text
							numberOfLines={1}
							style={styles.itemName}
							ellipsizeMode="tail"
						>
							{item.name}
						</Text>
						<Text style={styles.itemDescription}>
							{item.author || 'unknown'}
						</Text>
					</View>
				</Pressable>
			);
		},
		[playTrack]
	);

	const togglePlayPause = React.useCallback(() => {
		if (trackController?.playing) {
			trackController?.pause();
			setIsTrackPlaying?.(false);
		} else {
			trackController?.play();
			setIsTrackPlaying?.(true);
		}
	}, [setIsTrackPlaying, trackController]);

	/**
	 * Render list audio files
	 */
	const trackListRender = React.useMemo(
		() => (
			<>
				<Text style={styles.textHeader}>Tracks to Play</Text>
				<FlatList
					data={trackList}
					renderItem={renderAudioItem}
					keyExtractor={(f) => `${f.path}`}
				/>
			</>
		),
		[renderAudioItem, trackList]
	);

	const thumbnailRender = React.useMemo(() => {
		if (currentTrack?.thumbnail) {
			return <Image source={currentTrack.thumbnail} style={styles.thumbImg} />;
		}
		return (
			<View style={styles.tinyPlayingTrackThumbContainer}>
				<IconWave color="white" />
			</View>
		);
	}, [currentTrack?.thumbnail]);

	const renderTrackInfo = React.useMemo(
		() => (
			<View style={styles.tinyTrackNameContentContainer}>
				<Text
					numberOfLines={1}
					style={styles.tinyPlayingTitle}
					ellipsizeMode="tail"
				>
					{currentTrack?.name}
				</Text>
				<Text style={styles.tinyPlayingDescription}>
					{currentTrack?.author || 'unknown'}
				</Text>
			</View>
		),
		[currentTrack?.name, currentTrack?.author]
	);

	const tinyTrackPlayer = React.useMemo(() => {
		if (!currentTrack) {
			return null;
		}
		return (
			<Link
				href={{
					pathname: '/PlayingTrackDetail',
					params: currentTrack,
				}}
				asChild
			>
				<AnimatedPressable
					entering={FadeInDown.duration(500)}
					style={styles.tinyPlayingTrackContainer}
				>
					{thumbnailRender}
					{renderTrackInfo}
					<Pressable onPress={togglePlayPause} style={styles.trackPlayingState}>
						{!isTrackPlaying ? (
							<IconPlay color="white" />
						) : (
							<IconPause color="white" />
						)}
					</Pressable>
				</AnimatedPressable>
			</Link>
		);
	}, [
		currentTrack,
		thumbnailRender,
		renderTrackInfo,
		togglePlayPause,
		isTrackPlaying,
	]);

	return (
		<View style={styles.container}>
			<StatusBar translucent backgroundColor={'transparent'} />
			{trackListRender}
			{tinyTrackPlayer}
		</View>
	);
};

const styles = StyleSheet.create({
	trackPlayingState: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingRight: 6,
	},
	tinyTrackNameContentContainer: {
		flex: 1,
		justifyContent: 'space-between',
	},
	tinyPlayingTrackThumbContainer: {
		width: 36,
		height: 36,
		justifyContent: 'center',
		alignItems: 'center',
		borderColor: 'gray',
		borderRadius: 4,
		borderWidth: 1,
	},
	tinyPlayingTitle: {
		color: 'white',
	},
	tinyPlayingDescription: {
		color: 'lightgray',
		fontSize: 12,
	},
	tinyPlayingTrackContainer: {
		position: 'absolute',
		bottom: 10,
		left: 10,
		right: 10,
		flexDirection: 'row',
		backgroundColor: 'black',
		borderRadius: 10,
		padding: 6,
		gap: 8,
	},
	container: {
		flex: 1,
		backgroundColor: 'white',
		paddingTop: StatusBar.currentHeight,
	},
	itemContainer: {
		paddingVertical: 10,
		paddingHorizontal: 16,
		flexDirection: 'row',
		alignItems: 'center',
		gap: 12,
	},
	itemName: {
		flex: 1,
	},
	thumbImg: {
		width: 36,
		height: 36,
		borderRadius: 4,
	},
	rightContainer: {
		flex: 1,
	},
	itemDescription: {
		color: 'gray',
		fontSize: 12,
	},
	textHeader: {
		fontSize: 36,
		color: '#000000',
		fontWeight: 'bold',
		margin: 16,
	},
});

export default PlayerList;
