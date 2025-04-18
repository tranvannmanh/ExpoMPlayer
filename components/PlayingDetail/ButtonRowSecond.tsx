import { View, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';
import { IconRepeatOne, IconShuffle } from '@/assets/icons';
import { TrackContext } from '@/context/player-context';

type Props = {
	onShufflePress?: () => void;
	onRepeatPress?: () => void;
};

export const ButtonRowSecond = ({ onRepeatPress, onShufflePress }: Props) => {
	const { trackList } = React.useContext(TrackContext);
	const toAnotherTrackDisabled = trackList.length < 2;
	return (
		<View style={styles.buttonsRow}>
			<TouchableOpacity
				disabled={toAnotherTrackDisabled}
				style={styles.sideButtons}
				onPress={onShufflePress}
			>
				<IconShuffle
					width={32}
					height={32}
					color={!toAnotherTrackDisabled ? 'white' : 'gray'}
				/>
			</TouchableOpacity>
			<TouchableOpacity style={styles.sideButtons} onPress={onRepeatPress}>
				<IconRepeatOne width={32} height={32} color="white" />
			</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({
	buttonsRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		gap: 32,
	},
	sideButtons: {
		borderRadius: 100,
		width: 36,
		height: 36,
		justifyContent: 'center',
		alignItems: 'center',
	},
});
