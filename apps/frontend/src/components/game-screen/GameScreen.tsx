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
import Card from '@/components/card/Card'

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
		if (gameStatus === 'uninitialized') {
			dispatch(initializeGame())
		}
	}, [])

	if (gameStatus === 'initializing') {
		return <div>Initializing...</div>
	}

	return (
		<div data-testid="game-screen">
			<div>{activePlayer.name}'s turn</div>
			<div className="flex">
				<div className="w-1/3" data-testid="scoreboard">
					{scoreBoard.map((item) => (
						<div key={item.player.id}>
							{item.player.name}: {item.score}
						</div>
					))}
				</div>
				<div className="grid grid-cols-6 gap-2 p-2">
					{board.map((item: Card, index: number) => (
						<Card
							key={index}
							data-testid={`card-${index}`}
							cardItem={item}
							disabled={gameStatus === 'busy' || item.found}
							onClick={onCardClick(index)}
						/>
					))}
				</div>
			</div>
		</div>
	)
}

export default GameScreen
