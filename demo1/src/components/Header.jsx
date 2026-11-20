import { React, useState, useEffect } from 'react'
import { AlignVerticalJustifyEnd, BadgeIndianRupee, BookA, CoffeeIcon, LogOut, Menu, PackagePlus, PowerIcon, PowerOffIcon, TriangleExclamationPoint, UserPlus2 } from 'lucide-react'
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

    if (nextPower) {
      toast.success('Shop Open')
    } else {
      toast.error('Shop Closed')
    }
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
          <div className='flex list-none gap-5 text-xs lg:text-sm border border-amber-800 hover:border-yellow-400 py-4 lg:px-2 rounded-3xl text-yellow-300 font-bold'>
            <Link to='/dashboard'><li className='flex items-center gap-1 hover:bg-fuchsia-100 py-1 px-1 rounded-xl hover:text-black'><BookA size={19} /> Dashboard</li></Link>
            <Link to='/bill'><li className='flex items-center gap-1 hover:bg-fuchsia-100 py-1 px-1 rounded-xl hover:text-black'><BadgeIndianRupee size={19} /> Billing</li></Link>
            <Link to='/billhistory'><li className='flex items-center gap-1 hover:bg-fuchsia-100 py-1 px-1 rounded-xl hover:text-black'><AlignVerticalJustifyEnd size={19} />Bill History</li></Link>
            <Link to='/product'><li className='flex items-center gap-1 hover:bg-fuchsia-100 py-1 px-1 rounded-xl hover:text-black'><PackagePlus size={19} />Product-Management</li></Link>
            <Link to='/staff'><li className='flex items-center gap-1 hover:bg-fuchsia-100 py-1 px-1 rounded-xl hover:text-black'><UserPlus2 size={19} />Staff-Management</li></Link>
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
            <>
              <button
                type='button'
                aria-label='Close menu'
                onClick={() => setMenu(false)}
                className='fixed inset-0 z-40 bg-black/50 backdrop-blur-sm'
              />

              <aside className="fixed right-0 top-0 z-50 flex h-screen w-72 flex-col border-l border-yellow-500/20 bg-[#211914] shadow-2xl md:hidden">

                <div className="flex items-center justify-between border-b border-white/10 px-5 py-5">
                  <div className="flex items-center gap-3">
                    <p className="rounded-full bg-yellow-500 p-2"><CoffeeIcon size={18} className="text-amber-950" /></p>
                    <div>
                      <p className="text-sm font-extrabold text-white/90">EREN <span className="text-yellow-300">Coffee</span></p>
                      <p className="text-[10px] font-semibold tracking-widest text-yellow-500">COFFEE BAR</p>
                    </div>
                  </div>
                  <button onClick={() => setMenu(false)} type="button" aria-label="Close menu" className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-lg text-white transition hover:border-red-400/60 hover:bg-red-500/20 hover:text-red-300">×</button>
                </div>

                <p className="px-6 pt-5 text-xs font-semibold uppercase tracking-widest text-yellow-500/70">{formatTime}</p>

                <nav className="mt-3 flex flex-1 flex-col gap-2 px-4">
                  <Link onClick={() => setMenu(false)} to='/dashboard' className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-yellow-100 transition hover:bg-yellow-400/10 hover:text-yellow-300"><BookA size={18} /> Dashboard</Link>
                  <Link onClick={() => setMenu(false)} to='/bill' className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-yellow-100 transition hover:bg-yellow-400/10 hover:text-yellow-300"><BadgeIndianRupee size={18} /> Billing</Link>
                  <Link onClick={() => setMenu(false)} to='/billhistory' className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-yellow-100 transition hover:bg-yellow-400/10 hover:text-yellow-300"><AlignVerticalJustifyEnd size={18} />Bill History</Link>
                  <Link onClick={() => setMenu(false)} to='/product' className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-yellow-100 transition hover:bg-yellow-400/10 hover:text-yellow-300"><PackagePlus size={18} /> Products</Link>
                  <Link onClick={() => setMenu(false)} to='/staff' className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-yellow-100 transition hover:bg-yellow-400/10 hover:text-yellow-300"><UserPlus2 size={18} /> Staff</Link>
                </nav>

                <div className="flex items-center justify-between border-t border-white/10 px-5 py-5">
                  <button onClick={handlePowerToggle} type='button' aria-label={power ? 'Turn power off' : 'Turn power on'} className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${power ? 'border-green-700 bg-green-900/30 text-green-400' : 'border-red-700 bg-red-900/30 text-red-400'}`}>
                    {power ? <PowerIcon size={15} /> : <PowerOffIcon size={15} />}
                    {power ? 'Open' : 'Closed'}
                  </button>
                  <button onClick={handlelogout} type='button' aria-label='Log out' className="flex h-10 w-10 items-center justify-center rounded-full bg-red-700 text-white transition hover:bg-red-600"><LogOut size={16} /></button>
                </div>

                {log && (
                  <div className="fixed inset-0 z-60 flex items-center justify-center bg-[#21160f]/65 px-4 backdrop-blur-sm">
                    <div className='border border-gray-400 bg-gray-50 p-4'>
                      <p className='flex justify-center items-center gap-2 text-2xl font-bold font-serif'>Alert <span className='text-red-600'><TriangleExclamationPoint size={19}/></span></p>
                      <p className='px-2 py-3 text-green-800 font-semibold'>Are you really want to logout the account?</p>
                      <div className='flex justify-around items-center'>
                        <button onClick={() => setLog(false)} className='border border-blue-600 bg-blue-600 text-white p-2 rounded-2xl font-semibold hover:bg-blue-400 hover:font-bold'>Cancel</button>
                        <button onClick={() => { setLog(false); navigate('/') }} className='border border-red-700 bg-red-600 text-white p-2 rounded-2xl font-semibold hover:bg-red-400 hover:font-bold'>Yes,logout</button>
                      </div>
                    </div>
                  </div>
                )}
              </aside>
            </>
          )}
        </div>

      </div>
      <ToastContainer position='top-center' autoClose={2500} theme='colored' />
    </>
  )
}

export default Header