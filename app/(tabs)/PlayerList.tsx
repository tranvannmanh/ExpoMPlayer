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
import RNFS, { ReadDirItem } from 'react-native-fs';
import { AudioFile } from '@/interface/playlist';
import { THUMBNAIL } from '@/mock/thumb';
import { IconPause, IconPlay, IconWave } from '@/assets/icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Link } from 'expo-router';
import { useTrackContext } from '@/hooks/useTrackContext';
// import { requestExternalStoragePermission } from '@/utils/permissions';
import { isAudioFile } from '@/utils/audio-helper';
import { playerService } from '@/services/player-service';

const playAudio = async (audio: AudioFile) => {
	playerService.togglePlayTrack(audio);
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const PlayerList = () => {
	const {
		isTrackPlaying,
		trackList,
		setTrackList,
		currentTrack,
		setCurrentTrack,
		setCurrentTrackIndex,
		togglePlay,
	} = useTrackContext();

	const directoryReader = React.useCallback(
		async (path: string) => {
			// if (await requestExternalStoragePermission()) {
			const contents = await RNFS.readDir(path);
			const audioFiles = contents.filter(isAudioFile).map((f) => {
				const randThumbIdx = Math.floor(Math.random() * THUMBNAIL.length);
				return {
					name: f.name.split('.mp3').join(' '),
					path: f.path,
					thumbnail: THUMBNAIL[randThumbIdx],
				};
			});
			setTrackList?.(audioFiles);
			// }
		},
		[setTrackList]
	);
	React.useEffect(() => {
		setTimeout(() => directoryReader(RNFS.DownloadDirectoryPath), 250);
	}, [directoryReader]);

	const playTrack = useCallback(
		(info: AudioFile, index: number) => {
			setCurrentTrack(info);
			setCurrentTrackIndex(index);
			console.log('Playing track:', info);
		},
		[setCurrentTrack, setCurrentTrackIndex]
	);

	const renderAudioItem = React.useCallback(
		({ item, index }: { item: AudioFile; index: number }) => {
			return (
				<Pressable
					onPress={() => playAudio(item)}
					style={styles.itemContainer}
					android_ripple={{
						color: '#00000020',
					}}
				>
					<Image source={item.thumbnail} style={styles.thumbImg} />
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
		[]
	);

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
					<Pressable onPress={togglePlay} style={styles.trackPlayingState}>
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
		togglePlay,
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
		backgroundColor: '#00000096',
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
