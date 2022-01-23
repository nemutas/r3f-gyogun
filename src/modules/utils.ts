/**
 * 指定範囲のランダム値を取得する
 * @param min 最小値
 * @param max 最大値
 * @returns クランプされた値
 */
export const clampedRandom = (min: number, max: number) => {
	return Math.random() * (max - min) + min
}
