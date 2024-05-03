import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { BillDetails } from '../../../api/bills/summary/types';

const fetchBillDetails = async (pathname: string) => {
	// Needs to be in the form of state-nv-bills-82-ab265
	// const pathname =
	// 	'state-' +
	// 	billId
	// 		.substring(1, billId.lastIndexOf('/'))
	// 		.replace('bills/', '')
	// 		.replace(/\//g, '-')
	// 		.toLowerCase();

	const response = await fetch('https://api.app.pluralpolicy.com/bills/' + pathname, {
		headers: {
			accept: 'application/json, text/plain, */*',
			'accept-language': 'en-US,en;q=0.9',
			priority: 'u=1, i',
			'sec-ch-ua': '"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"',
			'sec-ch-ua-mobile': '?0',
			'sec-ch-ua-platform': '"macOS"',
			'sec-fetch-dest': 'empty',
			'sec-fetch-mode': 'cors',
			'sec-fetch-site': 'same-site'
		},
		referrer: 'https://pluralpolicy.com/',
		referrerPolicy: 'strict-origin-when-cross-origin',
		body: null,
		method: 'GET',
		mode: 'cors',
		credentials: 'include'
	});
	const json = (await response.json()) as BillDetails;
	return json;
};

export const load: PageServerLoad = async ({ params, url }) => {
	const state = params.state;

	if (!state) {
		const newPath = url.pathname.substring(
			url.pathname.indexOf('bills'),
			url.pathname.lastIndexOf('/')
		);
		// Assuming redirect is a function that redirects the user to a specified URL
		redirect(302, newPath);
	}

	const billId =
		'state-' +
		url.pathname.substring(url.pathname.indexOf('/bills/') + '/bills/'.length).replace('/', '-');

	const billDetails = await fetchBillDetails(billId);

	return billDetails;
};
