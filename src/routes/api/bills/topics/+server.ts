import { API_KEY } from '$env/static/private';
import { json } from '@sveltejs/kit';
import { VertexAI } from '@google-cloud/vertexai';
//import { GoogleGenerativeAI } from "@google/generative-ai";

// Access your API key as an environment variable (see "Set up your API key" above)
//const genAI = new GoogleGenerativeAI(API_KEY);

export async function POST({ request }) {
	const { billDocument } = await request.json();

	if (!billDocument) {
		return json({ error: 'missing document' }, { status: 400 });
	}
	//const apiurl = `https://open-states.sultan7rs.workers.dev/bills/${state}?page=${page}`;
	//const response = await fetch(apiurl);
	//const data = await response.json();
	const vertex_ai = new VertexAI({ project: 'myelectedofficials-415909', location: 'us-central1' });
	const model = 'gemini-1.5-pro-preview-0409';
	//gemini-1.0-pro-001

	//const billDetails = await fetchBillDetails(billId);

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
		text: `Exract the main topics of the following legislative bill and list them:

${billDocument}`
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
