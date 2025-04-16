import { AudioFile } from '@/interface/playlist';
import { AudioPlayer, useAudioPlayer, setAudioModeAsync } from 'expo-audio';
import { createContext, PropsWithChildren, useEffect, useState } from 'react';

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
};

export const TrackContext = createContext<PlayerContextType>({
	trackController: undefined,
	trackList: [],
	currentTrack: undefined,
	setCurrentTrack: () => {},
	setTrackList: () => {},
	currentTrackIndex: -1,
	setCurrentTrackIndex: () => {},
});

export default function TracksProvider(props: PropsWithChildren) {
	const [trackList, setTrackList] = useState<AudioFile[]>([]);
	const [currentTrack, setCurrentTrack] = useState<AudioFile>();
	const [isTrackPlaying, setIsTrackPlaying] = useState(false);
	const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(-1);
	const trackController = useAudioPlayer(currentTrack?.path);
	useEffect(() => {
		setAudioModeAsync({
			shouldPlayInBackground: true,
		});
	}, []);
	useEffect(() => {
		if (currentTrack?.path && trackController) {
			trackController?.play();
			setIsTrackPlaying?.(true);
		}
	}, [currentTrack?.path, trackController, setIsTrackPlaying]);
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
			}}
		>
			{props.children}
		</TrackContext.Provider>
	);
}
