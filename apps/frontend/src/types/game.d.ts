type Player = {
	id: string
	name: string
}

type ScoreBoard = Record<(typeof Player)['id'], number>

type Card = {
	id: string
	found: boolean
	selected: boolean
	imageUrl: string
}
