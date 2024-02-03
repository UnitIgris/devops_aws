const formatTime = (originalDate) => {
	const dateObj = new Date(originalDate);

	return dateObj.toLocaleString('en-US', {
		month: '2-digit',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
		hour12: false
	})
};

export default formatTime;
