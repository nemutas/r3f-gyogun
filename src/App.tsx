import React, { VFC } from 'react';
import { TCanvas } from './three/TCanvas';

export const App: VFC = () => {
	return (
		<div style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
			<TCanvas />
		</div>
	)
}
