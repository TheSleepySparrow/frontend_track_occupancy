import { getResponse } from './api'

export async function checkUser () {
  try {
    await getResponse("/auth/verify")
    return true

  } catch (error) {
    console.error("Ошибка при проверке пользователя:", error)

    return false
  }
}
