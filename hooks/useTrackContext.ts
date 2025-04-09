import { TrackContext } from "@/context/player-context"
import { useContext } from "react"

export const useTrackContext = () => {
  const trackContext = useContext(TrackContext)
  return trackContext
}