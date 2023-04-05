import GameScreen from '@/components/game-screen/GameScreen'
import { renderWithProviders } from '@/utils/test-utils'
import { screen } from '@testing-library/react'
import { GameState } from '@/store/features/game/game.slice'

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

describe('GameScreen', () => {
	it('should render the scoreboard', () => {
		const { store } = renderWithProviders(<GameScreen />, {
			preloadedState: PRELOADED_STATE,
		})
		expect(screen.getByRole('scoreboard')).toBeInTheDocument()
	})
})
