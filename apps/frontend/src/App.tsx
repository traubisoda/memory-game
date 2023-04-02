import { useAppSelector } from '@/store/hooks'
import { selectGameStatus } from '@/store/features/app/app.slice'
import GameMenu from '@/components/game-menu/GameMenu'
import GameScreen from '@/components/game-screen/GameScreen'

function App() {
	const gameStatus = useAppSelector(selectGameStatus)
	let component

	switch (gameStatus) {
		case 'menu':
			component = <GameMenu />
			break
		case 'playing':
			component = <GameScreen />
			break
		default:
			component = <GameMenu />
	}

	return <div className="App">{component}</div>
}

export default App
