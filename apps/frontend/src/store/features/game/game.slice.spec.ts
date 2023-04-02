import reducer, {
	addPlayer,
	addPointToActivePlayer,
	deselectCards,
	GameState,
	initializeScoreBoard,
	selectActivePlayer,
	selectBoard,
	selectCard,
	selectGameStatus,
	selectPlayers,
	selectScoreboard,
	setCardsToFound,
	setNextActivePlayer,
} from '@/store/features/game/game.slice'
import uuid from 'react-uuid'
import { RootState } from '@/store/store'

const INITIAL_STATE: GameState = {
	status: 'uninitialized',
	board: [],
	activePlayerIndex: 0,
	players: [],
	error: undefined,
	scoreBoard: {},
}

const ROOT_STATE: RootState = {
	app: {
		status: 'playing',
		error: undefined,
	},
	game: INITIAL_STATE,
}

describe('GameSlice', () => {
	describe('reducer actions', () => {
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

		it('should set the next active player', () => {
			const initialState = {
				...INITIAL_STATE,
				players: [
					{ id: uuid(), name: 'Player 1' },
					{ id: uuid(), name: 'Player 2' },
				],
				activePlayerIndex: 0,
			}

			expect(reducer(initialState, setNextActivePlayer())).toEqual({
				...INITIAL_STATE,
				players: initialState.players,
				activePlayerIndex: 1,
			})
		})

		it('should set the first active player when the last player was active', () => {
			const initialState = {
				...INITIAL_STATE,
				players: [
					{ id: uuid(), name: 'Player 1' },
					{ id: uuid(), name: 'Player 2' },
				],
				activePlayerIndex: 1,
			}

			expect(reducer(initialState, setNextActivePlayer())).toEqual({
				...INITIAL_STATE,
				players: initialState.players,
				activePlayerIndex: 0,
			})
		})

		it('should initialize the scoreboard', () => {
			const initialState = {
				...INITIAL_STATE,
				players: [
					{ id: uuid(), name: 'Player 1' },
					{ id: uuid(), name: 'Player 2' },
				],
				activePlayerIndex: 1,
			}

			expect(reducer(initialState, initializeScoreBoard())).toEqual({
				...initialState,
				scoreBoard: {
					[initialState.players[0].id]: 0,
					[initialState.players[1].id]: 0,
				},
			})
		})

		it('should select cards', () => {
			const initialState = {
				...INITIAL_STATE,
				board: [
					{ id: uuid(), found: false, selected: false, imageUrl: '' },
					{ id: uuid(), found: false, selected: false, imageUrl: '' },
					{ id: uuid(), found: false, selected: false, imageUrl: '' },
					{ id: uuid(), found: false, selected: false, imageUrl: '' },
				],
			}

			expect(reducer(initialState, selectCard({ cardIndex: 2 }))).toEqual({
				...initialState,
				board: [
					{ ...initialState.board[0], selected: false },
					{ ...initialState.board[1], selected: false },
					{ ...initialState.board[2], selected: true },
					{ ...initialState.board[3], selected: false },
				],
			})
		})

		it('should not select cards that are already found', () => {
			const initialState = {
				...INITIAL_STATE,
				board: [
					{ id: uuid(), found: false, selected: false, imageUrl: '' },
					{ id: uuid(), found: false, selected: false, imageUrl: '' },
					{ id: uuid(), found: true, selected: false, imageUrl: '' },
					{ id: uuid(), found: false, selected: false, imageUrl: '' },
				],
			}

			expect(reducer(initialState, selectCard({ cardIndex: 2 }))).toEqual({
				...initialState,
				board: [
					{ ...initialState.board[0], selected: false },
					{ ...initialState.board[1], selected: false },
					{ ...initialState.board[2], selected: false },
					{ ...initialState.board[3], selected: false },
				],
			})
		})

		it('should not deselect cards that are already selected', () => {
			const initialState = {
				...INITIAL_STATE,
				board: [
					{ id: uuid(), found: false, selected: false, imageUrl: '' },
					{ id: uuid(), found: false, selected: false, imageUrl: '' },
					{ id: uuid(), found: false, selected: true, imageUrl: '' },
					{ id: uuid(), found: false, selected: false, imageUrl: '' },
				],
			}

			expect(reducer(initialState, selectCard({ cardIndex: 2 }))).toEqual({
				...initialState,
			})
		})

		it('should set matching cards to found', () => {
			const initialState = {
				...INITIAL_STATE,
				board: [
					{ id: uuid(), found: false, selected: false, imageUrl: '' },
					{ id: uuid(), found: false, selected: false, imageUrl: '' },
					{ id: uuid(), found: false, selected: true, imageUrl: '' },
					{ id: uuid(), found: false, selected: true, imageUrl: '' },
				],
			}

			expect(reducer(initialState, setCardsToFound())).toEqual({
				...initialState,
				board: [
					{ ...initialState.board[0], found: false },
					{ ...initialState.board[1], found: false },
					{ ...initialState.board[2], found: true },
					{ ...initialState.board[3], found: true },
				],
			})
		})

		it('should be able to deselect cards', () => {
			const initialState = {
				...INITIAL_STATE,
				board: [
					{ id: uuid(), found: false, selected: false, imageUrl: '' },
					{ id: uuid(), found: false, selected: false, imageUrl: '' },
					{ id: uuid(), found: false, selected: true, imageUrl: '' },
					{ id: uuid(), found: false, selected: true, imageUrl: '' },
				],
			}

			expect(reducer(initialState, deselectCards())).toEqual({
				...initialState,
				board: [
					{ ...initialState.board[0], selected: false },
					{ ...initialState.board[1], selected: false },
					{ ...initialState.board[2], selected: false },
					{ ...initialState.board[3], selected: false },
				],
			})
		})

		it('should add a point to the active player', () => {
			const players = [
				{ id: uuid(), name: 'Player 1' },
				{ id: uuid(), name: 'Player 2' },
			]
			const initialState: GameState = {
				...INITIAL_STATE,
				players,
				activePlayerIndex: 1,
				scoreBoard: {
					[players[0].id]: 0,
					[players[1].id]: 0,
				},
			}

			expect(reducer(initialState, addPointToActivePlayer())).toEqual({
				...initialState,
				scoreBoard: {
					[initialState.players[0].id]: 0,
					[initialState.players[1].id]: 1,
				},
			})
		})
	})

	describe('selectors', () => {
		describe('selectPlayers', () => {
			it('should return the player list', () => {
				const state: RootState = {
					...ROOT_STATE,
					game: {
						...INITIAL_STATE,
						players: [
							{ id: uuid(), name: 'Player 1' },
							{ id: uuid(), name: 'Player 2' },
						],
					},
				}

				expect(selectPlayers(state)).toEqual(state.game.players)
			})
		})

		describe('selectBoard', () => {
			it('should return the board', () => {
				const state: RootState = {
					...ROOT_STATE,
					game: {
						...INITIAL_STATE,
						board: [
							{ id: uuid(), found: false, selected: false, imageUrl: '' },
							{ id: uuid(), found: false, selected: false, imageUrl: '' },
							{ id: uuid(), found: false, selected: false, imageUrl: '' },
							{ id: uuid(), found: false, selected: false, imageUrl: '' },
						],
					},
				}

				expect(selectBoard(state)).toEqual(state.game.board)
			})
		})
	})

	describe('selectActivePlayer', () => {
		it('should return the active player', () => {
			const players = [
				{ id: uuid(), name: 'Player 1' },
				{ id: uuid(), name: 'Player 2' },
			]
			const state: RootState = {
				...ROOT_STATE,
				game: {
					...INITIAL_STATE,
					players,
					activePlayerIndex: 1,
				},
			}

			expect(selectActivePlayer(state)).toEqual(players[1])
		})
	})

	describe('selectGameStatus', () => {
		it('should return the game status', () => {
			const state: RootState = {
				...ROOT_STATE,
				game: {
					...INITIAL_STATE,
					status: 'ready',
				},
			}

			expect(selectGameStatus(state)).toEqual(state.game.status)
		})
	})

	describe('selectScoreboard', () => {
		it('should return the score board order by desc score', () => {
			const players = [
				{ id: uuid(), name: 'Player 1' },
				{ id: uuid(), name: 'Player 2' },
			]

			const state: RootState = {
				...ROOT_STATE,
				game: {
					...INITIAL_STATE,
					players,
					activePlayerIndex: 1,
					scoreBoard: {
						[players[0].id]: 5,
						[players[1].id]: 9,
					},
				},
			}

			expect(selectScoreboard(state)).toEqual([
				{ player: players[1], score: 9 },
				{ player: players[0], score: 5 },
			])
		})
	})
})
