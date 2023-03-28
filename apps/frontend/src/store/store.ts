import { combineReducers, configureStore, PreloadedState } from '@reduxjs/toolkit'
import appReducer from '@/store/features/app/app.slice'
import playersReducer from '@/store/features/players/players.slice'

const rootReducer = combineReducers({
	app: appReducer,
	players: playersReducer,
})
export function setupStore(preloadedState?: PreloadedState<RootState>) {
	return configureStore({
		reducer: rootReducer,
		preloadedState,
	})
}

export type RootState = ReturnType<typeof rootReducer>
export type AppStore = ReturnType<typeof setupStore>
export type AppDispatch = AppStore['dispatch']
