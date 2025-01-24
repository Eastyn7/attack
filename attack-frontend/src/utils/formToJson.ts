// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function formToJson(formData: Record<string, any>): string {
	return JSON.stringify(formData)
}
