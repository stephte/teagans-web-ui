

export const getExpTimestamp = (expInSeconds: number | string) => {
	if (!expInSeconds) {
		return 0;
	}

	const expTime = +expInSeconds * 1000;
	return Date.now() + expTime;
};

export const getCardNode = (node: any, className: string, i: number) => {
	if (i >= 3 || (node.classList.contains(className))) {
		return node;
	}

	return getCardNode(node.parentNode, className, i+1);
}