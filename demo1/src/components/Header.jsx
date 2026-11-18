import { BadgeIndianRupee, BookA, CoffeeIcon, LogOut, Menu, PackagePlus, PowerIcon, PowerOffIcon, TriangleExclamationPoint } from 'lucide-react'
import { React, useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const Header = () => {

  const [currentTime, setCurrentTime] = useState(new Date())
  const [menu, setMenu] = useState(false)
  const [power, setPower] = useState(true)
  const [log, setLog] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTime = currentTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })
  const handlemenu = () => {
    setMenu((isOpen) => !isOpen)
  }

  const handlelogout = () => {
    setLog(!log)
  }


  const handlePowerToggle = () => {
    const nextPower = !power
    setPower(nextPower)
    toast[nextPower ? 'success' : 'error'](nextPower ? 'Shop Open' : 'Shop Closed')
  }

  return (
    <>
      <div className='flex justify-between items-center px-7 py-4 bg-amber-950'>

        <div className='flex items-center gap-4'>
          <p className='border border-amber-950 p-2 rounded-3xl bg-yellow-500'><CoffeeIcon size={20} className='text-amber-950' /></p>
          <div>
            <p className='text-sm md:text-base font-extrabold text-white/80'>EREN <span className='text-yellow-300'>Coffee</span></p>
            <p className='text-sm font-semibold text-yellow-500'>COFFEE BAR</p>
          </div>
          <p className='font-bold text-yellow-400'>{formatTime}</p>
        </div>

        <div className='hidden md:block'>
          <div className='flex list-none gap-5 text-xs lg:text-sm border border-amber-800 hover:border-yellow-400 py-4 lg:px-7 rounded-4xl text-yellow-300 font-bold'>
            <Link to='/dashboard'><li className='flex items-center gap-1 hover:bg-fuchsia-100 py-1 px-3 rounded-3xl hover:text-black'><BookA size={19} /> Dashboard</li></Link>
            <Link to='/bill'><li className='flex items-center gap-1 hover:bg-fuchsia-100 py-1 px-3 rounded-3xl hover:text-black'><BadgeIndianRupee size={19} /> Billing</li></Link>
            <Link to='/product'><li className='flex items-center gap-1 hover:bg-fuchsia-100 py-1 px-3 rounded-3xl hover:text-black'><PackagePlus size={19} /> Products</li></Link>
          </div>
        </div>

        <div className='hidden md:block'>
          <div className='flex list-none gap-5'>
            <button onClick={handlePowerToggle} type='button' aria-label={power ? 'Turn power off' : 'Turn power on'} className={`border p-2 rounded-3xl ${power ? 'border-green-700 bg-green-900/30 text-green-400' : 'border-red-700 bg-red-900/30 text-red-400'}`}>{power ? <PowerIcon size={13} /> : <PowerOffIcon size={13} />}</button>
            <button onClick={handlelogout} type='button' aria-label='Log out' className='border border-red-700 bg-red-600 text-white p-2 rounded-3xl'><LogOut size={20} /></button>
            {
              log && (
                <div>
                  <div className="fixed inset-0 z-60 flex items-center justify-center bg-[#21160f]/65 px-4 backdrop-blur-sm">
                    <div className='border border-gray-400 bg-gray-50 p-4'>
                      <div>
                        <p className='flex justify-center items-center gap-2 text-2xl font-bold font-serif'>Alert <span className='text-red-600'><TriangleExclamationPoint size={19}/></span></p>
                        <p className='px-2 py-3 text-green-800 font-semibold'>Are you really want to logout the account?</p>
                        <div className='flex justify-around items-center'>
                          <button onClick={() => setLog(false)} className='border border-blue-600 bg-blue-600 text-white p-2 rounded-2xl font-semibold hover:bg-blue-400 hover:font-bold'>Cancel</button>
                          <button onClick={() => { setLog(false); navigate('/') }} className='border border-red-700 bg-red-600 text-white p-2 rounded-2xl font-semibold hover:bg-red-400 hover:font-bold'>Yes,logout</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            }
          </div>
        </div>

        <div className='block md:hidden text-yellow-400'>
          <button onClick={handlemenu}><Menu /></button>

          {menu && (
            <div className="fixed right-0 top-0 z-50 h-screen w-60 border-l border-gray-700 bg-[#211914] p-4 shadow-2xl xl:hidden">

              <div className="mb-4 flex items-center justify-between flex-col gap-3">

                <div className='flex items-center gap-19'>
                  <p className="font-semibold">{formatTime}</p>
                  <button onClick={() => setMenu(false)} className='text-white hover:text-amber-200 hover:bg-red-500/30 px-1.5'>X</button>
                </div>

                <div className='flex items-center gap-4 p-3'>
                  <p className='text-sm md:text-base font-extrabold text-white/80'>EREN <span className='text-yellow-300'>Coffee</span></p>
                  <p className='text-xs font-semibold text-yellow-500'>COFFEE BAR</p>
                </div>

                <div className='p-5'>
                  <Link to='/dashboard'><li className='flex items-center gap-1 pb-4 px-3 rounded-3xl hover:underline'><BookA size={15} /> Dashboard</li></Link>
                  <Link to='/bill'><li className='flex items-center gap-1 pb-4 px-3 rounded-3xl hover:underline'><BadgeIndianRupee size={15} /> Billing</li></Link>
                  <Link to='/product'><li className='flex items-center gap-1 pb-4 px-3 rounded-3xl hover:underline'><PackagePlus size={15} /> Products</li></Link>
                </div>

              </div>

              <div className='flex justify-around'>
                <button onClick={handlePowerToggle} type='button' aria-label={power ? 'Turn power off' : 'Turn power on'} className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${power ? 'border-green-700 bg-green-900/30 text-green-400' : 'border-red-700 bg-red-900/30 text-red-400'}`}>
                  {power ? <PowerIcon size={15} /> : <PowerOffIcon size={15} />}
                </button>
                <button onClick={handlelogout} type='logout' className=" gap-2 rounded-lg bg-red-700 px-4 py-3 font-semibold text-white hover:bg-red-800"> <LogOut size={15} /></button>
                {
              log && (
                <div>
                  <div className="fixed inset-0 z-60 flex items-center justify-center bg-[#21160f]/65 px-4 backdrop-blur-sm">
                    <div className='border border-gray-400 bg-gray-50 p-4'>
                      <div>
                        <p className='flex justify-center items-center gap-2 text-2xl font-bold font-serif'>Alert <span className='text-red-600'><TriangleExclamationPoint size={19}/></span></p>
                        <p className='px-2 py-3 text-green-800 font-semibold'>Are you really want to logout the account?</p>
                        <div className='flex justify-around items-center'>
                          <button onClick={() => setLog(false)} className='border border-blue-600 bg-blue-600 text-white p-2 rounded-2xl font-semibold hover:bg-blue-400 hover:font-bold'>Cancel</button>
                          <button onClick={() => { setLog(false); navigate('/') }} className='border border-red-700 bg-red-600 text-white p-2 rounded-2xl font-semibold hover:bg-red-400 hover:font-bold'>Yes,logout</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            }
              </div>

            </div>
          )}
        </div>

      </div>
      <ToastContainer position='top-center' autoClose={2500} theme='colored' />
    </>
  )
}

export default Header