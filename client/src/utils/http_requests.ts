// generic
async function request<TResponse>(
    url: string, 
    config: RequestInit = { method: 'GET' }
  ): Promise<Awaited<TResponse> | undefined> {
    try {
      const response = await fetch(url, config);
      if (response.status === 200) {
        return await response.json();
        }
        else throw `Response error. Status ${response.status}.`;
    }
    catch (error) {
      console.error(error);

    }
};

//generic
export const api = {
    get: <TResponse>(url: string) => 
        request<TResponse>(url),

    post: <TBody extends BodyInit, TResponse>(url: string, body: TBody) => 
        request<TResponse>(url, { method: 'POST', body }),
};


// export async function getData(url: string) {
//     try {
//         let res = await fetch(url);
//         if (res.status === 200) {
//             let data = await res.json();
//                 return data
//             }
//             else throw `Response error. Status ${res.status}.`;
//     } 
//     catch (error: unknown) {
//         console.error(error.response.data.message);
//     }
// };

// export async function postData(url: string, data: any) {
//     try {
//         const response = await fetch(url, {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify(data),
//         });
//         if (!response.ok) {
//           throw new Error('Network response was not ok ' + response.statusText);
//         }
//         const result = await response.json();
//         console.log('Success:', result);
//         return result
//       } catch (error: unknown) {
//         console.error(error.response.data.message);
//       }
// };
