
const shortMonths = [
	"Jan",
	"Feb",
	"Mar",
	"Apr",
	"May",
	"Jun",
	"Jul",
	"Aug",
	"Sep",
	"Oct",
	"Nov",
	"Dec"
];
const longMonths = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December"
];

export const prettyUTCDateStr = (date: Date, shortForm: boolean = false) => {
	return `${getMonthString(date.getUTCMonth(), shortForm)} ${date.getUTCDate()}, ${date.getUTCFullYear()}`;
};

const getMonthString = (monthNum: number, shortForm: boolean) => {
	if (shortForm) {
		return shortMonths[monthNum];
	}

	return longMonths[monthNum];
};

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