let refreshPromise = null;

export function clearAuthState() {
  refreshPromise = null
}

async function refreshToken() {
  const refreshTokenValue = JSON.parse(localStorage.getItem('auth')).refreshToken

  if (!refreshTokenValue) {
    throw new Error('No refresh token available')
  }

  const response = await fetch('/auth/refresh', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh_token: refreshTokenValue }),
  })

  if (!response.ok) {
    localStorage.removeItem('auth')
    throw new Error(`Token refresh failed: ${response.status}`)
  }

  const data = await response.json()
  localStorage.setItem('auth',
    JSON.stringify({
      ...JSON.parse(localStorage.getItem('auth')),
      token: data.access_token
    })
  )
  if (data.refresh_token) {
    localStorage.setItem('auth',
      JSON.stringify({
        ...JSON.parse(localStorage.getItem('auth')),
        refreshToken: data.refresh_token
      })
    )
  }

  return data.access_token
}

async function refreshTokenOnce() {
  if (!refreshPromise) {
    refreshPromise = refreshToken().finally(() => {
      refreshPromise = null
    });
  }
  return refreshPromise;
}

export async function fetchWithAuth(input, init = {}) {
  const authData = JSON.parse(localStorage.getItem('auth'))
  if (!authData?.token) {
    throw new Error('User is unknown')
  }
  const accessToken = authData.token

  const headers = new Headers(init.headers)
  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`)
  }

  const response = await fetch(input, { ...init, headers })

  if (response.status !== 401) {
    return response;
  }

  // 401 — пробуем обновить токен
  const newToken = await refreshTokenOnce();

  // Повторяем исходный запрос с новым токеном
  const retryHeaders = new Headers(init.headers);
  retryHeaders.set('Authorization', `Bearer ${newToken}`);

  return fetch(input, { ...init, headers: retryHeaders });
  // Если повторный запрос тоже вернёт 401 — Response пробросится как есть
}

export async function getResponse(apiUrl) {
    try {
        const response = await fetchWithAuth(apiUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
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
