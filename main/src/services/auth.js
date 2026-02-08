import { getResponse } from './api'

export async function checkUser () {
  try {
    const data = await getResponse("/auth/verify")
    data['authenticated'] = true
    return data

  } catch (error) {
    console.error("Ошибка при проверке пользователя:", error)

    return false
  }
}
