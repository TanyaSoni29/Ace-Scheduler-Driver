/** @format */

const BASE = import.meta.env.VITE_BASE_URL;
import axios from 'axios';
import { formatDate } from './formatDate';
import { filterVias } from './filterVias';

function convertDateString(inputDateString) {
	// Parse the input date string
	const date = new Date(inputDateString);

	// Get the components of the date
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	const hours = String(date.getHours()).padStart(2, '0');
	const minutes = String(date.getMinutes()).padStart(2, '0');

	// Construct the output date string
	const outputDateString = `${year}-${month}-${day}T${hours}:${minutes}`;

	return outputDateString;
}

function filterData(data) {
	return JSON.stringify({
		details: data.details,
		email: data.email,
		durationText: Number(data.durationText) ? String(data.durationText) : '0',
		// durationMinutes: data.durationText ? +data.durationText : 0,
		durationMinutes: data.durationMinutes || 0,
		isAllDay: data.isAllDay,
		passengerName: data.passengerName,
		passengers: data.passengers,
		paymentStatus: data.paymentStatus || 0,
		scope: data.scope,
		phoneNumber: data.phoneNumber,
		pickupAddress: data.pickupAddress,
		pickupDateTime: data.pickupDateTime,
		pickupPostCode: data.pickupPostCode,
		destinationAddress: data.destinationAddress,
		destinationPostCode: data.destinationPostCode,
		recurrenceRule: data.recurrenceRule || null,
		recurrenceID: data.recurrenceID || null,
		price: data.price,
		priceAccount: data.priceAccount || 0,
		chargeFromBase: data.chargeFromBase || false,
		userId: data.userId || null,
		returnDateTime: data.returnDateTime || null,
		vias: filterVias(data),
		accountNumber: data.accountNumber,
		bookedByName: data.bookedByName || '',
		bookingId: data.bookingId || null,
		updatedByName: data.updatedByName || '',
		isASAP: data.isASAP || false,
		manuallyPriced: data.manuallyPriced || false,
		arriveBy: data.arriveBy || null,
		// actionByUserId: data.actionByUserId || null,
	});
}

function createDateObject(today = new Date()) {
	const fromDate =
		new Date(new Date(today).setHours(0, 0, 0, 0)).getTime() -
		24 * 60 * 60 * 1000;
	const formattedFrom = formatDate(new Date(fromDate));
	const formattedTo = formatDate(
		new Date(today).setHours(0, 0, 0, 0) + 24 * 60 * 60 * 1000
	);

	return {
		from: formattedFrom,
		to: formattedTo,
	};
}

function setHeaders() {
	const accessToken = localStorage.getItem('authToken');
	if (!accessToken) return {};
	return {
		'Accept': '*/*',
		'Authorization': `Bearer ${accessToken}`,
		'Content-Type': 'application/json',
		'Cache-Control': 'no-cache, no-store, must-revalidate',
		'Pragma': 'no-cache',
		'Expires': '0',
	};
}

// event handlers
// Event handlers
async function handleGetReq(URL) {
	try {
		// console.log(URL);
		const response = await axios.get(URL, { headers: setHeaders() });
		if (response.status >= 200 && response.status < 300) {
			return { ...response.data, status: 'success' };
		} else {
			console.log('Unexpected response status:', response);
			return null;
		}
	} catch (err) {
		// sendLogs({ url: URL, error: err.response }, 'error');
		console.error('Error in GET request:', err);
		return {
			...err.response,
			status: err.response.status > 499 ? 'error' : 'fail',
			message: `${
				err.response.status > 499 ? 'server error' : 'Failed'
			} while fetching the data`,
		};
	}
}

async function handlePostReq(URL, data) {
	try {
		const response = await axios.post(URL, data, {
			headers: setHeaders(),
		});

		if (response.status >= 200 && response.status < 300) {
			return { ...response.data, status: 'success' };
		} else {
			console.log('Unexpected response status:', response);
			return null;
		}
	} catch (err) {
		// sendLogs({ url: URL, error: err.response }, 'error');
		return {
			...err.response,
			status: err.response.status > 499 ? 'error' : 'fail',
			message: `${
				err.response.status > 499 ? 'server error' : 'Failed'
			} while fetching the data`,
		};
	}
}

const getBookingData = async function (date) {
	const accessToken = localStorage.getItem('authToken');
	if (!accessToken) return;

	const URL = `${BASE}/api/Bookings/DateRange`;
	const dataToSend = createDateObject(date);

	// Use handlePostReq function
	const response = await handlePostReq(URL, dataToSend);
	if (response) {
		// localStorage.setItem('bookings', JSON.stringify(response.bookings));
		return response;
	} else {
		console.log('Unexpected response:', response);
	}
};

async function getAllDrivers() {
	const URL = `${BASE}/api/UserProfile/ListUsers`;
	return await handleGetReq(URL);
}

async function completeBookings(completeBookingData) {
	const URL = `${BASE}/api/Bookings/Complete`;
	const res = await handlePostReq(URL, completeBookingData);
	if (res.status === 'success')
		// sendLogs(
		// 	{
		// 		url: URL,
		// 		requestBody: completeBookingData,
		// 		headers: setHeaders(),
		// 		response: res,
		// 	},
		// 	'info'
		// );

		return res;
}

async function driverArrived(bookingId) {
	const URL = `${BASE}/api/DriverApp/Arrived?bookingId=${Number(bookingId)}`;
	return await handleGetReq(URL);
}

export {
	convertDateString,
	filterData,
	createDateObject,
	setHeaders,
	handleGetReq,
	handlePostReq,
	getBookingData,
	completeBookings,
	driverArrived,
	getAllDrivers,
};
