import { describe, expect, it } from 'vitest'
import { renderWithProviders } from '@/utils/test-utils'
import App from '@/App'
import { screen } from '@testing-library/react'

describe('AppComponents', () => {
	it('renders the menu by default', () => {
		renderWithProviders(<App />)
		expect(screen.getByText('Start game')).toBeInTheDocument()
	})
})
