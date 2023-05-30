import { create } from 'zustand'

/* eslint-disable */
interface CommonStoreState {
  numberOfRoutesChanged: number
  setNumberOfRoutesChanged: (numberOfRoutesChanged: number) => void
  increaseNumberOfRoutesChanged: () => void
}

export const useCommonStore = create<CommonStoreState>((set) => ({
  numberOfRoutesChanged: 0,
  setNumberOfRoutesChanged: (numberOfRoutesChanged) =>
    set(() => ({ numberOfRoutesChanged })),
  increaseNumberOfRoutesChanged: () =>
    set((state) => ({ numberOfRoutesChanged: state.numberOfRoutesChanged + 1 }))
}))
