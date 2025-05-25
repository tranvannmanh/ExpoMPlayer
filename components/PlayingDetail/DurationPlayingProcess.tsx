import { ImageBackground, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { AudioFile } from '@/interface/playlist';
import { THUMB_WIDTH_USE } from '@/constant/sizes';
import { TrackContext } from '@/context/player-context';

type Props = {
	currentTrack?: AudioFile;
	trackDuration?: { stringDisplay: string; milis: number };
};

const CurrentTimeProgressIndicator = ({ trackDuration }: Props) => {
	const { currentTrackTimePlaying } = React.useContext(TrackContext);
	const currentTime = currentTrackTimePlaying || 0;
	const progressWidth = Math.max(
		(currentTime / (trackDuration?.milis || 1)) * THUMB_WIDTH_USE - 4,
		0
	);

	return (
		<>
			<View
				style={[
					styles.durationProgress,
					{ width: Math.min(THUMB_WIDTH_USE, progressWidth) },
				]}
			/>
			<View style={styles.durationDot} />
		</>
	);
};

const DurationPlayingProcess = ({ currentTrack, trackDuration }: Props) => {
	return (
		<View>
			<ImageBackground
				source={currentTrack?.thumbnail}
				style={styles.durationBar}
			>
				<CurrentTimeProgressIndicator trackDuration={trackDuration} />
			</ImageBackground>
			<View style={styles.durationTextRow}>
				<Text style={styles.durationText}>0:00</Text>
				<Text style={styles.durationText}>
					{trackDuration?.stringDisplay || '0:00'}
				</Text>
			</View>
		</View>
	);
};

export default React.memo(DurationPlayingProcess);

const styles = StyleSheet.create({
	durationTextRow: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginTop: 8,
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
