import { renderWithProviders } from '@/utils/test-utils'
import GameMenu from '@/components/game-menu/GameMenu'
import { fireEvent, screen } from '@testing-library/react'

describe('GameMenu', () => {
	it('renders the menu', () => {
		renderWithProviders(<GameMenu />)
		expect(screen.getByText('Start game')).toBeInTheDocument()
	})

	it("doesn't start the game until at least one player is added", () => {
		renderWithProviders(<GameMenu />)
		const button = screen.getByText('Start game')
		fireEvent.click(button)
		expect(
			screen.getByText('You need at least 1 player to start the game')
		).toBeInTheDocument()
	})

	// it('starts the game when at least one player is added', () => {
	// 	renderWithProviders(<GameMenu />)
	// 	const input = screen.getByRole('textbox')
	// 	const button = screen.getByText('Start game')
	// 	fireEvent.change(input, { target: { value: 'Player 1' } })
	// 	fireEvent.click(button)
	// 	expect(button.getAttribute('disabled')).toBeFalsy()
	// })
})
