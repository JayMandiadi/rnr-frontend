import { LoginForm } from "Features/Auth/Components"
import { useMutation } from "Hooks"

import renoraLogo from "Assets/Images/renoraLogo.png"

interface ILoginProps {}

interface IAuthResponse {
  access: string
  refresh: string
}

const LoginPage = (props: ILoginProps) => {
  const initialValues = { username: "", password: "" }

  const [loginState, loginUser] = useMutation({
    url: "login/",
    method: "POST",
    onSuccess: (response: { data: IAuthResponse }) => {
      if (response.data) {
        localStorage.setItem("accessToken", response?.data?.access)
        localStorage.setItem("refreshToken", response?.data?.refresh)
        window.location.replace("/")
      }
    },
  })

  return (
    <div className="flex min-h-screen">
      <div className="flex flex-1 flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div>
            <img className="h-12 w-auto" src={renoraLogo} alt="Your Company" />
            <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
              Sign in to your account
            </h2>
          </div>
          <div className="mt-8">
            <LoginForm
              initialValues={initialValues}
              handleSubmit={(values) => loginUser({ data: values })}
              disabled={loginState.loading}
            />
          </div>
        </div>
      </div>
      <div className="relative hidden w-0 flex-1 lg:block">
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src="https://images.unsplash.com/photo-1505904267569-f02eaeb45a4c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1908&q=80"
          alt=""
        />
      </div>
    </div>
  )
}

export default LoginPage
