import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { useEffect } from 'react'
import {
	cardClick,
	initializeGame,
	selectActivePlayer,
	selectBoard,
	selectGameStatus,
	selectScoreboard,
} from '@/store/features/game/game.slice'

const GameScreen = () => {
	const dispatch = useAppDispatch()
	const gameStatus = useAppSelector(selectGameStatus)
	const board = useAppSelector(selectBoard)
	const activePlayer = useAppSelector(selectActivePlayer)
	const scoreBoard = useAppSelector(selectScoreboard)
	const onCardClick = (cardIndex: number) => () => {
		dispatch(cardClick(cardIndex))
	}

	useEffect(() => {
		dispatch(initializeGame())
	}, [])

	if (gameStatus === 'initializing') {
		return <div>Initializing...</div>
	}

	return (
		<div>
			<div>{activePlayer.name}'s turn</div>
			<div className="flex">
				<div className="w-1/3">
					{scoreBoard.map((item) => (
						<div key={item.player.id}>
							{item.player.name}: {item.score}
						</div>
					))}
				</div>
				<div className="grid grid-cols-6 gap-2 p-2">
					{board.map((item: Card, index: number) => (
						<div
							key={index}
							className={`relative aspect-square overflow-hidden rounded-xl shadow-xl transition-all duration-500 [transform-style:preserve-3d] ${
								item.selected ? '[transform:rotateY(180deg)]' : ''
							} ${
								gameStatus === 'busy'
									? 'pointer-events-none'
									: 'pointer-events-auto cursor-pointer'
							}`}
							onClick={onCardClick(index)}
						>
							<img
								src={item.imageUrl}
								className={`'aspect-square h-auto w-full object-cover`}
							/>
							{!item.found && (
								<div
									className={`absolute inset-0 bg-gradient-to-br from-cyan-500 to-pink-500 transition-all duration-500  [transform-style:preserve-3d] [backface-visibility:hidden] ${
										item.selected ? '[transform:rotateY(180deg)]' : ''
									} `}
								></div>
							)}
							{item.found && (
								<div className="absolute inset-0 border border-gray-200 bg-gray-100"></div>
							)}
						</div>
					))}
				</div>
			</div>
		</div>
	)
}

export default GameScreen
