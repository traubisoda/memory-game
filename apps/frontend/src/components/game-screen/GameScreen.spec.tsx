import GameScreen from '@/components/game-screen/GameScreen'
import { renderWithProviders } from '@/utils/test-utils'
import { act, fireEvent, screen } from '@testing-library/react'
import { GameState } from '@/store/features/game/game.slice'
import { BUSY_TIMEOUT_ON_MATCH } from '@/config'
import { vi } from 'vitest'

const PRELOADED_STATE: { game: GameState } = {
	game: {
		status: 'ready',
		error: undefined,
		players: [
			{ id: '1', name: 'Player 1' },
			{ id: '2', name: 'Player 2' },
			{ id: '3', name: 'Player 3' },
		],
		scoreBoard: {
			'1': 0,
			'2': 0,
			'3': 0,
		},
		activePlayerIndex: 0,
		board: [
			{ id: '1', selected: false, found: false, imageUrl: '' },
			{ id: '2', selected: false, found: false, imageUrl: '' },
			{ id: '3', selected: false, found: false, imageUrl: '' },
			{ id: '1', selected: false, found: false, imageUrl: '' },
			{ id: '2', selected: false, found: false, imageUrl: '' },
			{ id: '3', selected: false, found: false, imageUrl: '' },
		],
	},
}

const selectMatchingCards = () => {
	const card = screen.getAllByTestId('card')[0]
	fireEvent.click(card)
	const card2 = screen.getAllByTestId('card')[3]
	fireEvent.click(card2)
}

const selectMismatchingCards = () => {
	const card = screen.getAllByTestId('card')[0]
	fireEvent.click(card)
	const card2 = screen.getAllByTestId('card')[1]
	fireEvent.click(card2)
}

describe('GameScreen', () => {
	it('should render the component', () => {
		renderWithProviders(<GameScreen />, {
			preloadedState: PRELOADED_STATE,
		})
		expect(screen.getByTestId('game-screen')).toBeInTheDocument()
	})

	it('should render the scoreboard', () => {
		renderWithProviders(<GameScreen />, {
			preloadedState: PRELOADED_STATE,
		})
		expect(screen.getByTestId('scoreboard')).toBeInTheDocument()
	})

	it('should render the cards', () => {
		renderWithProviders(<GameScreen />, {
			preloadedState: PRELOADED_STATE,
		})
		expect(screen.getAllByTestId('card')).toHaveLength(
			PRELOADED_STATE.game.board.length
		)
	})

	it('should select a card on click', () => {
		const { store } = renderWithProviders(<GameScreen />, {
			preloadedState: PRELOADED_STATE,
		})
		const card = screen.getAllByTestId('card')[0]
		fireEvent.click(card)
		expect(store.getState().game.board[0].selected).toBe(true)
	})

	it('should set the game status to busy when a card is selected', () => {
		const { store } = renderWithProviders(<GameScreen />, {
			preloadedState: PRELOADED_STATE,
		})
		const card = screen.getAllByTestId('card')[0]
		fireEvent.click(card)
		expect(store.getState().game.status).toBe('busy')
	})

	it('should set the game status to ready when delay is expired after a card is selected', () => {
		vi.useFakeTimers()
		const { store } = renderWithProviders(<GameScreen />, {
			preloadedState: PRELOADED_STATE,
		})
		const card = screen.getAllByTestId('card')[0]
		act(() => {
			fireEvent.click(card)
			setTimeout(() => 0, BUSY_TIMEOUT_ON_MATCH)
			vi.runAllTimers()
			expect(store.getState().game.status).toBe('ready')
		})
	})

	it('should set cards to found on match and unselect them', () => {
		const { store } = renderWithProviders(<GameScreen />, {
			preloadedState: PRELOADED_STATE,
		})
		act(() => {
			selectMatchingCards()
			setTimeout(() => 0, BUSY_TIMEOUT_ON_MATCH)
			vi.runAllTimers()
			expect(store.getState().game.board[0].found).toBe(true)
			expect(store.getState().game.board[3].found).toBe(true)
			expect(store.getState().game.board[0].selected).toBe(false)
			expect(store.getState().game.board[3].selected).toBe(false)
		})
	})

	it('should set cards to unselected on mismatch', () => {
		const { store } = renderWithProviders(<GameScreen />, {
			preloadedState: PRELOADED_STATE,
		})
		act(() => {
			selectMismatchingCards()
			setTimeout(() => 0, BUSY_TIMEOUT_ON_MATCH)
			vi.runAllTimers()
			expect(store.getState().game.board[0].found).toBe(false)
			expect(store.getState().game.board[1].found).toBe(false)
			expect(store.getState().game.board[0].selected).toBe(false)
			expect(store.getState().game.board[1].selected).toBe(false)
		})
	})

	it('should rotate the active player on mismatch', () => {
		const { store } = renderWithProviders(<GameScreen />, {
			preloadedState: PRELOADED_STATE,
		})
		act(() => {
			selectMismatchingCards()
			setTimeout(() => 0, BUSY_TIMEOUT_ON_MATCH)
			vi.runAllTimers()
			expect(store.getState().game.activePlayerIndex).toBe(1)
		})
	})

	it('should not rotate the active player on match', () => {
		const { store } = renderWithProviders(<GameScreen />, {
			preloadedState: PRELOADED_STATE,
		})
		act(() => {
			selectMatchingCards()
			setTimeout(() => 0, BUSY_TIMEOUT_ON_MATCH)
			vi.runAllTimers()
			expect(store.getState().game.activePlayerIndex).toBe(0)
		})
	})

	it('should increment the score of the active player on match', () => {
		const { store } = renderWithProviders(<GameScreen />, {
			preloadedState: PRELOADED_STATE,
		})
		act(() => {
			selectMatchingCards()
			setTimeout(() => 0, BUSY_TIMEOUT_ON_MATCH)
			vi.runAllTimers()
			expect(store.getState().game.scoreBoard['1']).toBe(1)
		})
	})

	it('should not increment the score of the active player on mismatch', () => {
		const { store } = renderWithProviders(<GameScreen />, {
			preloadedState: PRELOADED_STATE,
		})
		act(() => {
			selectMismatchingCards()
			setTimeout(() => 0, BUSY_TIMEOUT_ON_MATCH)
			vi.runAllTimers()
			expect(store.getState().game.scoreBoard['1']).toBe(0)
		})
	})
})
