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
	setCurrentTrack: React.Dispatch<React.SetStateAction<AudioFile | undefined>>;
	setTrackList: React.Dispatch<React.SetStateAction<AudioFile[]>>;
	isTrackPlaying?: boolean;
	setIsTrackPlaying?: React.Dispatch<React.SetStateAction<boolean>>;
	currentTrackIndex?: number;
	setCurrentTrackIndex: React.Dispatch<React.SetStateAction<number>>;
	playNextAudio?: () => void;
	playPrevAudio?: () => void;
	togglePlay?: () => void;
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
});

export default function TracksProvider(props: PropsWithChildren) {
	const autoNextTimoutId = useRef<NodeJS.Timeout>();
	const [trackList, setTrackList] = useState<AudioFile[]>([]);
	const [currentTrack, setCurrentTrack] = useState<AudioFile>();
	const [isTrackPlaying, setIsTrackPlaying] = useState(false);
	const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(-1);
	const trackController = useAudioPlayer(currentTrack?.path);

	const clearAutoNextTimout = () => {
		if (autoNextTimoutId.current) {
			clearTimeout(autoNextTimoutId.current);
			autoNextTimoutId.current = undefined;
		}
	};

	const playNextAudio = useCallback(() => {
		clearAutoNextTimout();
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
				console.log('TRACK CURRENT TIME..', trackController.currentTime);
				trackController?.pause();
				clearAutoNextTimout();
			} else {
				trackController?.play();
				console.log('TRACK CURRENT TIME..', trackController.currentTime);
				autoNextTimoutId.current = setTimeout(() => {
					playNextAudio();
				}, trackController.currentTime * 1000);
			}
			return !prev;
		});
	}, [playNextAudio, trackController]);

	// Handle play in background
	useEffect(() => {
		setAudioModeAsync({
			shouldPlayInBackground: true,
		});
	}, []);

	useEffect(() => {
		if (currentTrack?.path) {
			autoNextTimoutId.current = setTimeout(() => {
				playNextAudio();
			}, trackController.duration * 1000);
			trackController?.play();
			setIsTrackPlaying?.(true);
			console.log('TRACK DURATION...', trackController.duration);
		}
	}, [trackController, currentTrack?.path, playNextAudio]);

	return (
		<TrackContext.Provider
			value={{
				trackList,
				trackController,
				currentTrack,
				setCurrentTrack,
				setTrackList,
				isTrackPlaying,
				setIsTrackPlaying,
				currentTrackIndex,
				setCurrentTrackIndex,
				playNextAudio,
				playPrevAudio,
				togglePlay,
			}}
		>
			{props.children}
		</TrackContext.Provider>
	);
}
