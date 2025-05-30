/** @format */

import { createSlice } from '@reduxjs/toolkit';
import {
	getBookingData,
	completeBookings,
} from '../utils/apiReq';
import { formatDate } from '../utils/formatDate';

const isMobile = window.innerWidth <= 640;

// const filterScheduledBookings = function (booking) {
// 	return {
// 		bookingId: booking.bookingId,
// 		bookingTime: booking.bookingTime,
// 		pickupDateTime: booking.pickupDate,
// 		endTime: booking.endDate || booking.pickupDate,
// 		backgroundColorRGB: booking.color,
// 		subject: booking.cellText,
// 		...booking,
// 	};
// };

const schedulerSlice = createSlice({
	name: 'scheduler',
	initialState: {
		bookings: [],
		loading: false,
		currentlySelectedBookingIndex: -1,
		selectedDriver: null,
		activeDate: new Date().toISOString(),
		activeComplete: isMobile ? true : true,
		activeAllocate: true,
		activeSearch: false,
		activeSoftAllocate: false,
		activeSearchResults: [],
		activeSearchResult: null,
		showDriverAvailability: false,
		searchkeywords: {},
		dateControl: formatDate(new Date().toISOString()),
		actionLogsOpen: false,
		mergeMode: false,
	},
	reducers: {
		insertBookings: (state, action) => {
			state.bookings = action.payload;
		},
		removeBooking: (state, action) => {
			state.bookings.splice(action.payload, 1);
		},
		completeActiveBookingStatus: (state, action) => {
			state.activeComplete = action.payload;
		},
		allocateActiveBookingStatus: (state, action) => {
			state.activeAllocate = action.payload;
		},
		changeActiveDate: (state, action) => {
			state.activeDate = new Date(action.payload).toISOString();
		},
		setDateControl: (state, action) => {
			state.dateControl = new Date(action.payload).toISOString();
		},
		selectBookingFromScheduler: (state, action) => {
			state.currentlySelectedBookingIndex = action.payload;
		},
		selectDriver: (state, action) => {
			state.selectedDriver = action.payload;
		},
		setActiveBookingIndex: (state, action) => {
			state.bookings.forEach((booking, index) => {
				if (booking.bookingId === action.payload) {
					state.currentlySelectedBookingIndex = index;
					return;
				}
			});
		},
		makeSearchActive: (state, action) => {
			state.activeSearch = true;
			state.activeSearchResults = action.payload;
		},
		makeSearchInactive: (state) => {
			state.loading = true;
			state.activeSearch = false;
			state.activeSearchResults = [];
			state.loading = false;
		},
		setActiveSearchResultClicked: (state, action) => {
			state.activeSearchResult = action.payload;
		},
		changeShowDriverAvailability: (state, action) => {
			state.showDriverAvailability = action.payload;
		},
		updateBookingAtIndex: (state, action) => {
			state.bookings.forEach((booking, index) => {
				if (booking.bookingId === action.payload.bookingId) {
					state.bookings[index] = action.payload;
					return;
				}
			});
		},
		setLoading: (state, action) => {
			state.loading = action.payload;
		},
		setActiveSoftAllocate: (state, action) => {
			state.activeSoftAllocate = action.payload;
		},
		setSearchKeywords: (state, action) => {
			state.searchkeywords = action.payload;
		},
		setActionLogsOpen: (state, action) => {
			state.actionLogsOpen = action.payload;
		},
		setMergeMode: (state, action) => {
			state.mergeMode = action.payload;
		},
	},
});

export function getRefreshedBookings() {
	return async (dispatch, getState) => {
		// const activeTestMode = getState().bookingForm.isActiveTestMode;
		const { activeDate, activeComplete, activeAllocate } = getState().scheduler;

		// const response = await getBookingData(activeDate, activeTestMode);
		const response = await getBookingData(activeDate);

		if (response.status === 'success') {
			let filteredBookings = [];
			if (activeComplete && activeAllocate) {
				// Case 1: Show all bookings
				filteredBookings = response.bookings;
			} else if (activeComplete && !activeAllocate) {
				// Case 2: Show all bookings except those that have a userId
				filteredBookings = response.bookings.filter(
					(booking) => !booking?.userId
				);
			} else if (!activeComplete && activeAllocate) {
				// Case 3: Show all bookings except those with status === 3
				filteredBookings = response.bookings.filter(
					(booking) => booking.status !== 3
				);
			} else if (!activeComplete && !activeAllocate) {
				// Case 4: Show bookings that have status !== 3 and no userId
				filteredBookings = response.bookings.filter(
					(booking) => booking.status !== 3 && !booking?.userId
				);
			}
			// console.log('Filtered Bookings:', filteredBookings);

			dispatch(schedulerSlice.actions.insertBookings(filteredBookings));
		}
		return response;
	};
}


export function handleCompleteBooking({
	waitingTime,
	parkingCharge,
	priceAccount,
	driverPrice,
}) {
	return async (dispatch, getState) => {
		const {
			bookings,
			currentlySelectedBookingIndex: index,
			activeSearch,
			activeSearchResult,
		} = getState().scheduler;
		// const activeTestMode = getState().bookingForm.isActiveTestMode;
		const bookingId = activeSearch
			? activeSearchResult.bookingId
			: bookings[index].bookingId;

		const response = await completeBookings(
			{
				bookingId,
				waitingTime,
				parkingCharge,
				priceAccount,
				driverPrice,
			}
			// activeTestMode
		);

		if (response === 'success') {
			dispatch(getRefreshedBookings());
		}
		return response;
	};
}

export const {
	completeActiveBookingStatus,
	allocateActiveBookingStatus,
	setDateControl,
	changeActiveDate,
	setActiveBookingIndex,
	selectDriver,
	makeSearchInactive,
	changeShowDriverAvailability,
	updateBookingAtIndex,
	setActiveSearchResultClicked,
	setActiveSoftAllocate,
	setSearchKeywords,
	setActionLogsOpen,
	setMergeMode,
} = schedulerSlice.actions;

export default schedulerSlice.reducer;
