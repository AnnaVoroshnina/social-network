import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { Input } from "../components/input"
import { Link } from "@nextui-org/react"
import { Button } from "@nextui-org/button"
import { useLazyCurrentQuery, useLoginMutation } from "../app/services/userApi"
import { useNavigate } from "react-router-dom"
import { hasErrorField } from "../utils/has-error-field"
import { ErrorMessage } from "../components/error-message"


type LoginProps = {
  email: string
  password: string
}
type Props = {
  setSelected: (value: string) => void
}
export const Login = ({ setSelected }: Props) => {
  const {
    handleSubmit,
    control,
    formState: { errors }
  } = useForm<LoginProps>({
      mode: "onChange",
      reValidateMode: "onBlur",
      defaultValues: { email: "", password: "" }
    }
  )
  const [login, { isLoading }] = useLoginMutation({})
  const navigate = useNavigate()
  const [error, setError] = useState("")
  const [triggerCurrentQuery] = useLazyCurrentQuery()
  const onSubmit = async (data: LoginProps) => {
    try {
      await login(data).unwrap()
      await triggerCurrentQuery()
      navigate('/')
    } catch (error) {
      if (hasErrorField(error)) {
        setError(error.data.error)
      }
    }
  }
  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      <Input name="email" label="Email" control={control} type="email" required="Обязательное поле" />
      <Input name="password" label="Пароль" control={control} type="password" required="Обязательное поле" />
      <ErrorMessage error={error} />
      <p className="text-center text-small">
        Нет аккаунта? {" "}
        <Link
          size="sm"
          className="cursor-pointer"
          onPress={() => setSelected("sign-up")}
          href="/login">Зарегистрируйтесь</Link>
      </p>
      <div className="flex gap-2 justify-end">
        <Button fullWidth color="primary" type="submit" isLoading={isLoading}>
          Войти
        </Button>
      </div>
    </form>
  )
}