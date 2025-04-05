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
	IconPlay,
	IconRepeatOff,
	IconRepeatOne,
	IconShuffle,
	IconSkipNext,
	IconSkipPrevious,
} from '@/assets/icons';
import { BlurView } from 'expo-blur';
import { WINDOW_WIDTH } from '@/constant/screen-size';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const THUMB_WIDTH = WINDOW_WIDTH - 32;
const THUMB_WIDTH_MAX = 250;
const THUMB_WIDTH_USE = Math.min(WINDOW_WIDTH, THUMB_WIDTH_MAX);

const THUMB_ASSET = require('../assets/images/motion_bird.png');

const PlayingTrackDetail = () => {
	const router = useRouter();

	const renderDurationProcess = React.useMemo(
		() => (
			<ImageBackground
				source={THUMB_ASSET}
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
		),
		[]
	);
	const renderButtonRowMain = React.useMemo(
		() => (
			<View style={styles.buttonsRow}>
				<TouchableOpacity style={styles.sideButtons}>
					<IconSkipPrevious color="white" width={40} height={40} />
				</TouchableOpacity>
				<Pressable style={styles.buttonPlay}>
					<IconPlay width={28} height={28} />
				</Pressable>
				<TouchableOpacity style={styles.sideButtons}>
					<IconSkipNext color="white" width={40} height={40} />
				</TouchableOpacity>
			</View>
		),
		[]
	);
	const renderButtonRowSecond = React.useMemo(
		() => (
			<View style={styles.buttonsRow}>
				<TouchableOpacity style={styles.sideButtons}>
					<IconRepeatOne width={32} height={32} color="white" />
				</TouchableOpacity>
				<TouchableOpacity style={styles.sideButtons}>
					<IconShuffle width={32} height={32} color="white" />
				</TouchableOpacity>
			</View>
		),
		[]
	);
	const renderTrackInfo = React.useMemo(
		() => (
			<>
				<Image
					source={THUMB_ASSET}
					style={{
						width: THUMB_WIDTH,
						height: THUMB_WIDTH,
						maxWidth: THUMB_WIDTH_MAX,
						maxHeight: THUMB_WIDTH_MAX,
						borderRadius: 16,
					}}
				/>
				<View>
					<Text
						numberOfLines={1}
						ellipsizeMode="tail"
						style={{
							color: 'white',
							fontSize: 16,
							marginBottom: 4,
						}}
					>
						Lorem ipsum industry ...
					</Text>
					<Text
						numberOfLines={1}
						ellipsizeMode="tail"
						style={{ color: 'white', fontSize: 12 }}
					>
						from 10th century
					</Text>
				</View>
			</>
		),
		[]
	);
	return (
		<ImageBackground source={THUMB_ASSET} style={styles.container}>
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
						<View style={{ gap: 16 }}>
							{renderTrackInfo}
							{renderDurationProcess}
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
		width: 46,
		height: 46,
		borderRadius: 100,
		backgroundColor: 'white',
		justifyContent: 'center',
		alignItems: 'center',
	},
	sideButtons: {
		borderRadius: 100,
		width: 46,
		height: 46,
		justifyContent: 'center',
		alignItems: 'center',
		overflow: 'hidden',
	},
});
