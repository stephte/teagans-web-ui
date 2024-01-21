

export const getExpTimestamp = (expInSeconds) => {
	if (!expInSeconds) {
		return 0;
	}

	const expTime = +expInSeconds * 1000;
	return Date.now() + expTime;
};