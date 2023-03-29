import { useAppSelector } from '@/store/hooks'
import { selectGameStatus } from '@/store/features/app/app.slice'
import GameMenu from '@/components/game-menu/GameMenu'


const Game = () => <div>Game</div>
function App() {
	const gameStatus = useAppSelector(selectGameStatus)
	let component;

	switch (gameStatus) {
		case 'menu':
			component = <GameMenu />
			break
		case 'playing':
			component = <Game />
			break
		default:
			component = <GameMenu />
	}

	return (
		<div className="App">{ component }</div>
	)
}

export default App
