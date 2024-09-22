import { User } from "../../app/types"
import React, { useContext, useState } from "react"
import { ThemeContext } from "../theme-provider"
import { useUpdateUserMutation } from "../../app/services/userApi"
import { useParams } from "react-router-dom"
import { Controller, useForm } from "react-hook-form"
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Textarea } from "@nextui-org/react"
import { Input } from "../input"
import { MdOutlineEmail } from "react-icons/md"
import { ErrorMessage } from "../error-message"
import { hasErrorField } from "../../utils/has-error-field"

type Props = {
  isOpen: boolean
  onClose: () => void
  user?: User
}
export const EditProfile = ({ isOpen, user, onClose }: Props) => {
  const { theme } = useContext(ThemeContext)
  const [updateUser, { isLoading }] = useUpdateUserMutation()
  const [error, setError] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const { id } = useParams<{ id: string }>()

  const { handleSubmit, control } = useForm<User>({
    mode: "onChange",
    reValidateMode: "onBlur",
    defaultValues: {
      email: user?.email,
      dateOfBirth: user?.dateOfBirth,
      name: user?.name,
      bio: user?.bio,
      location: user?.location
    }
  })

  const handleFileChange = (event : React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files !== null){
      setSelectedFile(event.target.files[0])
    }
  }
  const onSubmit = async (data: User) => {
    if(id) {
      try{
        const formData = new FormData()
        data.name && formData.append('name', data.name)
        data.email && data.email !== user?.email && formData.append('location', data.email)
        data.dateOfBirth && formData.append('dateOfBirth', new Date(data.dateOfBirth).toISOString())
        data.bio && formData.append('bio', data.bio)
        data.location && formData.append('location', data.location)
        selectedFile && formData.append('avatar', selectedFile)
        await updateUser({ userData: formData, id }).unwrap()
        onClose()
      } catch (err) {
        if(hasErrorField(err)){
          setError(err.data.error)
        }
      }
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className={`${theme} text-foreground`}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Изменение профиля
            </ModalHeader>
            <ModalBody>
              <form className="flex-col flex gap-4" onSubmit={handleSubmit(onSubmit)}>
                <Input name="email" label="Email" control={control} type="email" endContent={<MdOutlineEmail />} />
                <Input name="name" label="Имя" control={control} type="text" />
                <input type="file" name="avatarUrl" placeholder="Выберете файл" onChange={handleFileChange}/>
                <Input name="dateOfBirth" label="Дата Рождения" control={control} type="date"
                       placeholder="Дата Рождения" />
                <Controller
                  control={control}
                  render={({ field }) => (
                    <Textarea
                      {...field}
                      rows={4}
                      placeholder="Ваша биография" />
                  )}
                  name="bio" />
                <Input control={control} name="location" label="Местоположение" type="text" />
                <ErrorMessage error={error} />
                <div className="flex gap-2 justify-end">
                  <Button
                    fullWidth
                    color="primary"
                    type="submit"
                    isLoading={isLoading}
                  >
                    Обновить профиль
                  </Button>
                </div>
              </form>
            </ModalBody>
            <ModalFooter>
              <Button color='danger' variant='light' onPress={onClose}>
                Закрыть
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}