import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import uuid from 'react-uuid'
import { RootState } from '@/store/store'

export interface GameState {
	status: 'uninitialized' | 'initializing' | 'ready'
	board: Card[]
	scoreBoard: ScoreBoard
	activePlayer: Player | undefined
	players: Player[]
	error: string | undefined
}

const initialState: GameState = {
	status: 'uninitialized',
	board: [],
	activePlayer: undefined,
	players: [],
	error: undefined,
	scoreBoard: {},
}

export const gameSlice = createSlice({
	name: 'game',
	initialState,
	reducers: {
		addPlayer: (state, action: PayloadAction<string>) => {
			if (action.payload === '') {
				state.error = 'Player name cannot be empty'
				return
			}

			if (state.players.length === 5) {
				state.error = 'Maximum number of players is 5'
				return
			}

			if (state.players.find((player) => player.name === action.payload)) {
				state.error = 'Player name already exists'
				return
			}

			state.players.push({
				id: uuid(),
				name: action.payload,
			})
		},
	},
})

export const selectPlayers = (state: RootState) => state.game.players

export const { addPlayer } = gameSlice.actions

export default gameSlice.reducer
