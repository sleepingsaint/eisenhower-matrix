import Navbar from "@/components/Navbar"
import Matrix from "@/components/Matrix"
import Sidebar from "@/components/Sidebar"
import { useStore } from "./utils/store"
import { useShallow } from "zustand/shallow"
import LoginSvg from './assets/login.svg';
import { Button } from "./components/ui/button"
import supabase from "./utils/supabase"

function App() {
  const session = useStore(useShallow(state => state.session))
  const login = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google"
    })
  }
  return (
    <div className="h-screen w-screen flex flex-col">
      <Navbar />
      <div className="w-full h-full flex">
        {session && session.user ?
          <>
            <Sidebar />
            <div className="w-full h-full relative">
              <Matrix />
            </div>
          </>
          : <div className="w-full h-full flex flex-col px-4 justify-center items-center">
            <h2 className="text-2xl mb-4 text-center">Welcome to Eisenhower Matrix app <br />Your first step to become more productive</h2>
              <Button className="mb-8" onClick={login}>Start Here</Button>              
              <img className="xl:w-1/3 md:w-3/5 sm:w-4/5 w-full aspect-auto" src={LoginSvg} />
            </div>
        }
      </div>
    </div>
  )
}

export default App
