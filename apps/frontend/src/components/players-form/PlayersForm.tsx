import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { addPlayer, selectPlayers } from '@/store/features/players/players.slice'

const PlayersForm = () => {
	const dispatch = useAppDispatch()
	const players = useAppSelector(selectPlayers)
	const error = useAppSelector(state => state.players.error)
	const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		const form = e.target as HTMLFormElement
		const input = form.elements.namedItem('name') as HTMLInputElement
		if (!input) return

		dispatch(addPlayer(input.value))
		input.value = ''
	}

	return (
		<div className="w-20">
			<div role="player-list">
				{players.map((player, index) => (
					<div key={index}>
						<div>{ player.name }</div>
					</div>
				))}
			</div>
			<div>
				<form onSubmit={submitHandler}>
					<input type='text' name='name' className="p-1 border-2 border-blue-400 rounded" role="textbox" />
					{ error && <div className="text-red-400">{ error }</div> }
					<button>Add player</button>
				</form>
			</div>
		</div>
	)
}

export default PlayersForm
