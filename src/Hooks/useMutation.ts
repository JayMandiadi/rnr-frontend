import { useState } from "react"
import { authAxios as axios } from "Utils"
import { AxiosResponse, AxiosError } from "axios"

interface MutationParams {
  data?: any
  url: string
  method?: "POST" | "PATCH" | "DELETE" | "PUT" | "GET"
  onSuccess?: Function
  onError?: Function
  config?: any
}

export type MutationFunctionType = (
  params?: Omit<MutationParams, "url">
) => Promise<AxiosResponse<any>>

export default function useMutation(params?: MutationParams) {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<any>()
  const [error, setError] = useState<any>()

  const state = {
    loading,
    data,
    error,
  }

  return [state, mutate] as const
  async function mutate(params2: Omit<MutationParams, "url"> & { url?: string } = {}) {
    setLoading(true)
    const allParams = { ...params, ...params2 }
    const {
      data: body,
      method = "POST",
      config = {},
      onSuccess = () => {},
      onError = () => {},
      url,
    } = allParams

    const response: any = await axios({
      ...config,
      data: body,
      method,
      url,
    }).catch((err: AxiosError) => {
      setData(null)
      onError(err.response?.data, error?.response)
      setError(err.response?.data)
      return { error: err.response }
    })
    setLoading(false)
    if (response && !response.error) {
      setError(null)
      setData(response)
      onSuccess(response)
    }

    return response
  }
}
