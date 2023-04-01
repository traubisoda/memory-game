import reducer, { addPlayer, GameState } from '@/store/features/game/game.slice'
import uuid from 'react-uuid'

const INITIAL_STATE: GameState = {
	status: 'uninitialized',
	board: [],
	activePlayer: undefined,
	players: [],
	error: undefined,
	scoreBoard: {},
}

describe('GameSlice', () => {
	it('should return the initial state', () => {
		expect(reducer(undefined, { type: undefined })).toEqual(INITIAL_STATE)
	})

	it('should add players', () => {
		expect(reducer(INITIAL_STATE, addPlayer('Player 1'))).toEqual({
			...INITIAL_STATE,
			players: [{ id: expect.any(String), name: 'Player 1' }],
		})
	})

	it('should add more than 1 player', () => {
		const initialState = {
			...INITIAL_STATE,
			players: [{ id: uuid(), name: 'Player 1' }],
		}

		expect(reducer(initialState, addPlayer('Player 2'))).toEqual({
			...INITIAL_STATE,
			players: [
				{ id: expect.any(String), name: 'Player 1' },
				{ id: expect.any(String), name: 'Player 2' },
			],
		})
	})

	it('should not add more than 5 players', () => {
		const initialState = {
			...INITIAL_STATE,
			players: [
				{ id: uuid(), name: 'Player 1' },
				{ id: uuid(), name: 'Player 2' },
				{ id: uuid(), name: 'Player 3' },
				{ id: uuid(), name: 'Player 4' },
				{ id: uuid(), name: 'Player 5' },
			],
			error: '',
		}

		expect(reducer(initialState, addPlayer('Player 6'))).toEqual({
			...INITIAL_STATE,
			players: initialState.players,
			error: 'Maximum number of players is 5',
		})
	})

	it('should not add a player with the same name', () => {
		const initialState = {
			...INITIAL_STATE,
			players: [{ id: uuid(), name: 'Player 1' }],
		}

		expect(reducer(initialState, addPlayer('Player 1'))).toEqual({
			...INITIAL_STATE,
			players: initialState.players,
			error: 'Player name already exists',
		})
	})

	it('should not add a player with an empty name', () => {
		const initialState = {
			...INITIAL_STATE,
			players: [],
		}

		expect(reducer(initialState, addPlayer(''))).toEqual({
			...INITIAL_STATE,
			players: initialState.players,
			error: 'Player name cannot be empty',
		})
	})
})
