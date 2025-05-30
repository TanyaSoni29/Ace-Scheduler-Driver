/** @format */

import { useParams } from 'react-router-dom';
import AceScheduler from './page/Scheduler';

function App() {
	const { token } = useParams();
	if (token) localStorage.setItem('token', token);
	return (
		<>
			<AceScheduler />
		</>
	);
}

export default App;
