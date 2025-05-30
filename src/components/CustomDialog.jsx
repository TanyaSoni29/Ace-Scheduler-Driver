/** @format */
import { useDispatch, useSelector } from 'react-redux';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import HomeIcon from '@mui/icons-material/Home';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import CurrencyPoundIcon from '@mui/icons-material/CurrencyPound';
import StarIcon from '@mui/icons-material/Star';
import Modal from './Modal';
import CompleteBookingModal from './CustomDialogButton/CompleteBookingModal';

import {
	getRefreshedBookings,
	setActiveSearchResultClicked,
} from '../slice/schedulerSlice';
import { driverArrived } from '../utils/apiReq';
import { openSnackbar } from '../slice/snackbarSlice';
import { useState } from 'react';

function CustomDialog({ closeDialog }) {
	const dispatch = useDispatch();
	const {
		bookings,
		currentlySelectedBookingIndex: index,
		activeSearch,
		activeSearchResult,
		actionLogsOpen,
	} = useSelector((state) => state.scheduler);
	const [isCompleteBookingModal, setIsCompleteBookingModal] = useState(false);
	// const user = useAuth();
	// console.log(user);
	let data = {};

	if (activeSearch || actionLogsOpen) {
		data = activeSearchResult;
	} else {
		data = bookings[index];
	}

	if (!data?.bookingId) return null;

	// console.log('Booking form data in view Booking form', data);

	// const handleCancelOnArrival = () => {
	// 	dispatch(
	// 		deleteSchedulerBooking(
	// 			false,
	// 			user.currentUser.fullName,
	// 			user.currentUser.id,
	// 			true
	// 		)
	// 	);
	// 	closeDialog();
	// };

	// const handlePayClick = async (selectedOptions) => {
	// 	try {
	// 		const { textMessage, email, both } = selectedOptions;
	// 		const payload = {
	// 			bookingId: data.bookingId,
	// 			name: data.passengerName,
	// 			price: data.price,
	// 			pickup: data.pickupAddress,
	// 		};
	// 		if (textMessage || both) {
	// 			payload.telephone = data.phoneNumber;
	// 		} else {
	// 			payload.telephone = ''; // Leave blank if textMessage is false
	// 		}

	// 		if (email || both) {
	// 			payload.email = data.email;
	// 		} else {
	// 			payload.email = ''; // Leave blank if email is false
	// 		}
	// 		const result = await sendPaymentLink(payload);
	// 		dispatch(getRefreshedBookings());

	// 		if (result.status === 'success') {
	// 			dispatch(openSnackbar('Payment link sent', 'success'));
	// 		}
	// 	} catch (error) {
	// 		console.error('Payment error:', error);
	// 	}
	// };

	// const handleRefundClick = async () => {
	// 	try {
	// 		const payload = {
	// 			bookingId: data.bookingId,
	// 			price: data.price,
	// 		};
	// 		const response = await sendRefundLink(payload);
	// 		if (response.status === 'success') {
	// 			dispatch(openSnackbar('Refund Request sent', 'success'));
	// 			dispatch(getRefreshedBookings());
	// 		}
	// 	} catch (error) {
	// 		dispatch(openSnackbar('Error in Sending Request', 'error'));
	// 		console.error('Refund error:', error);
	// 	}
	// };

	const handleDriverArrived = async () => {
		try {
			const bookingId = data.bookingId;
			const response = await driverArrived(bookingId);
			if (response.status === 'success') {
				dispatch(openSnackbar('Driver Arrived Successfully', 'success'));
				closeDialog();
				dispatch(getRefreshedBookings());
			}
		} catch (error) {
			console.error('Driver arrived error:', error);
		}
	};

	// const handleSendConfirmationText = async () => {
	// 	try {
	// 		const reqData = {
	// 			phone: data?.phoneNumber,
	// 			date: data?.pickupDateTime?.split('T')[0],
	// 			bookingId: data.bookingId,
	// 		};
	// 		const response = await sendConfirmationText(reqData);
	// 		if (response.status === 'success') {
	// 			dispatch(openSnackbar('Sent Successfully', 'success'));
	// 			dispatch(getRefreshedBookings());
	// 		}
	// 	} catch (error) {
	// 		console.error('Sending confirmation text error:', error);
	// 	}
	// };

	// const handleReminderButton = async () => {
	// 	try {
	// 		const reqData = {
	// 			phone: data?.phoneNumber,
	// 			bookingId: data.bookingId,
	// 		};
	// 		const response = await sendReminderForPayment(reqData);
	// 		if (response.status === 'success') {
	// 			dispatch(openSnackbar('Reminder send Successfully', 'success'));
	// 			dispatch(getRefreshedBookings());
	// 		}
	// 	} catch (error) {
	// 		console.error('Sending Reminder error:', error);
	// 	}
	// };

	// const generateRouteLink = () => {
	// 	const origin = `${data.pickupAddress}, ${data.pickupPostCode}`;
	// 	const destination = `${data.destinationAddress}, ${data.destinationPostCode}`;
	// 	const waypoints = data.vias
	// 		.map((via) => `${via.address}, ${via.postCode}`)
	// 		.join('|');

	// 	return `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(
	// 		origin
	// 	)}&destination=${encodeURIComponent(
	// 		destination
	// 	)}&waypoints=${encodeURIComponent(
	// 		waypoints
	// 	)}&travelmode=driving&dir_action=navigate`;
	// };

	// const sendPaymentReceipt = async () => {
	// 	try {
	// 		const response = await sendPayReceipt(data.bookingId);
	// 		if (response.status === 'success') {
	// 			dispatch(openSnackbar('Payment Receipt Sent', 'success'));
	// 			dispatch(getRefreshedBookings());
	// 		}
	// 	} catch (error) {
	// 		console.log(error);
	// 		dispatch(openSnackbar('Error in Sending Pay Receipt', 'error'));
	// 	}
	// };

	// const handleCOAEntry = async (pickupAddress, passengerName) => {
	// 	try {
	// 		const payload = {
	// 			accno: data.accountNumber,
	// 			journeyDate: data?.pickupDateTime,
	// 			passengerName: passengerName,
	// 			pickupAddress: pickupAddress,
	// 		};
	// 		const response = await createCOAEntry(payload);
	// 		if (response.status === 'success') {
	// 			dispatch(openSnackbar('COA Entry Created Successfully!', 'success'));
	// 		} else {
	// 			dispatch(openSnackbar('Failed To Create COA Entry', 'error'));
	// 		}
	// 	} catch (error) {
	// 		console.log(error);
	// 	}
	// };

	return (
		<div className='fixed sm:left-[-35vw] left-[-45vw] inset-0 w-[90vw] sm:w-[70vw] mx-auto z-50 flex items-center justify-center p-1 sm:p-4 bg-background bg-opacity-50'>
			<div className='relative w-full max-w-7xl p-3 sm:p-6 bg-card rounded-lg shadow-lg dark:bg-popover bg-white max-h-[90vh] overflow-y-auto sm:overflow-hidden'>
				<div className='flex items-center justify-between mb-6'>
					<div className='flex flex-wrap items-center justify-start gap-4'>
						<h2 className='text-lg font-medium text-card text-center flex justify-center items-center'>
							Booking #:
							<span className='text-xl font-semibold text-green-900 ml-2'>
								{data.bookingId}
							</span>
							{
								<div className={`relative inline-flex items-center`}>
									<span
										className={`ml-2 px-3 py-2 rounded-md text-white text-sm uppercase font-semibold ${
											data.scope === 0
												? 'bg-red-500'
												: data.scope === 1
												? 'bg-red-500'
												: data.scope === 2
												? 'bg-red-500'
												: data.scope === 3
												? 'bg-red-500'
												: data.scope === 4
												? 'bg-blue-500'
												: '' // default color for any other type
										}`}
									>
										{data.scope === 0
											? 'Cash'
											: data.scope === 1
											? 'Account'
											: data.scope === 2
											? 'Rank'
											: data.scope === 3
											? 'All'
											: data.scope === 4
											? 'Card'
											: ''}{' '}
										{data.paymentStatus === 0
											? ''
											: data.paymentStatus === 2
											? '- Received'
											: data.paymentStatus === 3
											? '- Awaiting'
											: ''}
									</span>
									<div className='absolute -top-4 -right-4 rounded-full p-[0.2rem] flex items-center justify-center bg-white'>
										<div
											className={`${
												data.scope === 4 ? 'bg-blue-500' : 'bg-red-500'
											} rounded-full p-1 flex items-center justify-center`}
										>
											{data.scope === 0 ? (
												<CurrencyPoundIcon
													style={{ color: 'white', fontSize: '16px' }}
													className='animate-bounce'
												/>
											) : data.scope === 1 ? (
												<LockIcon
													style={{ color: 'white', fontSize: '16px' }}
													className='animate-bounce'
												/>
											) : data.scope === 2 ? (
												<StarIcon
													style={{ color: 'white', fontSize: '16px' }}
													className='animate-bounce'
												/>
											) : data.scope === 3 ? (
												''
											) : data.scope === 4 ? (
												<CurrencyPoundIcon
													style={{ color: 'white', fontSize: '16px' }}
													className='animate-bounce'
												/>
											) : (
												''
											)}
										</div>
									</div>
								</div>
							}
						</h2>

						{/* {user?.currentUser?.roleId !== 3 && (
							<button
								onClick={() => {
									if (!data?.phoneNumber) {
										dispatch(openSnackbar('Phone is required', 'error'));
									} else {
										handleSendConfirmationText();
									}
								}}
								className={`px-3 py-2 text-white bg-blue-700 hover:bg-opacity-80 rounded-lg`}
							>
								Send Confirmation Text
							</button>
						)} */}

						{/* {user?.currentUser?.roleId !== 3 &&
							(data?.scope === 0 || data?.scope === 4) && (
								<button
									onClick={sendPaymentReceipt}
									className={`px-3 py-2 text-white bg-blue-700 hover:bg-opacity-80 rounded-lg`}
								>
									Send Payment Receipt
								</button>
							)} */}
					</div>

					<button
						className='rounded-full p-1 sm:p-2'
						onClick={() => {
							closeDialog();
							dispatch(setActiveSearchResultClicked(null));
						}}
					>
						<CancelRoundedIcon />
					</button>
				</div>
				<div className='p-4 grid grid-cols-1 sm:grid-cols-2 place-content-between gap-4 mt-4 border border-card dark:border-popover max-h-[70vh] overflow-scroll'>
					<div className='w-[100%]'>
						<div className='flex flex-col w-full gap-4'>
							<div className='border border-card p-4 shadow-md rounded-lg bg-[#F3F4F6]'>
								{/* <h3 className='text-xl absolute top-[-18px] bg-white text-red-700 flex justify-start items-center font-semibold'>
									Journey
								</h3> */}
								<div className='flex justify-center items-start gap-2 w-full'>
									<div className='w-full'>
										<div className='w-full flex'>
											<HomeIcon sx={{ fontSize: '32px', color: 'green' }} />
											<h3 className='w-full border-b border-b-gray-300 py-1 text-md font-medium mb-1'>
												Pickup
											</h3>
										</div>

										<BookingOption
											// text={getTodayInEnGbFormat(data.pickupDateTime)}
											text={
												<>
													{getTodayInEnGbFormat(data.pickupDateTime)}
													{data.isASAP && (
														<span
															style={{
																backgroundColor: '#228B22',
																color: 'white',
																padding: '2px 5px',
																marginLeft: '5px',
																borderRadius: '12px',
																fontSize: '12px',
																fontWeight: 'semibold',
																border: '1px solid white',
															}}
														>
															ASAP
														</span>
													)}
												</>
											}
											head='Date/Time'
										/>
										<div className='flex'>
											{/* {data?.scope === 1 && user?.currentUser?.roleId !== 3 && (
												<button
													onClick={() => {
														const passengerName = data?.passengerName?.includes(
															','
														)
															? data?.passengerName.split(',')[0]
															: data?.passengerName;
														handleCOAEntry(data?.pickupAddress, passengerName);
													}}
													className={`px-1 py-1 text-white bg-red-700 hover:bg-opacity-80 rounded-lg text-sm`}
												>
													COA
												</button>
											)} */}
											<div className='flex items-start mb-1 w-full'>
												<p className='text-md font-medium pr-2 sm:whitespace-nowrap sm:w-auto flex justify-start sm:justify-end sm:items-end ml-2'>
													From:{' '}
												</p>
												<span
													className={`${'text-card dark:text-popover-foreground text-[1rem]'} sm:w-[70%] flex sm:justify-start sm:items-start`}
												>
													<a
														href={`https://www.google.com/maps?q=${encodeURIComponent(
															data.pickupPostCode
														)}`}
														target='_blank'
														rel='noopener noreferrer'
														className='text-blue-600'
													>
														{data.pickupAddress}, {data.pickupPostCode}
													</a>
												</span>
											</div>
											{/* <BookingOption
												text={`${data.pickupAddress}, ${data.pickupPostCode}`}
												head='From'
												link={`https://www.google.com/maps?q=${encodeURIComponent(
													data.pickupPostCode
												)}`}
											/> */}
										</div>
									</div>
								</div>
							</div>
							{data.vias.length > 0 && (
								<div className='flex justify-center items-start gap-2 w-full border border-card p-4 shadow-md relative rounded-lg bg-[#F3F4F6]'>
									<div className='w-full'>
										<div className='flex w-full'>
											<HomeIcon sx={{ fontSize: '32px', color: 'green' }} />
											<h3 className='w-full border-b border-b-gray-300 py-1 text-md font-medium mb-1'>
												Vias
											</h3>
										</div>

										{data.vias.length > 0 &&
											data.vias.map((via, idx) => (
												<>
													<div className='flex items-start mb-1 w-full'>
														{/* {data?.scope === 1 &&
															user?.currentUser?.roleId !== 3 && (
																<button
																	key={idx}
																	onClick={() => {
																		{
																			const passengerName =
																				data?.passengerName?.includes(',')
																					? data?.passengerName
																							.split(',')
																							.at(idx + 1)
																							.trim()
																					: data?.passengerName;
																			handleCOAEntry(
																				via.address,
																				passengerName
																			);
																		}
																	}}
																	className={`px-1 py-1 text-white bg-red-700 hover:bg-opacity-80 rounded-lg text-sm`}
																>
																	{`COA: ${idx + 1}`}
																</button>
															)} */}
														<p className='text-md font-medium pr-2 whitespace-nowrap w-auto ml-2 flex justify-end items-end'>
															{`Via ${idx + 1}:`}
														</p>
														<span className='text-card dark:text-popover-foreground text-[1rem] w-[80%] flex justify-start items-start'>
															<a
																// href={generateRouteLink()}
																href={`https://www.google.com/maps?q=${encodeURIComponent(
																	via.postCode
																)}`}
																target='_blank'
																rel='noopener noreferrer'
																className='text-blue-600'
															>
																{`${via.address}, ${via.postCode}`}
															</a>
														</span>
													</div>
												</>
											))}
									</div>
								</div>
							)}

							<div className='flex justify-center items-start gap-2 w-full border border-card p-4 shadow-md relative rounded-lg bg-[#F3F4F6]'>
								<div className='w-full'>
									<div className='w-full flex'>
										<HomeIcon sx={{ fontSize: '32px', color: 'green' }} />
										<h3 className='w-full border-b border-b-gray-300 py-1 text-md font-medium mb-1'>
											Destination
										</h3>
									</div>
									<div className='flex justify-between items-center'>
										<div className='flex items-start mb-1 w-[75%]'>
											<p className='text-md font-medium pr-2 whitespace-nowrap w-[20%] flex justify-end items-end'>
												To:
											</p>
											<span className='text-card dark:text-popover-foreground text-[1rem] w-[80%] flex justify-start items-start'>
												<a
													// href={generateRouteLink()}
													href={`https://www.google.com/maps?q=${encodeURIComponent(
														data.destinationPostCode
													)}`}
													target='_blank'
													rel='noopener noreferrer'
													className='text-blue-600'
												>
													{`${data.destinationAddress}, ${data.destinationPostCode}`}
												</a>
											</span>
										</div>
										<div className='flex justify-end items-start mb-1 w-[25%]'>
											<p className='text-md font-medium pr-2 whitespace-nowrap flex justify-end items-end'>
												Arrive By:
											</p>
											<span className='text-card dark:text-popover-foreground text-[1rem] flex justify-start items-start'>
												{`${
													data.arriveBy
														? data.arriveBy?.split('T')[1].slice(0, 5)
														: ''
												}`}
											</span>
										</div>
									</div>

									{/* <BookingOption
										text={`${data.destinationAddress}, ${data.destinationPostCode}`}
										head='To'
									/> */}
								</div>
							</div>
							<div className='flex justify-center items-start gap-2 w-full border border-card p-4 shadow-md relative rounded-lg bg-[#F3F4F6]'>
								<div className='w-full'>
									<div className='flex w-full'>
										<PersonIcon sx={{ fontSize: '32px', color: 'green' }} />
										<h3 className='w-full border-b border-b-gray-300 py-1 text-md font-medium mb-1'>
											Passenger
										</h3>
									</div>

									<BookingOption
										text={data.passengerName ? data.passengerName : 'NA'}
										head='Passenger Name'
									/>
									<BookingOption
										text={data.email ? data.email : 'NA'}
										head='Email'
									/>
									<BookingOption
										text={data.phoneNumber ? data.phoneNumber : 'NA'}
										head='Phone Number'
									/>
									<BookingOption
										text={data.passengers ? data.passengers : 'NA'}
										head='Passenger Count'
									/>
								</div>
							</div>
						</div>
					</div>
					<div>
						<div className='flex h-full flex-col w-full gap-4'>
							<div className='flex justify-start items-start gap-2 w-full border border-card p-4 shadow-md relative rounded-lg bg-[#F3F4F6] h-full'>
								<div className='w-full flex justify-center items-start gap-2'>
									<div className='w-full'>
										<div className='flex w-full'>
											<TextSnippetIcon
												sx={{ fontSize: '32px', color: 'green' }}
											/>
											<h3 className='w-full border-b border-b-gray-300 py-1 text-md font-medium mb-1'>
												Details
											</h3>
										</div>

										<BookingOption
											text={data.details ? data.details : 'NA'}
											head='Details'
										/>
										<BookingOption
											head='Type'
											text={
												data.scope === 0
													? 'Cash Job'
													: data.scope === 1
													? 'Account'
													: data.scope === 2
													? 'Rank'
													: data.scope === 3
													? 'All'
													: data.scope === 4
													? 'Card'
													: ''
											}
										/>
										{data.scope === 1 && (
											<BookingOption
												text={data.accountNumber ? data.accountNumber : 'NA'}
												head='Account'
											/>
										)}
										<BookingOption
											text={data.fullname || 'NA'}
											head='Allocated Driver'
										/>
										<BookingOption
											text={data.price ? `£${data.price.toFixed(2)}` : 'NA'}
											head='Price'
										/>
										<BookingOption
											text={
												data.durationMinutes
													? `${Math.floor(data.durationMinutes / 60)} Hour(s) ${
															data.durationMinutes % 60
													  } Minute(s)`
													: 'NA'
											}
											head='Time'
										/>
										<BookingOption
											text={data.mileageText ? data.mileageText : 'NA'}
											head='Distance'
										/>

										{data.isAllDay && (
											<BookingOption
												text={data.isAllDay ? '✅' : '❎'}
												head='All Day'
											/>
										)}

										{data.recurrenceID && (
											<BookingOption
												text={data.recurrenceID ? 'Yes' : 'No'}
												head='Repeat Booking'
											/>
										)}

										{/* <BookingOption
												text={
													data.paymentStatus === 0
														? 'Not Paid'
														: data.paymentStatus === 1
														? 'Paid'
														: data.paymentStatus === 2
														? 'Awaiting payment'
														: ''
												}
												head='Payment Status'
											/> */}
										<div className='flex w-full items-center mb-1'>
											<p className='text-md font-medium pr-2 sm:w-[30%] flex justify-end items-end'>
												Payment Status:{' '}
											</p>
											<span
												className={`text-card dark:text-popover-foreground text-[1rem]`}
											>
												{data.paymentStatus === 0
													? '-'
													: data.paymentStatus === 2
													? 'Paid'
													: data.paymentStatus === 3
													? 'Awaiting payment'
													: ''}{' '}
												{/* {data.paymentStatus === 0 &&
													user?.currentUser?.roleId !== 3 && (
														<button
															onClick={() => {
																if (data.phoneNumber || data.email) {
																	setOpenSmsDailogModal((prev) => !prev);
																} else {
																	dispatch(
																		openSnackbar(
																			'Phone or Email is required',
																			'error'
																		)
																	);
																}
															}}
															className='px-1 sm:px-3 py-1 text-white bg-green-500 hover:bg-opacity-80 rounded-lg text-[0.65rem] sm:text-[1rem]'
														>
															Send Payment Link
														</button>
													)} */}
												{/* {data.paymentStatus !== 2 &&
													user.currentUser?.roleId === 1 && (
														<button
															onClick={handleReminderButton}
															className='px-1 sm:px-3 py-1 text-white bg-green-500 hover:bg-opacity-80 rounded-lg text-[0.65rem] sm:text-[1rem] ml-2'
														>
															Resend
														</button>
													)} */}
												{/* {data.paymentStatus === 2 &&
													user?.currentUser?.roleId !== 3 && (
														<button
															onClick={handleRefundClick}
															className='px-1 sm:px-3 py-1 text-white bg-green-500 hover:bg-opacity-80 rounded-lg text-[0.65rem] sm:text-[1rem]'
														>
															Refund
														</button>
													)} */}
											</span>
										</div>

										<BookingOption
											text={
												data?.paymentLinkSentBy ? data?.paymentLinkSentBy : 'NA'
											}
											head='Payment Link Sent By'
										/>

										<BookingOption
											text={
												data?.paymentLinkSentOn
													? getTodayInEnGbFormat(data?.paymentLinkSentOn)
													: 'NA'
											}
											head='Payment Link Sent On'
										/>

										<BookingOption
											text={
												data.confirmationStatus === 0
													? 'NA'
													: data.confirmationStatus === 1
													? 'Confirmed'
													: data.confirmationStatus
													? 'Not Confirmed'
													: 'NA'
											}
											head='Confirmation Status'
										/>

										{/* {user?.currentUser?.roleId !== 3 && (
											<div>
												<div className='flex w-full items-start mb-4'>
													<p className='text-md font-medium pr-2 sm:w-[30%] flex justify-end items-end'>
														Booked By:{' '}
													</p>
													<span
														className={`text-card dark:text-popover-foreground text-[1rem]`}
													>
														{data.bookedByName}{' '}
														<span className='text-md font-medium'>On</span>{' '}
														{getTodayInEnGbFormat(data.dateCreated)}
													</span>
												</div>
											</div>
										)} */}
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className='my-auto pt-2 gap-4 flex flex-wrap justify-center items-center'>
					{/* <BookingButton
						text='View Booking'
						color='blue'
						// onClick={() => setViewBookingModal(true)}
					/> */}

					{/* {user?.currentUser?.roleId !== 3 && (
						<BookingButton
							text='Soft Allocate'
							color='bg-blue-700'
							onClick={() => {
								setAllocateModal(true);
								dispatch(setActiveSoftAllocate(true));
							}}
						/>
					)} */}
					{/* {user?.currentUser?.roleId !== 3 && (
						<BookingButton
							text='Allocate Booking'
							color='bg-blue-700'
							onClick={() => {
								setAllocateModal(true);
								dispatch(setActiveSoftAllocate(false));
							}}
						/>
					)} */}
					{/* {user?.currentUser?.roleId !== 3 && (
						<BookingButton
							onClick={() => {
								if (data.recurrenceRule) {
									setEditBookingModal(true);
								} else {
									const filterData = {
										...data,
										recurrenceID: '',
										recurrenceRule: '',
									};
									dispatch(addDataFromSchedulerInEditMode(filterData));
									dispatch(
										findQuote({
											pickupPostcode: data?.pickupPostCode,
											viaPostcodes: data?.vias.map((via) => via.postCode),
											destinationPostcode: data?.destinationPostCode,
											pickupDateTime: data?.pickupDateTime,
											passengers: data?.passengers,
											priceFromBase: data?.chargeFromBase,
										})
									);
									dispatch(setActiveSectionMobileView('Booking'));

									closeDialog(false);
								}
							}}
							text='Edit Booking'
							color='bg-blue-700'
						/>
					)} */}
					{/* {user?.currentUser?.roleId !== 3 && (
						<BookingButton
							text='Duplicate Booking'
							color='bg-blue-700'
							onClick={() => setDuplicateBookingModal(true)}
						/>
					)} */}
					<BookingButton
						text='Driver Arrived'
						color='bg-blue-700'
						onClick={handleDriverArrived}
					/>

					<BookingButton
						text='Complete Booking'
						color='bg-green-700'
						onClick={() => setIsCompleteBookingModal(true)}
					/>

					{/* {data.scope === 1 && user?.currentUser?.roleId !== 3 && (
						<BookingButton
							text='Cancel On Arrival'
							color='bg-orange-700'
							onClick={handleCancelOnArrival}
						/>
					)} */}
					{/* {user?.currentUser?.roleId !== 3 && (
						<BookingButton
							text='Cancel Booking'
							color='bg-red-700'
							onClick={() => setDeleteModal(true)}
						/>
					)} */}
				</div>
			</div>
			{/* <Modal
				open={allocateModal}
				setOpen={setAllocateModal}
			>
				<AllocateModal
					setAllocateModal={setAllocateModal}
					closeDialog={closeDialog}
				/>
			</Modal> */}
			<Modal
				open={isCompleteBookingModal}
				setOpen={setIsCompleteBookingModal}
			>
				<CompleteBookingModal
					setIsCompleteBookingModal={setIsCompleteBookingModal}
					closeDialog={closeDialog}
				/>
			</Modal>
			{/* {data.recurrenceRule && (
				<Modal
					open={editBookingModal}
					setOpen={setEditBookingModal}
				>
					<EditBookingModal
						setEditBookingModal={setEditBookingModal}
						closeDialog={closeDialog}
					/>
				</Modal>
			)} */}

			{/* <Modal
				open={duplicateBookingModal}
				setOpen={setDuplicateBookingModal}
			>
				<DuplicateBookingModal
					setDuplicateBookingModal={setDuplicateBookingModal}
					closeDialog={closeDialog}
				/>
			</Modal>
			<Modal
				open={deleteModal}
				setOpen={setDeleteModal}
			>
				<DeleteBookingModal
					setDeleteModal={setDeleteModal}
					closeDialog={closeDialog}
				/>
			</Modal>
			<Modal
				open={openSmsDailogModal}
				setOpen={setOpenSmsDailogModal}
			>
				<PaymentLinkOptionModal
					setOpenSmsDailogModal={setOpenSmsDailogModal}
					handlePayClick={handlePayClick}
				/>
			</Modal> */}
		</div>
	);
}

