import React from "react"
import { Button as NextButton } from "@nextui-org/button"

type Props = {
  children: React.ReactNode
  icon?: JSX.Element
  className?: string
  type?: "button" | "submit" | "reset"
  fullWidth?: boolean
  color?: "default" | "primary" | "secondary" | "success" | "warning" | "danger" | undefined
}
export const Button = ({ children, className, color, icon, fullWidth, type }: Props) => {
  return (
    <NextButton
      startContent={icon}
      size="lg"
      color={color}
      variant='light'
      className={className}
      type={type}
      fullWidth={fullWidth}
    >
      {children}
    </NextButton>
  )
}