import reducer, { addPlayer } from '@/store/features/players/players.slice'
import uuid from 'react-uuid'

describe('PlayersSlice', () => {
	it('should return the initial state', () => {
		expect(reducer(undefined, { type: undefined })).toEqual({
			players: [],
			error: '',
		})
	})

	it('should add players', () => {
		const initialState = {
			players: [],
			error: '',
		}

		expect(reducer(initialState, addPlayer('Player 1'))).toEqual({
			players: [{ id: expect.any(String), name: 'Player 1' }],
			error: '',
		})
	})

	it('should add more than 1 player', () => {
		const initialState = {
			players: [
				{ id: uuid(), name: 'Player 1' },
			],
			error: '',
		}

		expect(reducer(initialState, addPlayer('Player 2'))).toEqual({
			players: [
				{ id: expect.any(String), name: 'Player 1' },
				{ id: expect.any(String), name: 'Player 2' },
			],
			error: '',
		})
	})

	it('should not add more than 5 players', () => {
		const initialState = {
			players: [
				{ id: uuid(), name: 'Player 1' },
				{ id: uuid(), name: 'Player 2' },
				{ id: uuid(), name: 'Player 3' },
				{ id: uuid(), name: 'Player 4' },
				{ id: uuid(), name: 'Player 5' },
			],
			error: '',
		}

		expect(reducer(initialState, addPlayer( 'Player 6'))).toEqual({
			players: initialState.players,
			error: 'Maximum number of players is 5'
		})
	})

	it('should not add a player with the same name', () => {
		const initialState = {
			players: [
				{ id: uuid(), name: 'Player 1' },
			],
			error: '',
		}

		expect(reducer(initialState, addPlayer('Player 1'))).toEqual({
			players: initialState.players,
			error: 'Player name already exists'
		})
	})

	it('should not add a player with an empty name', () => {
		const initialState = {
			players: [],
			error: '',
		}

		expect(reducer(initialState, addPlayer(''))).toEqual({
			players: initialState.players,
			error: 'Player name cannot be empty'
		})
	})
})
