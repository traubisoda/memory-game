import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { selectGameStatus, startGame } from '@/store/features/app/app.slice'
import reactLogo from './assets/react.svg'
import PlayersForm from '@/components/players-form/PlayersForm'

const Menu = () => {
	const dispatch = useAppDispatch()

	return (
		<div>
			Menu
			<img src={reactLogo} width={50} height={50} />
			<PlayersForm />
			<button onClick={() => dispatch(startGame())}>Start game</button>
		</div>
	)
}
const Game = () => <div>Game</div>
function App() {
	const gameStatus = useAppSelector(selectGameStatus)
	let component;

	switch (gameStatus) {
		case 'menu':
			component = <Menu />
			break
		case 'playing':
			component = <Game />
			break
		default:
			component = <Menu />
	}

	return (
		<div className="App">{ component }</div>
	)
}

export default App
