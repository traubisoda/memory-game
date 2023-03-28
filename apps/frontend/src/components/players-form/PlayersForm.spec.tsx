import { renderWithProviders } from '@/utils/test-utils'
import PlayersForm from '@/components/players-form/PlayersForm'
import { fireEvent, screen } from '@testing-library/react'

describe('PlayersForm', () => {
	it('adds a player to the list', () => {
		renderWithProviders(<PlayersForm />)
		const input = screen.getByRole('textbox')
		const button = screen.getByRole('button')
		fireEvent.change(input, { target: { value: 'Player 1' } })
		fireEvent.click(button)
		expect(screen.getByText('Player 1')).toBeInTheDocument()
	})

	it('clears the input after adding a player', () => {
		renderWithProviders(<PlayersForm />)
		const input = screen.getByRole('textbox')
		const button = screen.getByRole('button')
		fireEvent.change(input, { target: { value: 'Player 1' } })
		fireEvent.click(button)
		expect(input).toHaveValue('')
	})

	it('adds multiple players to the list', () => {
		renderWithProviders(<PlayersForm />)
		const input = screen.getByRole('textbox')
		const button = screen.getByRole('button')
		fireEvent.change(input, { target: { value: 'Player 1' } })
		fireEvent.click(button)
		fireEvent.change(input, { target: { value: 'Player 2' } })
		fireEvent.click(button)
		expect(screen.getByText('Player 1')).toBeInTheDocument()
		expect(screen.getByText('Player 2')).toBeInTheDocument()
	})

	it('does not add a player with an empty name', () => {
		renderWithProviders(<PlayersForm />)
		const input = screen.getByRole('textbox')
		const button = screen.getByRole('button')
		fireEvent.change(input, { target: { value: '' } })
		fireEvent.click(button)
		expect(screen.getByRole('player-list').childElementCount).toBe(0)
		expect(screen.getByText('Player name cannot be empty')).toBeInTheDocument()
	})

	it('does not add a player with a name that already exists', () => {
renderWithProviders(<PlayersForm />)
		const input = screen.getByRole('textbox')
		const button = screen.getByRole('button')
		fireEvent.change(input, { target: { value: 'Player 1' } })
		fireEvent.click(button)
		fireEvent.change(input, { target: { value: 'Player 1' } })
		fireEvent.click(button)
		expect(screen.getAllByText('Player 1')).toHaveLength(1)
		expect(screen.getByText('Player name already exists')).toBeInTheDocument()
	})

})
