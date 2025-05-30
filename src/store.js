/** @format */
import { configureStore } from '@reduxjs/toolkit';

import snackbarReducer from './slice/snackbarSlice';
import schedulerReducer from './slice/schedulerSlice';

const store = configureStore({
	reducer: {
		snackbar: snackbarReducer,
		scheduler: schedulerReducer,
	},
});

export default store;
