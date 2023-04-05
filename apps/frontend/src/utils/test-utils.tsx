import React, { FC, PropsWithChildren, ReactElement } from 'react'
import type { RenderOptions } from '@testing-library/react'
import { render } from '@testing-library/react'
import type { PreloadedState } from '@reduxjs/toolkit'
import { configureStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'

import type { AppStore, RootState } from '@/store/store'
// As a basic setup, import your same slice reducers
import appReducer from '@/store/features/app/app.slice'
import gameReducer from '@/store/features/game/game.slice'
import * as fs from 'fs'

// This type interface extends the default options for render from RTL, as well
// as allows the user to specify other things such as initialState, store.
interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
	preloadedState?: PreloadedState<RootState>
	store?: AppStore
}

const wrapper: FC<{ children: React.ReactNode }> = ({ children }) => {
	return <>{children}</>
}

const customRender = (
	ui: ReactElement,
	options?: Omit<RenderOptions, 'wrapper'>
) => {
	const view = render(ui, { wrapper, ...options })

	const style = document.createElement('style')
	style.innerHTML = fs.readFileSync('.vitest/index.css', 'utf8')
	document.head.appendChild(style)

	return view
}

export { customRender as render }

export function renderWithProviders(
	ui: React.ReactElement,
	{
		preloadedState = {},
		// Automatically create a store instance if no store was passed in
		store = configureStore({
			reducer: {
				app: appReducer,
				game: gameReducer,
			},
			preloadedState,
		}),
		...renderOptions
	}: ExtendedRenderOptions = {}
) {
	function Wrapper({ children }: PropsWithChildren<{}>): JSX.Element {
		return <Provider store={store}>{children}</Provider>
	}
	return { store, ...customRender(ui, { wrapper: Wrapper, ...renderOptions }) }
}
