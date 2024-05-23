import Header from "./components/Header/Header"
import Reference from "./components/Reference/Reference"
import Sidebar from "./components/Sidebar/Sidebar"
import Sluzby from "./components/Sluzby/Sluzby"
import Uvod from "./components/Uvod/Uvod"

const App = () => {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute right-0 translate-y-[5%] translate-x-[20%]">
        <img src="/uvod-img.svg" className="big:w-[1000px] w-[700px]" alt="" />
        <div className="w-full h-80 bg-gradient-to-t to-transparent from-[#0D1117] -translate-y-[90%]">
        </div>
      </div>
      <div className="big:mx-48 lg:mx-20 mx-4 relative">
        <Header />
        <div className="flex gap-10 big:translate-y-[150px] ">
          <Sidebar />
          <div className="">
            <Uvod />
            <Sluzby />
            <Reference />
          </div>
        </div>
      </div>
    </div>

  )
}

export default App
