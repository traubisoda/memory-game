interface CardProps {
	cardItem: Card
	disabled: boolean
	onClick: () => void
}

const Card = ({ cardItem, onClick, disabled }: CardProps) => (
	<div
		data-testid="card"
		className={`relative aspect-square overflow-hidden rounded-xl shadow-xl transition-all duration-500 [transform-style:preserve-3d] ${
			cardItem.selected ? '[transform:rotateY(180deg)]' : ''
		} ${
			disabled || cardItem.selected || cardItem.found
				? 'pointer-events-none'
				: 'pointer-events-auto cursor-pointer'
		}`}
		onClick={onClick}
	>
		<img
			src={cardItem.imageUrl}
			className={`'aspect-square h-auto w-full object-cover`}
			data-testid="card-image"
		/>
		{!cardItem.found && (
			<div
				className={`absolute inset-0 bg-gradient-to-br from-cyan-500 to-pink-500 transition-all duration-500  [transform-style:preserve-3d] [backface-visibility:hidden] ${
					cardItem.selected ? '[transform:rotateY(180deg)]' : ''
				} `}
				data-testid="card-back"
			></div>
		)}
		{cardItem.found && (
			<div
				className="absolute inset-0 border border-gray-200 bg-gray-100"
				data-testid="placeholder"
			></div>
		)}
	</div>
)

export default Card
