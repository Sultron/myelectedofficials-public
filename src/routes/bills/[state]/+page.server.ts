// import { redirect } from '@sveltejs/kit';
// import type { PageServerLoad } from './$types';
// import type { BillsData } from './types';

// export const load: PageServerLoad = async ({ params }) => {
//     const state = params.state;
//     console.log(state, "<------ state");
//     if (!state) {
//         // Assuming redirect is a function that redirects the user to a specified URL
//         redirect(302, '/bills');
//     }

//     const apiurl = `https://open-states.sultan7rs.workers.dev/bills/${state}`;
//     const response = await fetch(apiurl); // Use apiurl instead of url
//     const data = await response.json() as BillsData;
//     return {
//        data
//     };
  
// };



