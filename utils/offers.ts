import { LabelValue } from '@/types/general';
import { SpecialT } from '../types';
type FinanceOffer = {
	type: 'finance';
	apr: number;
	month: number;
	monthly_payment: number | null;
};

type LeaseOffer = {
	type: 'lease';
	monthly_payment: string | number | undefined;
	signing: number;
	month: number;
};

type CashbackOffer = {
	type: 'cashback';
	cashback_price: number;
	cashback_description: string;
};

type MsrpOffer = {
	type: 'msrp';
	discounts: LabelValue[];
	sale_price: number | null;
	msrp_price: number | null;
};

export type Offer = FinanceOffer | LeaseOffer | CashbackOffer | MsrpOffer;

export const generateOffers = (special: SpecialT) => {
	const res = special.special_types
		.map((type) => {
			switch (type) {
				case 'finance':
					return {
						type: 'finance',
						apr: special.finance_apr,
						month: special.finance_apr_month,
						monthly_payment: special.finance_monthly_payment,
					};
				case 'lease':
					return {
						type: 'lease',
						monthly_payment: special.lease_monthly_payment,
						signing: special.lease_due_at_signing,
						month: special.lease_months,
					};
				case 'cashback':
					return {
						type: 'cashback',
						cashback_price: special.cashback_price,
						cashback_description: special.cashback_description,
					};
				case 'msrp':
					return {
						type: 'msrp',
						discounts: special.discounts,
						sale_price: special.sale_price,
						msrp_price: special.msrp_price,
					};
				default:
					return null;
			}
		})
		.filter((offer): offer is Exclude<typeof offer, null> => offer !== null); // remove nulls if it exists

	// Move lease offer to the top
	const leaseIndex = res.findIndex((offer) => offer.type === 'lease');
	if (leaseIndex > 0) {
		const leaseOffer = res.splice(leaseIndex, 1)[0];
		res.unshift(leaseOffer);
	}

	// If there are 3 offers,
	// and there is a finance and cashback offer,
	// then the first offer should not be finance or cashback.
	if (
		res.length === 3 &&
		res.find((offer) => offer.type === 'finance') &&
		res.find((offer) => offer.type === 'cashback')
	) {
		// check if the first offer is finance or cashback
		if (res[0].type === 'finance' || res[0].type === 'cashback') {
			// find the first offer that is not finance or cashback
			const nonRequiredIndex = res.findIndex((offer) => offer.type !== 'finance' && offer.type !== 'cashback');
			if (nonRequiredIndex !== -1 && nonRequiredIndex !== 0) {
				// change the first offer with the non-required offer
				[res[0], res[nonRequiredIndex]] = [res[nonRequiredIndex], res[0]];
			}
		}
	}

	return res.slice(0, 3); // return only 3 offers
};
