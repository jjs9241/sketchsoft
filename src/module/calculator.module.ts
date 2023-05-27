export const getRandomNumber = (min: number, max: number) => {
	return min + (max - min) * Math.random()
}