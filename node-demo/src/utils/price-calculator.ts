/** Calculates the VAT amount for a price at the supplied percentage rate. */
export function calculateVAT(price: number, rate: number): number {
	if (!Number.isFinite(price) || !Number.isFinite(rate) || price < 0 || rate < 0) {
		throw new Error("Price and VAT rate must be non-negative finite numbers.");
	}

	return price * (rate / 100);
}
