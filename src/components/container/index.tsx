import React from "react"

type Props= {
  children:React.ReactNode[] | React.ReactNode
}
export const Container = ({children}: Props) =>{
  return(
    <div className='flex max-w-screen-xl mx-auto mt-10'>
      {children}
    </div>
  )
}