import { create } from "zustand"

interface ArtifactState {
  isVisible: boolean
  setVisible: (visible: boolean) => void
}

export const useArtifactSelector = create<ArtifactState>((set) => ({
  isVisible: false,
  setVisible: (visible) => set({ isVisible: visible }),
}))
