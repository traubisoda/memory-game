import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { AppDispatch, RootState } from '@/store/store'

interface AppState {
	status: 'menu' | 'playing' | 'gameOver'
	error: string | undefined
}

const initialState: AppState = {
	status: 'menu',
	error: undefined,
}

export const appSlice = createSlice({
	name: 'app',
	initialState,
	reducers: {
		setError: (state, action: PayloadAction<string>) => {
			state.error = action.payload
		},
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

export const { endGame, goToMenu, setError } = appSlice.actions

export const startGame =
	() => (dispatch: AppDispatch, getState: () => RootState) => {
		const store = getState()
		if (store.game.players.length < 1) {
			dispatch(setError('You need at least 1 player to start the game'))
			return
		}

		dispatch(appSlice.actions.startGame())
	}

export const selectGameStatus = (state: RootState) => state.app.status
export const selectError = (state: RootState) => state.app.error

export default appSlice.reducer
