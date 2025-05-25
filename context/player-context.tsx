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

	const handlePlayTrackChange = useCallback(
		(track: AudioFile) => {
			if (trackController?.duration) {
				clearTrackPlayingTimeId();
				setCurrentTrack(track);
				setCurrentTrackTimePlaying(0);
				currentTrackPlayingTimeId.current = setInterval(() => {
					setCurrentTrackTimePlaying((prev) => {
						if (prev >= trackController.duration) {
							currentTrackPlayingTimeId.current &&
								clearInterval(currentTrackPlayingTimeId.current);
							return prev;
						}
						return prev + 1;
					});
				}, 1000);
			}
		},
		[clearTrackPlayingTimeId, trackController?.duration]
	);

	const playNextAudio = useCallback(() => {
		// clearAutoNextTimout();
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
	}, [trackController]);

	// Handle play in background
	useEffect(() => {
		setAudioModeAsync({
			shouldPlayInBackground: true,
		});
	}, []);

	useEffect(() => {
		if (currentTrack?.path) {
			// autoNextTimoutId.current = setTimeout(() => {
			// 	playNextAudio();
			// }, trackController.duration * 1000);
			trackController?.play();
			setIsTrackPlaying?.(true);
		}
	}, [trackController, currentTrack?.path]);

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
