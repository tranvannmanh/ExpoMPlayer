import { AudioFile } from "@/interface/playlist";
import Sound from "react-native-sound";

class PlayerService {
  private static instance: PlayerService;
  private currentTrack: AudioFile | null = null;
  private trackList: AudioFile[] = [];
  private soundInstance: Sound | null = null;

  private constructor() {}

  public static getInstance(): PlayerService {
    if (!PlayerService.instance) {
      PlayerService.instance = new PlayerService();
    }
    return PlayerService.instance;
  }

  public setCurrentTrack(track: AudioFile): void {
    this.currentTrack = track;
  }

  public getCurrentTrack(): AudioFile | null {
    return this.currentTrack;
  }

  public setTrackList(tracks: AudioFile[]): void {
    this.trackList = tracks;
  }

  public getTrackList(): AudioFile[] {
    return this.trackList;
  }

  public togglePlayTrack(track: AudioFile): void {
    // If the same track is playing, stop it
    if (this.currentTrack && this.currentTrack.path === track.path) {
      if (this.soundInstance) {
        this.soundInstance.stop(() => {
          this.soundInstance?.release();
          this.soundInstance = null;
          this.currentTrack = null;
          console.log("Stopped track:", track);
        });
      } else {
        this.currentTrack = null;
        console.log("Stopped track (no sound instance):", track);
      }
      return;
    }

    // Stop and release any previous sound
    if (this.soundInstance) {
      console.log("Stopping previous track:", this.currentTrack);
      this.soundInstance.stop(() => {
        this.soundInstance?.release();
        this.soundInstance = null;
      });
    }

    this.setCurrentTrack(track);
    console.log("Playing track:", track);

    this.soundInstance = new Sound(track.path, Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.log("Failed to load sound", error);
        this.currentTrack = null;
        return;
      }
      this.soundInstance?.play((success) => {
        if (success) {
          console.log("Successfully finished playing");
        } else {
          console.log("Playback failed");
        }
        this.soundInstance?.release();
        this.soundInstance = null;
        this.currentTrack = null;
      });
    });
  }

  public playTrackList(tracks: AudioFile[]): void {
    // Stop any currently playing track
    if (this.soundInstance) {
      this.soundInstance.stop(() => {
        this.soundInstance?.release();
        this.soundInstance = null;
      });
    }
    this.setTrackList(tracks);
    if (tracks.length > 0) {
      this.togglePlayTrack(tracks[0]);
      // play next track
      // this.soundInstance?.setOnPlaybackFinished(() => {
      //   const currentIndex = this.trackList.findIndex(
      //     (t) => t.path === this.currentTrack?.path
      //   );
      //   if (currentIndex >= 0 && currentIndex < this.trackList.length - 1) {
      //     this.togglePlayTrack(this.trackList[currentIndex + 1]);
      //   }
      // });
    }
  }

  public nextTrack(): void {
    if (!this.currentTrack || !this.soundInstance) return;

    const currentIndex = this.trackList.findIndex(
      (t) => t.path === this.currentTrack?.path
    );
    if (currentIndex >= 0 && currentIndex < this.trackList.length - 1) {
      this.togglePlayTrack(this.trackList[currentIndex + 1]);
    }
  }

  public previousTrack(): void {
    if (!this.currentTrack || !this.soundInstance) return;

    const currentIndex = this.trackList.findIndex(
      (t) => t.path === this.currentTrack?.path
    );
    if (currentIndex > 0) {
      this.togglePlayTrack(this.trackList[currentIndex - 1]);
    }
  }
}

export const playerService = PlayerService.getInstance();
