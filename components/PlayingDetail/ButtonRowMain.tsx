import { Pressable, StyleSheet, TouchableOpacity, View } from 'react-native';
import React from 'react';
import {
	IconSkipPrevious,
	IconPlay,
	IconPause,
	IconSkipNext,
} from '@/assets/icons';
import { TrackContext } from '@/context/player-context';

const ButtonRowMain = () => {
	const {
		playNextAudio,
		playPrevAudio,
		isTrackPlaying,
		togglePlay,
		trackList,
	} = React.useContext(TrackContext);
	const toAnotherTrackDisabled = trackList.length < 2;
	return (
		<View style={styles.buttonsRow}>
			<TouchableOpacity
				style={styles.sideButtons}
				disabled={toAnotherTrackDisabled}
				onPress={playPrevAudio}
			>
				<IconSkipPrevious
					color={toAnotherTrackDisabled ? 'gray' : 'white'}
					width={40}
					height={40}
				/>
			</TouchableOpacity>
			<Pressable
				style={styles.buttonPlay}
				disabled={toAnotherTrackDisabled}
				onPress={togglePlay}
			>
				{!isTrackPlaying ? (
					<IconPlay width={28} height={28} />
				) : (
					<IconPause width={28} height={28} />
				)}
			</Pressable>
			<TouchableOpacity style={styles.sideButtons} onPress={playNextAudio}>
				<IconSkipNext
					color={toAnotherTrackDisabled ? 'gray' : 'white'}
					width={40}
					height={40}
				/>
			</TouchableOpacity>
		</View>
	);
};

export default ButtonRowMain;

const styles = StyleSheet.create({
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
