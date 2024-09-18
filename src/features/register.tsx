import { Input } from "../components/input"
import { Link } from "@nextui-org/react"
import { Button } from "@nextui-org/button"
import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { useRegisterMutation } from "../app/services/userApi"
import { hasErrorField } from "../utils/has-error-field"
import { ErrorMessage } from "../components/error-message"

type Props = {
  setSelected: (value: string) => void
}
type RegisterProps = {
  email: string;
  name: string;
  password: string;
}
export const Register = ({setSelected}: Props) => {
  const {
    handleSubmit,
    control,
    formState: { errors }
  } = useForm<RegisterProps>({
      mode: "onChange",
      reValidateMode: "onBlur",
      defaultValues: { email: "", password: "", name: "" }
    }
  )
  const [register, { isLoading }] = useRegisterMutation()
  const [error, setError] = useState('')

  const onSubmit = async (data: RegisterProps) => {
    try {
      await register(data).unwrap()
      setSelected('login')
    } catch (error) {
      if (hasErrorField(error)){
        setError(error.data.error)
      }
    }
  }
  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      <Input name="name" label="Name" control={control} type="text" required="Обязательное поле" />
      <Input name="email" label="Email" control={control} type="email" required="Обязательное поле" />
      <Input name="password" label="Пароль" control={control} type="password" required="Обязательное поле" />
      <ErrorMessage error={error} />
      <p className="text-center text-small">
        Уже зарегистрированы? {" "}
        <Link
          size="sm"
          className="cursor-pointer"
          onPress={() => setSelected("login")}
          href="/login">Войдите</Link>
      </p>
      <div className="flex gap-2 justify-end">
        <Button fullWidth color="primary" type="submit" isLoading={isLoading}>
          Зарегистрироваться
        </Button>
      </div>
    </form>
  )
}