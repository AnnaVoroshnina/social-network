import { useNavigate } from "react-router-dom"
import { FaRegArrowAltCircleLeft } from "react-icons/fa"
import { BiArrowBack, BiLeftArrow, BiSolidDownArrow } from "react-icons/bi"
import { PiNavigationArrow } from "react-icons/pi"

export const GoBack = () => {
  const navigate = useNavigate()
  const handleGoBack = () => {
    navigate(-1)
  }
  return(
    <div
      className='text-default-500 flex text-center items-center gap-2 mb-10 cursor-pointer'
      onClick={handleGoBack}
    >
      <BiArrowBack />
        Назад
    </div>
  )
}