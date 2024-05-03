import { json } from '@sveltejs/kit';
import type { BillDetails } from './types';
import { VertexAI } from '@google-cloud/vertexai';

const fetchBillDetails = async (billId: string) => {
	// const pathname =
	// 	'state-' +
	// 	billId
	// 		.substring(1, billId.lastIndexOf('/'))
	// 		.replace('bills/', '')
	// 		.replace(/\//g, '-')
	// 		.toLowerCase();

	const response = await fetch('https://api.app.pluralpolicy.com/bills/' + billId, {
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

export async function POST({ request }) {
	const { billId } = await request.json();

	if (!billId) {
		return json({ error: 'missing billId' }, { status: 400 });
	}
	//const apiurl = `https://open-states.sultan7rs.workers.dev/bills/${state}?page=${page}`;
	//const response = await fetch(apiurl);
	//const data = await response.json();
	const vertex_ai = new VertexAI({ project: 'myelectedofficials-415909', location: 'us-central1' });
	const model = 'gemini-1.5-pro-preview-0409';
	//gemini-1.0-pro-001

	const billDetails = await fetchBillDetails(billId);

	// Instantiate the models
	const generativeModel = vertex_ai.preview.getGenerativeModel({
		model: model,
		generationConfig: {
			maxOutputTokens: 768,
			temperature: 0.2,
			topP: 0.8,
			topK: 40
		}
	});

	const text1 = {
		text: `Provide a brief summary for the following legislative bill:

${billDetails.versions[0].baseText}`
	};

	const req = {
		contents: [{ role: 'user', parts: [text1] }]
	};

	const streamingResp = await generativeModel.generateContentStream(req);
	// Prepare the response headers
	const headers = {
		'Content-Type': 'application/json'
	};
	const encoder = new TextEncoder();
	const readable = new ReadableStream({
		async start(controller) {
			for await (const item of streamingResp.stream) {
				if (!item.candidates) {
					continue;
				}

				controller.enqueue(
					encoder.encode(
						JSON.stringify(
							item.candidates.flatMap((c) => c.content.parts.flatMap((p) => p.text).join(' '))
						)
					)
				);
			}
			controller.close();
		}
	});

	return new Response(readable, { headers });
}
