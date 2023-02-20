import { publicAxios } from "./axios"

export function isTokenValid(jwtToken: string) {
  return getTokenExpiry(jwtToken) >= Date.now()
}

export function isTokenValidFormat(jwtToken: string) {
  try {
    const payload = JSON.parse(atob(jwtToken.split(".")[1]))
    return true
  } catch (error) {
    return false
  }
}

export function getTokenExpiry(jwtToken: string) {
  try {
    const payload = JSON.parse(atob(jwtToken.split(".")[1]))
    return (payload?.exp ?? 0) * 1000
  } catch (error) {
    return 0
  }
}

export function clearUserSession() {
  localStorage.removeItem("refreshToken")
  localStorage.removeItem("accessToken")
}

export const refetchNewToken = async () => {
  const refreshToken = localStorage.getItem("refreshToken")
  return publicAxios("/token/refresh/", {
    method: "POST",
    data: {
      refreshToken,
    },
  }).then((response: any) => {
    localStorage.setItem("accessToken", response.data?.accessToken)
    localStorage.setItem("refreshToken", response.data?.refreshToken)
  })
}
