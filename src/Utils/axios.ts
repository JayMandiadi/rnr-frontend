import axios, { AxiosError } from "axios"
import { clearUserSession } from "./auth"

export const authAxios = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  paramsSerializer: {
    encode: (params: any): any => {
      const searchParams = new URLSearchParams()
      for (const key of Object.keys(params)) {
        const param = params[key]
        if (Array.isArray(param)) {
          for (const p of param) {
            searchParams.append(key, p)
          }
        } else {
          searchParams.append(key, param)
        }
      }
      return searchParams.toString()
    },
  },
})

authAxios.interceptors.request.use(
  function (config: any) {
    const accessToken = localStorage.getItem("accessToken")
    const headers = {
      Authorization: `Bearer ${accessToken}`,
      // "Access-Control-Allow-Origin": "*",
      // "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
    }

    return {
      ...config,
      headers: {
        ...config?.headers,
        ...headers,
      },
    }
  },
  (err: AxiosError) => {
    return Promise.reject(err)
  }
)

authAxios.interceptors.response.use(
  (response) => response,
  (error: AxiosError<any>) => {
    const { response } = error
    if (response?.status === 401) {
      clearUserSession()

      window.location.replace("/login")
    }

    return Promise.reject(error)
  }
)

export const publicAxios = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
  },
})

export async function retry<T>(promiseFn: () => Promise<T>, maxTries: number = 3): Promise<T> {
  try {
    return await promiseFn()
  } catch (e) {
    if (maxTries > 0) {
      return retry(promiseFn, maxTries - 1)
    }
    throw e
  }
}

/* NOTE: make sure not to disable cache by default */
// configure({
//   axios: authAxios, defaultOptions: {
//     useCache: false,
//   }
// })
