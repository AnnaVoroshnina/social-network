import { Header } from "../header"
import { Container } from "../container"
import { NavBar } from "../nav-bar"
import { Outlet } from "react-router-dom"

export const Layout = () => {
  return (
    <>
      <Header />
      <Container>
        <div className="flex-2 p-4">
          <NavBar/>
        </div>
        <div className='flex-1 p-5'>
          <Outlet />
        </div>

      </Container>
    </>
  )
}