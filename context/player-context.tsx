import { AudioFile } from '@/interface/playlist';
import { AudioPlayer, useAudioPlayer, setAudioModeAsync } from 'expo-audio';
import {
	createContext,
	PropsWithChildren,
	useCallback,
	useEffect,
	useRef,
	useState,
} from 'react';

export type PlayerContextType = {
	trackController?: AudioPlayer;
	trackList: AudioFile[];
	currentTrack?: AudioFile;
	setCurrentTrack: (track: AudioFile) => void; // Function to set the current track and play it
	setTrackList: React.Dispatch<React.SetStateAction<AudioFile[]>>;
	isTrackPlaying?: boolean;
	setIsTrackPlaying?: React.Dispatch<React.SetStateAction<boolean>>;
	currentTrackIndex?: number;
	setCurrentTrackIndex: React.Dispatch<React.SetStateAction<number>>;
	playNextAudio?: () => void;
	playPrevAudio?: () => void;
	togglePlay?: () => void;
	currentTrackTimePlaying?: number;
	setCurrentTrackTimePlaying?: React.Dispatch<React.SetStateAction<number>>;
};

export const TrackContext = createContext<PlayerContextType>({
	trackController: undefined,
	trackList: [],
	currentTrack: undefined,
	setCurrentTrack: () => {},
	setTrackList: () => {},
	currentTrackIndex: -1,
	setCurrentTrackIndex: () => {},
	playNextAudio: () => {},
	playPrevAudio: () => {},
	togglePlay: () => {},
	currentTrackTimePlaying: 0,
	setCurrentTrackTimePlaying: () => {},
});

export default function TracksProvider(props: PropsWithChildren) {
	// const autoNextTimoutId = useRef<NodeJS.Timeout>();
	const [trackList, setTrackList] = useState<AudioFile[]>([]);
	const [currentTrack, setCurrentTrack] = useState<AudioFile>();
	const [isTrackPlaying, setIsTrackPlaying] = useState(false);
	const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(-1);
	const trackController = useAudioPlayer(currentTrack?.path);
	const [currentTrackTimePlaying, setCurrentTrackTimePlaying] = useState(0);
	const currentTrackPlayingTimeId = useRef<NodeJS.Timeout | null>(null);

	// const clearAutoNextTimout = () => {
	// 	if (autoNextTimoutId.current) {
	// 		clearTimeout(autoNextTimoutId.current);
	// 		autoNextTimoutId.current = undefined;
	// 	}
	// };

	const clearTrackPlayingTimeId = useCallback(() => {
		if (currentTrackPlayingTimeId.current) {
			clearInterval(currentTrackPlayingTimeId.current);
			currentTrackPlayingTimeId.current = null;
		}
	}, []);

	const handleTrackPlayingTime = useCallback(
		(trackCtl: AudioPlayer) => {
			clearTrackPlayingTimeId();
			if (trackCtl?.duration) {
				currentTrackPlayingTimeId.current = setInterval(() => {
					setCurrentTrackTimePlaying((prev) => {
						if (prev >= trackCtl.duration) {
							clearTrackPlayingTimeId();
							return prev;
						}
						return prev + 1;
					});
				}, 1000);
			}
		},
		[clearTrackPlayingTimeId]
	);

	const handlePlayTrackChange = useCallback(
		(track: AudioFile) => {
			console.log('TRACK CONTROLLER:', trackController);
			clearTrackPlayingTimeId();
			setCurrentTrack(track);
			setCurrentTrackTimePlaying(0);
		},
		[clearTrackPlayingTimeId, trackController]
	);

	const playNextAudio = useCallback(() => {
		let curTrackIdx = -1;
		setCurrentTrackIndex((prev) => {
			if (prev === undefined || prev === -1 || trackList.length < 2) {
				return 0;
			}
			const trackListMaxIdx = Math.max(trackList.length - 1, 0);
			curTrackIdx = prev < trackListMaxIdx ? prev + 1 : 0;
			return curTrackIdx;
		});
		setCurrentTrack(trackList[curTrackIdx]);
	}, [trackList]);

	const playPrevAudio = useCallback(() => {
		if (
			currentTrackIndex === undefined ||
			currentTrackIndex === -1 ||
			trackList.length < 2
		) {
			return;
		}
		let nextTrackIdx =
			currentTrackIndex > 0 ? currentTrackIndex - 1 : trackList.length - 1;
		setCurrentTrackIndex(nextTrackIdx);
		setCurrentTrack(trackList[nextTrackIdx]);
	}, [currentTrackIndex, setCurrentTrack, setCurrentTrackIndex, trackList]);

	const togglePlay = useCallback(() => {
		setIsTrackPlaying?.((prev) => {
			if (prev) {
				trackController?.pause();
				clearTrackPlayingTimeId();
				// clearAutoNextTimout();
			} else {
				trackController?.play();
				// autoNextTimoutId.current = setTimeout(() => {
				// 	playNextAudio();
				// }, trackController.currentTime * 1000);
			}
			return !prev;
		});
	}, [clearTrackPlayingTimeId, trackController]);

	// Handle play in background
	useEffect(() => {
		setAudioModeAsync({
			shouldPlayInBackground: true,
		});
	}, []);

	useEffect(() => {
		if (currentTrack?.path) {
			trackController?.play();
			setIsTrackPlaying?.(true);
			handleTrackPlayingTime(trackController);
		}
	}, [trackController, currentTrack?.path, handleTrackPlayingTime]);

	return (
		<TrackContext.Provider
			value={{
				trackList,
				trackController,
				currentTrack,
				setCurrentTrack: handlePlayTrackChange,
				setTrackList,
				isTrackPlaying,
				setIsTrackPlaying,
				currentTrackIndex,
				setCurrentTrackIndex,
				playNextAudio,
				playPrevAudio,
				togglePlay,
				currentTrackTimePlaying,
				setCurrentTrackTimePlaying,
			}}
		>
			{props.children}
		</TrackContext.Provider>
	);
}
