import { screen } from '@testing-library/react'
import Card from '@/components/card/Card'
import { vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { render } from '@/utils/test-utils'

const MOCK_CARD = {
	id: '1',
	selected: false,
	found: false,
	imageUrl: 'link-to-image',
}

describe('Card', () => {
	it('should render the card', () => {
		render(<Card cardItem={MOCK_CARD} disabled={false} onClick={() => {}} />)
		expect(screen.getByTestId('card')).toBeInTheDocument()
	})

	describe('when the card is not selected', () => {
		const cardItem = {
			...MOCK_CARD,
			selected: false,
		}

		it('should not show the image', () => {
			// eslint-disable-next-line @typescript-eslint/no-empty-function
			render(<Card cardItem={cardItem} disabled={false} onClick={() => {}} />)
			expect(
				screen
					.getByTestId('card-back')
					.classList.contains('[transform:rotateY(180deg)]')
			).toBe(false)
		})

		it('should run the onClick function when the card is clicked', async () => {
			const onClick = vi.fn()
			const user = userEvent.setup()
			render(<Card cardItem={cardItem} disabled={false} onClick={onClick} />)
			await user.click(screen.getByTestId('card'))
			expect(onClick).toHaveBeenCalled()
		})
	})

	describe('when the card is disabled', () => {
		const cardItem = {
			...MOCK_CARD,
		}

		it.only('should not run the onClick function when the card is disabled', async () => {
			const onClick = vi.fn()
			const user = userEvent.setup()
			render(<Card cardItem={cardItem} disabled={true} onClick={onClick} />)
			await expect(
				user.click(screen.getByTestId('card'))
			).rejects.toThrowError()
			expect(onClick).not.toHaveBeenCalled()
		})
	})

	describe('when the card is selected', () => {
		const cardItem = {
			...MOCK_CARD,
			selected: true,
		}
		it('should show the image when the card is selected', () => {
			// eslint-disable-next-line @typescript-eslint/no-empty-function
			render(<Card cardItem={cardItem} disabled={false} onClick={() => {}} />)
			expect(
				screen
					.getByTestId('card-back')
					.classList.contains('[transform:rotateY(180deg)]')
			).toBe(true)
		})

		it('should not run the onClick function', async () => {
			const onClick = vi.fn()
			const user = userEvent.setup()
			render(<Card cardItem={cardItem} disabled={false} onClick={onClick} />)
			await expect(
				user.click(screen.getByTestId('card'))
			).rejects.toThrowError()
			expect(onClick).not.toHaveBeenCalled()
		})
	})

	describe('when the card is found', () => {
		const cardItem = {
			...MOCK_CARD,
			found: true,
		}
		it('should show not the image', () => {
			render(<Card cardItem={cardItem} disabled={false} onClick={() => {}} />)
			expect(screen.getByTestId('placeholder')).toBeInTheDocument()
		})
	})
})
