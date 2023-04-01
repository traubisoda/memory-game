import { useAppDispatch, useAppSelector } from '@/store/hooks'
import reactLogo from '@/assets/react.svg'
import PlayersForm from '@/components/players-form/PlayersForm'
import { selectError, startGame } from '@/store/features/app/app.slice'

const GameMenu = () => {
	const dispatch = useAppDispatch()
	const error = useAppSelector(selectError)
	const onStartClick = () => {
		dispatch(startGame())
	}

	return (
		<div>
			Menu
			<img src={reactLogo} width={50} height={50} />
			<PlayersForm />
			<button onClick={onStartClick} role="button">
				Start game
			</button>
			{error && <div className="text-red-400">{error}</div>}
		</div>
	)
}

export default GameMenu
