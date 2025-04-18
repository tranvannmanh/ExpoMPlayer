import { AudioFile } from '@/interface/playlist';
import { AudioPlayer, useAudioPlayer, setAudioModeAsync } from 'expo-audio';
import {
	createContext,
	PropsWithChildren,
	useCallback,
	useEffect,
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
	const [trackList, setTrackList] = useState<AudioFile[]>([]);
	const [currentTrack, setCurrentTrack] = useState<AudioFile>();
	const [isTrackPlaying, setIsTrackPlaying] = useState(false);
	const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(-1);
	const trackController = useAudioPlayer(currentTrack?.path);
	const togglePlay = useCallback(() => {
		setIsTrackPlaying?.((prev) => {
			if (prev) {
				trackController?.pause();
			} else {
				trackController?.play();
			}
			return !prev;
		});
	}, [setIsTrackPlaying, trackController]);
	const playNextAudio = useCallback(() => {
		if (
			currentTrackIndex === undefined ||
			currentTrackIndex === -1 ||
			trackList.length < 2
		) {
			return;
		}
		const trackListMaxIdx = Math.max(trackList.length - 1, 0);
		let nextTrackIdx =
			currentTrackIndex < trackListMaxIdx ? currentTrackIndex + 1 : 0;
		setCurrentTrackIndex(nextTrackIdx);
		setCurrentTrack(trackList[nextTrackIdx]);
	}, [currentTrackIndex, setCurrentTrack, setCurrentTrackIndex, trackList]);
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
	useEffect(() => {
		setAudioModeAsync({
			shouldPlayInBackground: true,
		});
	}, []);
	useEffect(() => {
		if (currentTrack?.path && trackController) {
			trackController?.play();
			setIsTrackPlaying?.(true);
			setTimeout(() => {
				playNextAudio();
			}, trackController.duration * 1000);
		}
	}, [currentTrack?.path, trackController, setIsTrackPlaying, playNextAudio]);
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
