// generic request function
async function request<TResponse>(
    url: string, 
    config: RequestInit = { method: 'GET' }  // default GET
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

// api - collection of HTTP methods
export const api = {
    get: <TResponse>(url: string) => 
        request<TResponse>(url),

    get_credentials: <TResponse>(url: string) => 
        request<TResponse>(url, {
            method: 'GET',
            credentials: 'include', // include cookies
        }),

    post: <TBody extends BodyInit, TResponse>(url: string, body: TBody) => 
        request<TResponse>(url, { method: 'POST', body }),

    post_credentials: <TBody extends BodyInit, TResponse>(url: string, body: TBody) => 
        request<TResponse>(url, { 
          method: 'POST',
          body,
          credentials: 'include',  // include cookies
          }),
};
