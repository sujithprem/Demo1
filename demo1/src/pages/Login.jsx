import { Astroid, Coffee, Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'

const Login = () => {

  const [eye,setEye] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    setEmailError('')
    setPasswordError('')

    if (!/^[a-z0-9._%+-]+@gmail\.com$/i.test(email.trim())) {
      setEmailError('Invalid pattern.')
      return
    }

    if (email.trim().toLowerCase() !== 'eren@gmail.com') {
      setEmailError('Invalid email.')
      return
    }

    if (!/^123$/.test(password)) {
      setPasswordError('Invalid pattern.')
      return
    }

    if (password === '123') {
      window.location.href = '/dashboard'
    } 
  }

  return (
    <>
      <div className='relative flex min-h-dvh w-full items-center justify-center overflow-hidden bg-[#120d0a]'>
        <div className='absolute inset-0 bg-white/10' />
        <div className='absolute top-20 h-50 w-50  rounded-full bg-yellow-500/10 blur-3xl' />

        <div className='relative w-[calc(100%-1.5rem)] max-w-md rounded-[32px] border border-yellow-500/30 bg-[#2b180f]/90 p-4 backdrop-blur-sm transition-all duration-300 hover:border-yellow-300/80 hover:shadow-[0_30px_90px_rgba(234,179,8,0.15)] sm:p-5'>
          <div className='pb-4 sm:pb-5'>
            <div className='flex items-center gap-4'>
              <div className='flex h-8 w-8 items-center justify-center rounded-2xl border border-yellow-300/40 bg-yellow-500 shadow-[0_8px_22px_rgba(250,204,21,0.5)]'>
                <Coffee size={15} className='text-amber-950' />
              </div>

              <div className='flex flex-1 items-center justify-between gap-3'>
                <div>
                  <p className='text-base font-extrabold text-amber-50'>EREN <span className='text-yellow-300'>Coffee</span></p>
                  <p className='text-[10px] font-bold text-yellow-500'>COFFEE BAR</p>
                </div>

                <div className='flex h-9 w-9 items-center justify-center rounded-full border border-yellow-300/50 bg-yellow-300/15 text-yellow-200'>
                  <Astroid size={14} />
                </div>
              </div>
            </div>
          </div>

          <div className='pb-5'>
            <p className='pb-2 text-3xl font-semibold font-serif text-amber-100'>Sign in</p>
            <p className='w-60 text-[10px] text-amber-50/60 md:w-80 md:text-xs'>
              Your coffee shop dashboard is waiting. Sign in to manage your daily business.
            </p>
          </div>

          <div className='space-y-4'>
            <div className='flex flex-col gap-1.5 text-sm font-semibold text-amber-50/80'>
              Email
              <div className='rounded-xl border border-amber-950 bg-amber-50/95 px-3 py-2 transition-all duration-200 hover:border-yellow-300 focus-within:border-yellow-400 focus-within:ring-2 focus-within:ring-yellow-300/30'>
                <input type='email' placeholder='you@example.com' pattern='[a-z0-9._%+-]+@gmail\.com' onChange={(event) => { setEmail(event.target.value); setEmailError('') }} className='w-full h-7 bg-transparent text-sm text-amber-950 placeholder:text-amber-900/45 outline-none' />
              </div>
              {emailError && <span className='text-sm text-red-400'>{emailError}</span>}
            </div>

            <div className='flex flex-col gap-1.5 text-sm font-semibold text-amber-50/80'>
              Password
              <div className='flex rounded-xl border border-amber-950 bg-amber-50/95 px-3 py-2 transition-all duration-200 hover:border-yellow-300 focus-within:border-yellow-400 focus-within:ring-2 focus-within:ring-yellow-300/30'>
                <input type={eye ? 'text' : 'password'} placeholder='••••••••' pattern='123' maxLength={6} onChange={(event) => {
                setPassword(event.target.value)
                 setPasswordError('')}} className='w-full h-7 bg-transparent text-sm text-amber-950 placeholder:text-amber-900/45 outline-none' />
                <button type='button' onClick={() => setEye(prev => !prev)} aria-label={eye ? 'Hide password' : 'Show password'} className='text-amber-950'>
                  {
                    eye ? (
                        <Eye size={18}/>
                    ) : (
                      <EyeOff size={18}/>
                    )
                  }
                </button>
              </div>
              {passwordError && <span className='text-sm text-red-400'>{passwordError}</span>}
            </div>
          </div>

          <div className='my-6'>
            <button onClick={handleSubmit} className='flex h-11 w-full items-center justify-center rounded-xl cursor-pointer border border-amber-300 bg-gradient-to-r from-yellow-300 to-amber-300 hover:border-yellow-600 font-semibold text-amber-950'>
              Login
            </button>
          </div>


          <div className='flex items-center gap-3 px-2 py-1'>
            <hr className='flex-1 border-amber-800/80' />
            <span className='text-[10px] uppercase tracking-[0.2em] text-amber-500/60'>Cafe</span>
            <hr className='flex-1 border-amber-800/80' />
          </div>

          <div className='flex justify-center pt-2 text-xs text-amber-50/50'>
            <p>© 2026 Eren Coffee Bar</p>
          </div>
        </div>
      </div>
    </>
  )
}

export default Login