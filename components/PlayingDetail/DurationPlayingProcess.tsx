import { ImageBackground, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { AudioFile } from '@/interface/playlist';
import { THUMB_WIDTH_USE } from '@/constant/sizes';

type Props = {
	currentTrack?: AudioFile;
	trackDuration?: string;
};

const DurationPlayingProcess = ({ currentTrack, trackDuration }: Props) => {
	return (
		<View>
			<ImageBackground
				source={currentTrack?.thumbnail}
				style={styles.durationBar}
			>
				<View style={styles.durationProgress} />
				<View style={styles.durationDot} />
			</ImageBackground>
			<View style={styles.durationTextRow}>
				<Text style={styles.durationText}>0:00</Text>
				<Text style={styles.durationText}>{trackDuration || '0:00'}</Text>
			</View>
		</View>
	);
};

export default DurationPlayingProcess;

const styles = StyleSheet.create({
	durationTextRow: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginTop: 4,
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
	durationText: {
		color: 'white',
		fontSize: 12,
	},
});
