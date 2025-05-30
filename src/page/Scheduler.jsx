/** @format */
import {
	ScheduleComponent,
	Day,
	Agenda,
	Inject,
	DragAndDrop,
} from '@syncfusion/ej2-react-schedule';
import { registerLicense } from '@syncfusion/ej2-base';
import './scheduler.css';
registerLicense(import.meta.env.VITE_SYNCFUSION_KEY);

import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// material ui imports

import { useMediaQuery } from '@mui/material';

// component imports
import {
	changeActiveDate,
	getRefreshedBookings,
	setActiveBookingIndex,
	// setActiveSearchResult,
	setDateControl,
} from '../slice/schedulerSlice';
import isLightColor from '../utils/isLight';
import Modal from '../components/Modal';
import CustomDialog from '../components/CustomDialog';
import Snackbar from '../components/Snackbar-v2';
import { getAllDrivers } from '../utils/apiReq';

const AceScheduler = () => {
	const isMobile = useMediaQuery('(max-width: 640px)');
	const isTablet = useMediaQuery('(min-width: 768px) and (max-width: 1023px)');

	// taking our global states from the redux
	const {
		bookings,
		activeDate,
		activeSearch,
		activeSearchResults,
		mergeMode,
		// loading: searchLoading,
	} = useSelector((state) => state.scheduler);

	// setting some states for the complenent level state management
	const [dialogOpen, setDialogOpen] = useState(false);
	const [selectedBookingData, setSelectedBookingData] = useState();
	const [driverData, setDriverData] = useState([]);
	const [draggedBooking, setDraggedBooking] = useState(null);
	const dispatch = useDispatch();
	// const user = useAuth();
	const scheduleRef = useRef(null);
	// data that syncfusion requires for inside computation of the internal mapping
	const fieldsData = {
		id: 'bookingId',
		subject: { name: 'cellText' },
		isAllDay: { name: 'isAllDay' },
		startTime: { name: 'pickupDateTime' },
		endTime: { name: 'endTime' },
		OwnerColor: { name: 'backgroundColorRGB' },
		// recurrenceRule: { name: 'recurrenceRule' },
		Readonly: { name: 'Readonly' },
	};

	// syncfusion handler function for each render of syncfusion element on the screen
	function onEventRendered(args) {
		if (!args || !args.element || !args.element.classList) {
			console.warn('Skipping event rendering due to missing element:', args);
			return; // Prevents modifying null elements
		}

		args.element;
		let driverColor = '#795548'; // Default color if both suggestedUserId and userId are null

		if (args?.data?.suggestedUserId && !args?.data?.userId) {
			// If there's a suggestedUserId, use the suggested driver's color
			const suggestedDriver = driverData.find(
				(driver) => driver.id === args.data.suggestedUserId
			);
			if (suggestedDriver) {
				driverColor = suggestedDriver.colorRGB;
			}
		} else if (args?.data?.userId) {
			// If suggestedUserId is null but userId exists, use the user's color
			driverColor = args.data.backgroundColorRGB;
		}

		// Apply gradient based on activeSoftAllocate status
		if (args?.data?.suggestedUserId && !args?.data?.userId) {
			// Use a dot-pattern gradient for soft allocation
			args.element.style.backgroundImage = `
    radial-gradient(${driverColor} 40%, transparent 40%),
    radial-gradient(${driverColor} 40%, transparent 40%)`;

			// Adjust the background size to reflect larger dots and manage spacing
			args.element.style.backgroundSize = '20px 20px'; // Increase size to make dots larger
			args.element.style.backgroundPosition = '0 0, 10px 10px';
			args.element.style.backgroundColor = '#795548';

			const subjectElement = args?.element?.querySelector('.e-subject');
			if (subjectElement) {
				subjectElement.style.display = 'inline-block'; // Ensure it only takes the width of the text
				subjectElement.style.padding = '0 4px'; // Add a little padding if needed
				subjectElement.style.backgroundColor = driverColor; // Optional background for clarity
				subjectElement.style.borderRadius = '4px'; // Round the edges for a badge-like appearance
				subjectElement.style.maxWidth = 'fit-content'; // Ensure it wraps to the text width
				// subjectElement.style.overflow = 'hidden'; // Hide overflow if text exceeds width
				subjectElement.style.whiteSpace = 'wrap'; // Prevent wrapping to new lines
			}
			const timeElement = args?.element?.querySelector('.e-time');
			if (timeElement) {
				timeElement.style.display = 'block';
				timeElement.style.backgroundColor = driverColor;
				timeElement.style.padding = '0 4px'; // Add a little padding if needed
				timeElement.style.borderRadius = '4px';
				timeElement.style.maxWidth = 'fit-content'; // Ensure it wraps to the text width
				// subjectElement.style.overflow = 'hidden'; // Hide overflow if text exceeds width
				timeElement.style.whiteSpace = 'wrap';
			}

			// const subjectElement = args.element.querySelector('.e-subject');

			// // Create the badge element

			// // Append the badge next to the subject text
		} else if (args.data.userId && args.data.status === 1) {
			// Use a -40-degree gradient for normal allocation
			args.element.style.background = `repeating-linear-gradient(-40deg, ${driverColor}, ${driverColor} 10px, rgb(187, 187, 187) 20px)`;
			args.element.style.backgroundColor = driverColor;
		} else {
			// No gradient, just set the color
			args.element.style.backgroundColor = driverColor;
		}

		// Apply the driver color as the background color for fallback cases
		args.element.style.borderRadius = '10px';

		const createBadge = (text, bgColor) => {
			const badge = document.createElement('span');
			badge.textContent = text;
			badge.style.backgroundColor = bgColor;

			badge.style.color = isLightColor(bgColor) ? 'black' : 'white';
			// badge.style.padding = '0px 5px';
			badge.style.padding = '2px 5px';
			badge.style.marginLeft = '5px';
			badge.style.border = `1px solid ${
				isLightColor(bgColor) ? 'black' : 'white'
			}`;
			// badge.style.borderRadius = '50%';
			badge.style.borderRadius = '12px';

			badge.style.fontSize = '12px';
			badge.style.fontWeight = 'bold';
			badge.style.display = 'inline';
			badge.style.whiteSpace = 'wrap';

			return badge;
		};
		const subjectElement = args?.element?.querySelector('.e-subject');
		const parentNode = subjectElement.parentNode;

		if (args?.data?.scope === 4) {
			const badgeColor =
				args.data?.paymentStatus === 0
					? 'red'
					: args?.data?.paymentStatus === 2
					? 'green'
					: args.data?.paymentStatus === 3
					? 'orange'
					: '';
			const cardBadge = createBadge('Card', badgeColor);
			parentNode.insertBefore(cardBadge, subjectElement);
			// - ${
			// 	args?.data?.paymentStatus === 0
			// 		? 'Unpaid'
			// 		: args?.data?.paymentStatus === 2
			// 		? 'Paid'
			// 		: args?.data?.paymentStatus === 3
			// 		? 'Unpaid'
			// 		: ''
			// }
			// `;

			// subjectElement.appendChild(badge);
		}
		if (args?.data?.isASAP) {
			// const asapBadge = createBadge('ASAP', '#228B22');
			// parentNode.insertBefore(asapBadge, subjectElement);
			args.element.style.border = '3px dashed #228B22';
		}
		if (isLightColor(driverColor)) {
			if (args?.element?.querySelector('.e-subject'))
				args.element.querySelector('.e-subject').style.color = 'black';
			if (args?.element?.querySelector('.e-time'))
				args.element.querySelector('.e-time').style.color = 'black';
			if (args?.element?.querySelector('.e-date-time'))
				args.element.querySelector('.e-date-time').style.color = 'black';
			if (args?.element?.querySelector('.e-icons'))
				args.element.querySelector('.e-icons').style.color = 'black';
		} else {
			if (args?.element?.querySelector('.e-subject'))
				args.element.querySelector('.e-subject').style.color = 'white';
			if (args?.element?.querySelector('.e-time'))
				args.element.querySelector('.e-time').style.color = 'white';
			if (args?.element?.querySelector('.e-date-time'))
				args.element.querySelector('.e-date-time').style.color = 'white';
			if (args?.element?.querySelector('.e-icons'))
				args.element.querySelector('.e-icons').style.color = 'white';
		}

		if (mergeMode) {
			args.element.style.cursor = 'move';

			// Highlight if this is the dragged booking
			if (draggedBooking && args.data.bookingId === draggedBooking.bookingId) {
				args.element.style.opacity = '0.5';
			} else {
				args.element.style.opacity = '1';
			}
		} else {
			args.element.style.cursor = 'default';
			args.element.style.opacity = '1';
		}
	}

	// refresh the booking when activeTestMode, currentDate, dispatch, activeComplete changes
	useEffect(() => {
		async function helper() {
			dispatch(getRefreshedBookings());
			getAllDrivers().then((res) => {
				const driverUsers = [
					{ id: 0, fullName: 'Unallocated', colorRGB: '#795548' },
					...res.users,
				];
				setDriverData(driverUsers);
			});
		}
		helper();
	}, [activeDate, dispatch]);
	// }, [activeTestMode, activeDate, dispatch, activeComplete]);
	// refresh the booking every 10000 (10 sec)
	useEffect(() => {
		async function helper() {
			dispatch(getRefreshedBookings());
		}
		const refreshInterval = setInterval(helper, 10000);
		return () => clearInterval(refreshInterval);
	}, [dispatch]);

	// useEffect(() => {
	// 	dispatch(setActionLogsOpen(false));
	// }, [dispatch]);

	const eventSettings = {
		dataSource: activeSearch ? activeSearchResults || [] : bookings || [],
		fields: fieldsData,
		allowAdding: false,
		allowEditing: false,
		allowDeleting: false,
		recurrenceMode: 'Occurrence',
	};

	// handler funciton for each booking click
	const onEventClick = async (args) => {
		if (activeSearch) {
			// dispatch(setActiveSearchResult(args.event.bookingId, activeTestMode));
			// dispatch(setActiveSearchResult(args?.event?.bookingId));
		} else {
			setSelectedBookingData(args?.event);
			dispatch(setActiveBookingIndex(args?.event?.bookingId));
		}
		setDialogOpen(true);
	};

	// const createBookingOnTimeStamp = function (args) {
	// 	dispatch(createBookingFromScheduler(args?.startTime));
	// };

	// Create a ref for ScheduleComponent
	const onCreate = () => {
		const scheduleObj = scheduleRef.current;
		if (scheduleObj) {
			// Get current time and go 1 hour back
			const currentTime = new Date();
			currentTime.setHours(currentTime.getHours() - 2);

			// Get the local time string
			const hours = currentTime.getHours();
			const minutes = currentTime.getMinutes();

			// Format the time to HH:mm (adding leading zero if needed)
			const formattedTime = `${hours}:${
				minutes < 10 ? '0' + minutes : minutes
			}`;

			// console.log(formattedTime); // This should log the correct time in local format

			// Scroll to the formatted time
			scheduleObj.scrollTo(formattedTime);
		}
	};

	// Effect to trigger scroll on initial load (or whenever necessary)
	useEffect(() => {
		onCreate(); // Call onCreate to scroll when the component mounts
	}, []);

	function toLocalISODateOnly(date) {
		const year = date?.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, '0'); // Ensure 2-digit format
		const day = String(date.getDate()).padStart(2, '0');

		return `${year}-${month}-${day}`;
	}

	// console.log('active Date in Scheduler----', activeDate);
	return (
		<>
			<Snackbar />
			{/* {searchLoading && <Loader />} */}

			<ScheduleComponent
				ref={scheduleRef}
				firstDayOfWeek={1}
				height={isMobile || isTablet ? window.innerHeight : window.innerHeight}
				currentView={activeSearch ? 'Agenda' : 'Day'}
				selectedDate={activeDate}
				navigating={(args) => {
					const isoDateOnly = toLocalISODateOnly(new Date(args.currentDate));
					dispatch(setDateControl(isoDateOnly));
					dispatch(changeActiveDate(isoDateOnly));
				}}
				eventSettings={eventSettings}
				eventRendered={onEventRendered}
				eventClick={onEventClick}
				// cellClick={createBookingOnTimeStamp}
				editorTemplate={null}
				popupOpen={(args) => (args.cancel = true)}
				className='schedule-cell-dimension'
				views={[
					{ option: 'Day' },
					{
						option: 'Agenda',
						allowVirtualScrolling: activeSearch ? true : false,
						interval: 1,
					},
				]}
				// allowDragAndDrop={mergeMode}
				// dragStart={(args) => {
				// 	if (mergeMode && args.event) {
				// 		console.log('Drag Start:', args.data.bookingId);
				// 		setDraggedBooking(args.data.bookingId);
				// 	}
				// }}
				// dragStop={async (args) => {
				// 	if (mergeMode && draggedBooking) {
				// 		try {
				// 			const scheduler = scheduleRef.current;
				// 			const mouseEvent = args.event?.event;

				// 			// 1. SAFE COORDINATE CHECK
				// 			if (!mouseEvent || !Number.isFinite(mouseEvent.clientX)) {
				// 				console.error('Invalid mouse event');
				// 				return;
				// 			}

				// 			// 2. TRY SCHEDULER API FIRST (Most reliable)
				// 			let targetBooking;
				// 			if (scheduler?.getEventDetails) {
				// 				const eventData = scheduler.getEventDetails(mouseEvent.target);
				// 				targetBooking = eventData?.bookingId || eventData?.Id;
				// 			}

				// 			// 3. DOM FALLBACK (With proper element checking)
				// 			if (!targetBooking) {
				// 				const elements = document.elementsFromPoint(
				// 					mouseEvent.clientX,
				// 					mouseEvent.clientY
				// 				);

				// 				const targetElement = elements.find((el) =>
				// 					el?.classList?.contains('e-appointment')
				// 				);

				// 				// SAFE ATTRIBUTE ACCESS
				// 				const targetBookingElement = targetElement?.hasAttribute?.(
				// 					'data-id'
				// 				)
				// 					? targetElement.getAttribute('data-id')
				// 					: targetElement?.dataset?.bookingId;
				// 				targetBooking = targetBookingElement?.split('_')[1];
				// 			}

				// 			// 4. EXECUTE MERGE
				// 			if (targetBooking && targetBooking !== draggedBooking) {
				// 				const response = await dispatch(
				// 					mergeTwoBookings(targetBooking, draggedBooking)
				// 				);
				// 				if (response.status === 'fail') {
				// 					dispatch(openSnackbar(response.data, 'error'));
				// 				} else {
				// 					dispatch(
				// 						openSnackbar('Booking Merge Successfully!', 'success')
				// 					);
				// 				}
				// 			}
				// 		} catch (error) {
				// 			console.error('Drag stop error:', error);
				// 		} finally {
				// 			setDraggedBooking(null);
				// 			if (args) args.cancel = true;
				// 		}
				// 	}
				// }}

				// agendaDaysCount={365}
			>
				{dialogOpen && (
					<Modal
						open={dialogOpen}
						setOpen={setDialogOpen}
					>
						<CustomDialog closeDialog={() => setDialogOpen(false)} />
					</Modal>
				)}
				<Inject services={[Day, Agenda, DragAndDrop]} />
			</ScheduleComponent>

			{/* <div className='flex justify-end w-[10%] fixed top-[110px] right-[180px] sm:top-[125px] sm:right-[550px] z-[40]'>
				{(!isMobile || user?.currentUser?.roleId !== 3) && !activeSearch && (
					<button
						className='select-none whitespace-nowrap text-xs sm:text-sm uppercase font-normal rounded-lg bg-blue-700 text-white hover:bg-opacity-80 px-3 py-2'
						onClick={() => setConfirmSoftModal(true)}
					>
						{isMobile ? <NoCrashOutlinedIcon fontSize='small' /> : 'Confirm SA'}
					</button>
				)}
			</div> */}

			{/* <div className='hidden sm:flex sm:justify-end w-[10%] fixed top-[80px] right-[0px] sm:top-[160px] sm:right-[0px] z-[40]'>
				{(!isMobile || user?.currentUser?.roleId !== 3) && !activeSearch && (
					<span className='flex flex-row gap-2 items-center align-middle'>
						<span className='select-none whitespace-nowrap text-xs sm:text-sm uppercase font-normal'>
							Merge Mode
						</span>
						<Switch
							checked={mergeMode}
							onChange={() => {
								dispatch(setMergeMode(!mergeMode));
							}}
							className='text-sm'
						/>
					</span>
				)}
			</div> */}

			{/* <div className='flex justify-end w-[10%] fixed top-[100px] right-[0px] sm:top-[125px] sm:right-[350px] z-[40]'>
				{(!isMobile || user?.currentUser?.roleId !== 3) && !activeSearch && (
					<span className='flex flex-row gap-2 items-center align-middle'>
						<span className='select-none whitespace-nowrap text-xs sm:text-sm uppercase font-normal'>
							Show Allocated
						</span>
						<Switch
							checked={activeAllocate}
							onChange={() => {
								dispatch(allocateActiveBookingStatus(!activeAllocate));
							}}
							className='text-sm'
						/>
					</span>
				)}
			</div> */}
			{/* Changed by Tanya - (9 Aug) */}
			{/* <div className='flex justify-end w-[10%] fixed top-[120px] right-[0px] sm:top-[125px] sm:right-[160px] z-[40]'>
				{(!isMobile || user?.currentUser?.roleId !== 3) && !activeSearch && (
					<span className='flex flex-row gap-2 items-center align-middle'>
						<span className='select-none whitespace-nowrap text-xs sm:text-sm uppercase font-normal'>
							Show Completed
						</span>
						<Switch
							checked={activeComplete}
							onChange={() => {
								dispatch(completeActiveBookingStatus(!activeComplete));
							}}
							className='text-sm'
						/>
					</span>
				)}
			</div> */}

			{/* {confirmSoftModal && (
				<Modal
					open={confirmSoftModal}
					setOpen={setConfirmSoftModal}
				>
					<ConfirmSoftAllocateModal setConfirmSoftModal={setConfirmSoftModal} />
				</Modal>
			)} */}
		</>
	);
};
export default AceScheduler;
