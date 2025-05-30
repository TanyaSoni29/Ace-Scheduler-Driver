/** @format */

import AceScheduler from './page/Scheduler';
import { useEffect } from 'react';

function App() {
	useEffect(() => {
		const urlParams = new URLSearchParams(window.location.search);
		const token = urlParams.get('token');

		if (token) {
			localStorage.setItem('authToken', token);
		}
	}, []);
	return (
		<>
			<AceScheduler />
		</>
	);
}

export default App;
