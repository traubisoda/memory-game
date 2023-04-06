import {
	createAsyncThunk,
	createSlice,
	Draft,
	PayloadAction,
} from '@reduxjs/toolkit'
import uuid from 'react-uuid'
import { BUSY_TIMEOUT_ON_MATCH, BUSY_TIMEOUT_ON_SELECT } from '@/config'
import { AppDispatch, RootState } from '@/store/store'

const NUMBER_OF_CARDS = 18

export interface GameState {
	status: 'uninitialized' | 'initializing' | 'ready' | 'busy' | 'finished'
	board: Card[]
	scoreBoard: ScoreBoard
	activePlayerIndex: number
	players: Player[]
	error: string | undefined
}

const initialState: GameState = {
	status: 'uninitialized',
	board: [],
	activePlayerIndex: 0,
	players: [],
	error: undefined,
	scoreBoard: {},
}

export const selectPlayers = (state: RootState) => state.game.players
export const selectBoard = (state: RootState) => state.game.board
export const selectActivePlayer = (state: RootState) =>
	state.game.players[state.game.activePlayerIndex]
export const selectGameStatus = (state: RootState) => state.game.status
export const selectScoreboard = (state: RootState) =>
	Object.keys(state.game.scoreBoard)
		.reduce(
			(scoreBoard: { player: Player; score: number }[], playerId: string) => {
				const item = {
					player: state.game.players.find(
						(player) => player.id === playerId
					) as Player,
					score: state.game.scoreBoard[playerId],
				}
				scoreBoard.push(item)
				return scoreBoard
			},
			[]
		)
		.sort((a, b) => b.score - a.score)

export const gameSlice = createSlice({
	name: 'game',
	initialState,
	reducers: {
		initializeScoreBoard: (state: Draft<GameState>) => {
			state.scoreBoard = state.players.reduce((scoreBoard, player) => {
				scoreBoard[player.id] = 0
				return scoreBoard
			}, {} as ScoreBoard)
		},
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
		setNextActivePlayer: (state: Draft<GameState>) => {
			if (state.activePlayerIndex === state.players.length - 1) {
				state.activePlayerIndex = 0
				return
			}

			state.activePlayerIndex += 1
		},
		selectCard: (
			state: Draft<GameState>,
			action: PayloadAction<{ cardIndex: number }>
		) => {
			const card = state.board[action.payload.cardIndex]
			if (
				card &&
				!card.found &&
				state.board.filter((c) => c.selected).length < 2
			) {
				card.selected = true
			}
		},
		setCardsToFound: (state: Draft<GameState>) => {
			state.board.forEach((card) => {
				if (card.selected) {
					card.found = true
				}
			})
		},
		deselectCards: (state: Draft<GameState>) => {
			state.board.forEach((card) => {
				card.selected = false
			})
		},
		addPointToActivePlayer: (state: Draft<GameState>) => {
			const player = state.players[state.activePlayerIndex]
			state.scoreBoard[player.id] += 1
		},
		finishGame: (state: Draft<GameState>) => {
			state.status = 'finished'
		},
		setBusy: (
			state: Draft<GameState>,
			action: PayloadAction<{ busy: boolean }>
		) => {
			state.status = action.payload.busy ? 'busy' : 'ready'
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchCards.pending, (state) => {
				state.status = 'initializing'
			})
			.addCase(fetchCards.fulfilled, (state, action) => {
				state.status = 'ready'
				const cards = action.payload.map((imageUrl: string) => ({
					id: uuid(),
					found: false,
					imageUrl,
				}))
				state.board = [...cards, ...cards]
					.map((card) => ({ card, sort: Math.random() }))
					.sort((a, b) => a.sort - b.sort)
					.map(({ card }) => card)
			})
	},
})

export const initializeGame = () => (dispatch: AppDispatch) => {
	dispatch(initializeScoreBoard())
	dispatch(setNextActivePlayer)
	dispatch(fetchCards())
}

export const cardClick =
	(cardIndex: number) => (dispatch: AppDispatch, getState: () => RootState) => {
		dispatch(setBusy({ busy: true }))
		dispatch(selectCard({ cardIndex }))
		if (getState().game.board.filter((card) => card.selected).length === 2) {
			setTimeout(() => {
				const isMatch = dispatch(checkMatch())
				if (isMatch) {
					dispatch(addPointToActivePlayer())
					dispatch(setCardsToFound())
					if (
						getState().game.board.filter((card) => !card.found).length === 0
					) {
						dispatch(finishGame())
					}
				} else {
					dispatch(setNextActivePlayer())
				}
				dispatch(deselectCards())
				dispatch(setBusy({ busy: false }))
			}, BUSY_TIMEOUT_ON_MATCH)
		} else {
			setTimeout(() => {
				dispatch(setBusy({ busy: false }))
			}, BUSY_TIMEOUT_ON_SELECT)
		}
	}

const checkMatch = () => (dispatch: AppDispatch, getState: () => RootState) => {
	const selectedCards = getState().game.board.filter((card) => card.selected)
	return (
		selectedCards.length === 2 && selectedCards[0].id === selectedCards[1].id
	)
}

const fetchCards = createAsyncThunk('game/load-cards', async () => {
	const response = await fetch(
		`https://dog.ceo/api/breed/hound/images/random/${NUMBER_OF_CARDS / 2}`
	)
	const data = await response.json()
	return data.message
})

export const {
	addPlayer,
	setNextActivePlayer,
	selectCard,
	setBusy,
	initializeScoreBoard,
	deselectCards,
	addPointToActivePlayer,
	setCardsToFound,
	finishGame,
} = gameSlice.actions

export default gameSlice.reducer
