import React from 'react'
import Header from '../components/Header'
import { ArrowUpRight, CalendarDays, Clock, Coffee, IndianRupeeIcon, Package2, PackageOpen, PackagePlus, ReceiptIndianRupee, RotateCw, TrendingUp, TriangleExclamationPoint } from 'lucide-react'

const Dashboard = () => {
  return (
    <>
      <Header />

      <div className='bg-amber-100/60'>

        <div className='flex flex-col p-5'>

          <div className='flex items-center px-4 py-1 gap-0.5'>
            <Coffee size={15} className='text-amber-900' />
            <p className='text-xs font-bold text-amber-800'>Eren Coffee Bar</p>
          </div>

          <div className='flex justify-between items-center px-4 py-1 text-amber-950'>
            <p className='text-4xl font-bold font-serif'>Dashboard Overview</p>
            <button className='flex items-center font-semibold text-amber-950/70 gap-1 border border-gray-300 hover:border-gray-400 bg-gray-200 hover:bg-gray-200 px-2 py-1 rounded-3xl'><RotateCw size={15} />Refresh</button>
          </div>

          <div className='px-4 py-1 text-[14px] text-amber-950/70 font-normal'>
            <p>Welcome back! Here's what's happening at your coffee shop.</p>
          </div>

        </div>

        {/* top */}
        <div className='grid md:grid-cols-4 gap-5 py-4 px-9'>

          <div className='border border-gray-200 bg-gray-50 p-4 rounded-2xl transition hover:-translate-y-1 hover:shadow-lg'>
            <div className='flex justify-between items-center'>
              <p className=' bg-amber-900/7 p-2 rounded-xl'><IndianRupeeIcon size={19} className='text-amber-900' /></p>
              <p><ArrowUpRight /></p>
            </div>
            <p className='pb-2 pt-5'>Today's Sales</p>
            <p className='flex items-center text-2xl font-extrabold py-2'><IndianRupeeIcon size={22} strokeWidth={3} />0.00</p>
            <div className='flex justify-between items-center py-2'>
              <p className='text-xs text-amber-900/40 font-semibold'>0 bills generated</p>
              <p className='text-[10px] text-amber-900 font-semibold'>Daily revenue</p>
            </div>
          </div>

          <div className='border border-gray-200 bg-gray-50 p-4 rounded-2xl transition hover:-translate-y-1 hover:shadow-lg'>
            <div className='flex justify-between items-center'>
              <p className='bg-green-600/7 p-2 rounded-xl'><TrendingUp size={19} className='text-green-600' /></p>
              <p><ArrowUpRight /></p>
            </div>
            <p className='pb-2 pt-5'>Weekly Sales</p>
            <p className='flex items-center text-2xl font-extrabold py-2'><IndianRupeeIcon size={22} strokeWidth={3} />0.00</p>
            <div className='flex justify-between items-center py-2'>
              <p className='text-xs text-amber-900/40 font-semibold'>0 completed bills</p>
              <p className='text-[10px] text-amber-900 font-semibold'>Monday - Sunday</p>
            </div>
          </div>

          <div className='border border-gray-200 bg-gray-50 p-4 rounded-2xl transition hover:-translate-y-1 hover:shadow-lg'>
            <div className='flex justify-between items-center'>
              <p className='bg-blue-600/7 p-2 rounded-xl'><CalendarDays size={19} className='text-blue-700' /></p>
              <p><ArrowUpRight /></p>
            </div>
            <p className='pb-2 pt-5'>Monthly Sales</p>
            <p className='flex items-center text-2xl font-extrabold py-2'><IndianRupeeIcon size={22} strokeWidth={3} />0.00</p>
            <div className='flex justify-between items-center py-2'>
              <p className='text-xs text-amber-900/40 font-semibold'>0 completed bills</p>
              <p className='text-[10px] text-amber-900 font-semibold'>Current month</p>
            </div>
          </div>

          <div className='border border-gray-200 bg-gray-50 p-4 rounded-2xl transition hover:-translate-y-1 hover:shadow-lg'>
            <div className='flex justify-between items-center'>
              <p className='bg-red-600/7 p-2 rounded-xl'><Clock size={19} className='text-red-600' /></p>
              <p><ArrowUpRight /></p>
            </div>
            <p className='pb-2 pt-5'>Waiting Orders</p>
            <p className='flex items-center text-2xl font-extrabold py-2'><IndianRupeeIcon size={22} strokeWidth={3} />0.00</p>
            <div className='flex justify-between items-center py-2'>
              <p className='text-xs text-amber-900/40 font-semibold'>0 completed orders</p>
              <p className='text-[10px] text-amber-900 font-semibold'>Pending preparation</p>
            </div>
          </div>

        </div>

        {/* center */}
        <div className='py-8 px-9'>

          <div className='border border-gray-300 bg-amber-50 rounded-2xl'>

            <div className='flex justify-between items-center py-4 px-7'>
              <div>
                <p className='text-2xl font-semibold font-serif'>Stock Overview</p>
                <p className='text-xs'>Current inventory status.</p>
              </div>
              <div>
                <Package2 />
              </div>
            </div>

            <div className='grid md:grid-cols-4 gap-10 px-10 py-4'>

              <div className='border border-gray-300 bg-gray-50 rounded-2xl'>
                <p className='px-7 py-5'><Coffee className='text-amber-950/80' size={20} /></p>
                <p className='text-2xl font-extrabold px-7'>0</p>
                <p className='px-7 py-3 text-xs'>Total Products</p>
              </div>

              <div className='border border-gray-300 bg-gray-50 rounded-2xl'>
                <p className='px-7 py-5'><PackageOpen className='text-green-500' size={20} /></p>
                <p className='text-2xl font-extrabold px-7'>0</p>
                <p className='px-7 py-3 text-xs'>Available Stock</p>
              </div>

              <div className='border border-gray-300 bg-gray-50 rounded-2xl'>
                <p className='px-7 py-5'><TriangleExclamationPoint className='text-red-600' size={20} /></p>
                <p className='text-2xl font-extrabold px-7'>0</p>
                <p className='px-7 py-3 text-xs'>Low Stock</p>
              </div>

              <div className='border border-gray-300 bg-gray-50 rounded-2xl'>
                <p className='px-7 py-5'><Package2 className='text-blue-600' size={20} /></p>
                <p className='text-2xl font-extrabold px-7'>0</p>
                <p className='px-7 py-3 text-xs'>Out of Stock</p>
              </div>

            </div>

          </div>

        </div>

        {/* down */}
        <div className='grid md:grid-cols-2 gap-5 py-6 px-9'>

          <div className='border border-gray-200 bg-gray-50 rounded-2xl'>
            <div className='flex justify-between items-center py-4 px-7'>
              <div>
                <p className='text-2xl font-semibold font-serif text-amber-950'>Recent Sales</p>
                <p className='text-xs text-amber-950/60'>Latest customer transactions.</p>
              </div>
              <div>
                <ReceiptIndianRupee />
              </div>
            </div>
            <hr className='text-gray-300' />
            <div className='flex justify-center items-center flex-col h-45'>
              <ReceiptIndianRupee size={35} />
              <p className='text-sm font-bold text-gray-500'>No sales available</p>
              <p className='text-xs text-amber-950/60'>Completed bills will appear here.</p>
            </div>
          </div>

          <div className='border border-gray-200 bg-gray-50 rounded-2xl'>
            <div className='flex justify-between items-center py-4 px-7'>
              <div>
                <p className='text-2xl font-semibold font-serif text-amber-950'>Waiting Orders</p>
                <p className='text-xs text-amber-950/60'>Orders awaiting preparation or completion.</p>
              </div>
              <div>
                <Clock />
              </div>
            </div>
            <hr className='text-gray-300' />
            <div className='flex justify-center items-center flex-col h-45'>
              <Clock size={35} />
              <p className='text-sm font-bold text-gray-500'>No waiting orders</p>
              <p className='text-xs text-amber-950/60'>New pending orders will appear here.</p>
            </div>
          </div>

        </div>

        <hr className='text-gray-400 mx-5' />
        {/* footer */}
        <div className='flex justify-between items-center p-5 text-gray-500'>
          <p className='text-xs'>© 2026 Eren Coffee Bar. All rights reserved.</p>
          <p className='flex items-center text-xs gap-1'><Coffee size={12} />Premium Coffee Management System</p>
        </div>

      </div>

    </>
  )
}

export default Dashboard