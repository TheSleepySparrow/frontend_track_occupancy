export async function getResponse(apiUrl) {
    try {
        const response = await fetch(apiUrl)
        if (!response.ok) {
            const error = new Error(response.statusText)
            error.statusCode = response.status
            throw error
        }
        const data = await response.json()
        return data
    } catch (error) {
        console.error("Ошибка при получении данных:", error)
        const err = new Error(error.message)
        err.statusCode = error.statusCode
        throw err
    }
}

export async function postResponseWithoutAuth(apiUrl, apiBody = {}) {
    try{
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
              //'X-CSRF-Token': Cookies.get('csrf_token')
          },
          body: JSON.stringify(apiBody),
          credentials: 'include' // if you need to send cookies
          })
        if (!response.ok) {
          const error = new Error(response.statusText)
          error.statusCode = response.status
          throw error
        }
        const data = await response.json()
        return data
    } catch (error) {
        console.error("Ошибка при получении данных:", error)
        const err = new Error(error.message)
        err.statusCode = error.statusCode
        throw err
    }
}

export async function putResponse(apiUrl, apiBody = {}) {
    try{
        const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
            //'X-CSRF-Token': Cookies.get('csrf_token')
        },
        body: JSON.stringify(apiBody),
        credentials: 'include'
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Ошибка при получении данных:", error);
        throw new Error(error);
    }
}