function getTodayInEnGbFormat(date) {
	const today = new Date(date);
	const enGbFormatter = new Intl.DateTimeFormat('en-GB', {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
		hour12: false, // Use 24-hour format. Set to true for 12-hour format with AM/PM.
	});
	return enGbFormatter.format(today);
}

const BookingOption = ({ text, head, link }) => {
	const isPhoneNumber = head.toLowerCase().includes('phone') && text !== 'NA';
	const phoneLink = isPhoneNumber ? `tel:${text}` : null;
	return (
		<div className='flex items-start mb-1 w-full'>
			<p className='text-md font-medium pr-2 sm:whitespace-nowrap sm:w-[30%] flex justify-start sm:justify-end sm:items-end'>
				{head}:{' '}
			</p>
			<span
				className={` ${
					head === 'Price'
						? 'text-card dark:text-popover-foreground text-[1.25rem] text-[#EF4444] font-bold'
						: 'text-card dark:text-popover-foreground text-[1rem]'
				} sm:w-[70%] flex sm:justify-start sm:items-start`}
			>
				{isPhoneNumber ? (
					<a
						href={phoneLink}
						className='text-blue-600'
					>
						{text}
					</a>
				) : link ? (
					<a
						href={link}
						target='_blank'
						rel='noopener noreferrer'
						className='text-blue-600'
					>
						{text}
					</a>
				) : head === 'Price' ? (
					text
				) : (
					text
				)}
			</span>
		</div>
	);
};

const BookingButton = ({ text, color, ...props }) => {
	return (
		<button
			{...props}
			className={`px-3 py-2 text-white ${color} hover:bg-opacity-80 rounded-lg`}
		>
			{text}
		</button>
	);
};

export default CustomDialog;
