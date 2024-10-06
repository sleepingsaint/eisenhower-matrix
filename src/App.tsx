import Navbar from "@/components/Navbar"
import Matrix from "@/components/Matrix"
import Sidebar from "@/components/Sidebar"

function App() {
  return (
    <div className="h-screen w-screen flex flex-col">
      <Navbar />
      <div className="w-full h-full flex">
        <Sidebar />
        <div className="w-full h-full relative">
          <Matrix />
        </div>
      </div>
    </div>
  )
}

export default App
