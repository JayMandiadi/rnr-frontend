import * as yup from "yup"

const LoginValidationSchema = (isCountryUS: boolean) => {
  return yup.object({
    username: yup.string().max(150, "Required").required(),
    password: yup.string().max(150, "Required").required(),
  })
}

export { LoginValidationSchema }
