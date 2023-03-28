import { createSlice } from '@reduxjs/toolkit'
import type { RootState } from '@/store/store'

interface AppState {
	status: 'menu' | 'playing' | 'gameOver'
}

const initialState: AppState = {
	status: 'menu',
}

export const appSlice = createSlice({
	name: 'app',
	initialState,
	reducers: {
		startGame: (state) => {
			state.status = 'playing'
		},
		endGame: (state) => {
			state.status = 'gameOver'
		},
		goToMenu: (state) => {
			state.status = 'menu'
		},
	},
})

export const { startGame, endGame, goToMenu } = appSlice.actions

export const selectGameStatus = (state: RootState) => state.app.status

export default appSlice.reducer
