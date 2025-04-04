import {
	View,
	Text,
	StyleSheet,
	FlatList,
	Pressable,
	Image,
} from 'react-native';
import React, { useCallback } from 'react';
import RNFS from 'react-native-fs';
import { requestExternalStoragePermission } from '../_layout';
import { AudioFile } from '@/interface/playlist';
import { useAudioPlayer } from 'expo-audio';
import { THUMBNAIL } from '@/mock/thumb';
import { IconPause, IconPlay, IconWave } from '@/assets/icons';
import Animated, { FadeInDown } from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const PlayerList = () => {
	const [audioFiles, setAudioFiles] = React.useState<AudioFile[]>([]);
	const [currentPlayer, setCurrentPlayer] = React.useState<AudioFile>();
	const [isTrackPlaying, setIsTrackPlaying] = React.useState(false);
	const track = useAudioPlayer(currentPlayer?.path);
	const directoryReader = async (path: string) => {
		if (await requestExternalStoragePermission()) {
			const contents = await RNFS.readDir(path);
			const audioFiles = contents
				.filter((f) => f.isFile() && /\.(mp3|wav|m4a)$/i.test(f.name))
				.map((f) => ({ name: f.name, path: f.path }));
			setAudioFiles(audioFiles);
		}
	};
	React.useEffect(() => {
		directoryReader(RNFS.DownloadDirectoryPath);
	}, []);
	React.useEffect(() => {
		if (currentPlayer?.path) {
			track.play();
			setIsTrackPlaying(true);
		}
	}, [track, currentPlayer]);
	const playTrack = useCallback((info: AudioFile) => {
		setCurrentPlayer(info);
	}, []);
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
					onPress={() => playTrack(item)}
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
		if (track.playing) {
			track.pause();
			setIsTrackPlaying(false);
		} else {
			track.play();
			setIsTrackPlaying(true);
		}
	}, [track]);

	/**
	 * Render list audio files
	 */
	const trackList = React.useMemo(
		() => (
			<>
				<Text style={styles.textHeader}>Tracks to Play</Text>
				<FlatList
					data={audioFiles}
					renderItem={renderAudioItem}
					keyExtractor={(f) => `${f.path}`}
				/>
			</>
		),
		[audioFiles, renderAudioItem]
	);

	const thumbnailRender = React.useMemo(() => {
		if (currentPlayer?.thumbnail) {
			return (
				<Image
					source={{ uri: currentPlayer.thumbnail }}
					style={styles.thumbImg}
				/>
			);
		}
		return (
			<View style={styles.tinyPlayingTrackThumbContainer}>
				<IconWave color="white" />
			</View>
		);
	}, [currentPlayer?.thumbnail]);

	const renderTrackInfo = React.useMemo(
		() => (
			<View style={styles.tinyTrackNameContentContainer}>
				<Text
					numberOfLines={1}
					style={styles.tinyPlayingTitle}
					ellipsizeMode="tail"
				>
					{currentPlayer?.name}
				</Text>
				<Text style={styles.tinyPlayingDescription}>
					{currentPlayer?.author || 'unknown'}
				</Text>
			</View>
		),
		[currentPlayer?.name, currentPlayer?.author]
	);

	const tinyTrackPlayer = React.useMemo(() => {
		if (!currentPlayer) {
			return null;
		}
		return (
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
		);
	}, [
		currentPlayer,
		isTrackPlaying,
		thumbnailRender,
		renderTrackInfo,
		togglePlayPause,
	]);

	return (
		<View style={styles.container}>
			{trackList}
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
