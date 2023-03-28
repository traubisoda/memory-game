import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '@/store/store'
import uuid from 'react-uuid'

interface PlayerState {
	players: Player[]
	error: string
}

const initialState: PlayerState = {
	players: [],
	error: '',
}

export const playersSlice = createSlice({
	name: 'players',
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

export const selectPlayers = (state: RootState) => state.players.players

export const { addPlayer } = playersSlice.actions

export default playersSlice.reducer
