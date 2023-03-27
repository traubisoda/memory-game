import './App.css'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { increment, selectCount } from '@/store/features/counter/counter.slice'

function App() {
	const count = useAppSelector(selectCount)
	const dispatch = useAppDispatch()

	return (
		<div className="App">
			<div>
				<h1 className="font-lg text-blue-400">Tailwind</h1>
			</div>
			<h1>Vite + React</h1>
			<div className="card">
				<button onClick={() => dispatch(increment())}>count is {count}</button>
				<p>
					Edit <code>src/App.tsx</code> and save to test HMR
				</p>
			</div>
			<p className="read-the-docs">
				Click on the Vite and React logos to learn more
			</p>
		</div>
	)
}

export default App
