import { useEffect, useMemo, useState } from 'react'
import Header from '../components/Header'
import { Search } from 'lucide-react'
import Dropdown from '../components/Dropdown'
import Tablebill from '../components/Tablebill'
import AllFooter from '../components/AllFooter'

const Billhistory = () => {
  const [billHistory, setBillHistory] = useState([])
  const [billstaff, setBillstaff] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const loadBillHistory = () => {
      try {
        const savedHistory = JSON.parse(localStorage.getItem('bill_history') || '[]')
        setBillHistory(Array.isArray(savedHistory) ? savedHistory : [])
      } catch (error) {
        console.error('Bill history loading error:', error)
        setBillHistory([])
      }
    }

    loadBillHistory()
    window.addEventListener('storage', loadBillHistory)
    window.addEventListener('focus', loadBillHistory)

    return () => {
      window.removeEventListener('storage', loadBillHistory)
      window.removeEventListener('focus', loadBillHistory)
    }
  }, [])

  const visibleBills = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()

    return billHistory
      .map((bill) => {
        const products = Array.isArray(bill.products) ? bill.products : Array.isArray(bill.items) ? bill.items : []
        const productCount = bill.productCount ?? bill.numberOfProducts ?? products.reduce((total, product) => (total + Number(product?.quantity ?? product?.qty ?? 1)), 0)

        return {
          ...bill,
          customerName: bill.customerName ?? bill.customer_name ?? bill.customer?.name ?? '',
          productCount,
          numberOfProducts: productCount,
        }
      })
      .filter((bill) => {
        const matchesStaff = !billstaff || bill.staffName === billstaff
        const matchesSearch = !query || [bill.customerName, bill.staffName, bill.id]
          .some((value) => String(value ?? '').toLowerCase().includes(query))

        return matchesStaff && matchesSearch
      })
  }, [billHistory, billstaff, searchTerm])

  return (
    <>

      <Header />

      <div className='bg-amber-100/60'>

        {/* top */}
        <div className='flex justify-between items-center flex-col md:flex-row p-5 gap-3'>
          <div>
            <p className='text-[10px] font-extrabold text-amber-900'>View Bill History</p>
            <p className='text-4xl font-semibold font-serif text-amber-950'>Billing History</p>
          </div>
          <div className='flex items-center gap-2 border border-gray-300 bg-gray-100 p-2 rounded-xl hover:border-yellow-400 hover:shadow-md hover:ring-yellow-200 text-sm'>
            <Search size={15} />
            <input type="text" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder='Search bills...' aria-label='Search bill history' className='outline-none' />
          </div>
        </div>

        {/* Drop-down  */}
        <div className='border-b border-amber-100 bg-amber-100/30 px-5 py-3'>
          <label htmlFor='billing-staff' className='mb-1 block text-sm font-bold text-amber-900'>Select Staff name for views History</label>
          <Dropdown value={billstaff} onChange={(selection) => setBillstaff(selection?.target?.value ?? selection?.value ?? selection?.name ?? selection ?? '',)}
          />
        </div>

        {/* center */}
        <div className='pt-4 px-5'>
          <p className='text-xl font-bold text-amber-900'>Staff <span className='text-amber-950/70'>Bill History</span></p>
        </div>

        <div className='py-2 px-5'>
          <p className='text-xs font-bold font-serif text-amber-950'>Products Details</p>
        </div>

        {/* table */}
        <Tablebill bills={visibleBills} />

      {/* footer */}
        <AllFooter />

      </div>
    </>
  )
}

export default Billhistory