import { AudioFile } from '@/interface/playlist';
import { AudioPlayer, useAudioPlayer } from 'expo-audio';
import { createContext, PropsWithChildren, useState } from 'react';

export type PlayerContextType = {
	trackController?: AudioPlayer;
	trackList: AudioFile[];
	currentTrack?: AudioFile;
	setCurrentTrack: (track: AudioFile) => void;
	setTrackList: (tracks: AudioFile[]) => void;
	isTrackPlaying?: boolean;
	setIsTrackPlaying?: (b: boolean) => void;
};

export const TrackContext = createContext<PlayerContextType>({
	trackController: undefined,
	trackList: [],
	currentTrack: undefined,
	setCurrentTrack: () => {},
	setTrackList: () => {},
});

export default function TracksProvider(props: PropsWithChildren) {
	const [trackList, setTrackList] = useState<AudioFile[]>([]);
	const [currentTrack, setCurrentTrack] = useState<AudioFile>();
	const [isTrackPlaying, setIsTrackPlaying] = useState(false);
	const trackController = useAudioPlayer(currentTrack?.path);
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
			}}
		>
			{props.children}
		</TrackContext.Provider>
	);
}
