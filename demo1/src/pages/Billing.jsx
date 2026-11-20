import { useEffect, useState } from 'react'
import Header from '../components/Header'
import { ArrowUpRight, CheckCircle2, IndianRupeeIcon, Minus, Plus, ReceiptText, RefreshCw, Search, ShoppingCart, Trash2 } from 'lucide-react'
import Dropdown from '../components/Dropdown'
import AllFooter from '../components/AllFooter'
import { toast } from 'react-toastify'

const STORAGE_KEY = 'coffee_products'
const BILL_HISTORY_KEY = 'bill_history'

const initialMenu = [{ id: 1, name: 'Espresso', price: 12, stock: 20 }, { id: 2, name: 'Americano', price: 23, stock: 18 }, { id: 3, name: 'Cappuccino', price: 14, stock: 15 }, { id: 4, name: 'Latte', price: 40, stock: 16 }, { id: 5, name: 'Mocha', price: 25, stock: 12 }, { id: 6, name: 'Macchiato', price: 35, stock: 10 }, { id: 7, name: 'Flat White', price: 34, stock: 14 }]

const Billing = () => {
  const [menu, setMenu] = useState(initialMenu)
  const [order, setOrder] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [bill, setBill] = useState(false)
  const [orderOpen, setOrderOpen] = useState(false)
  const [billstaff, setBillstaff] = useState('')
  const [customerName, setCustomerName] = useState('')

  const normalizedSearch = searchTerm.trim().toLowerCase()

  const filteredMenu = menu.filter((item) => {
    if (!normalizedSearch) return true

    const searchableText = [item.name, String(item.id), String(item.price), String(item.stock)].join(' ').toLowerCase()

    return searchableText.includes(normalizedSearch)
  })

  const addToOrder = (item) => {
    setOrder((currentOrder) => {
      const existingItem = currentOrder.find((orderItem) => orderItem.id === item.id)

      if (existingItem) {
        return currentOrder.map((orderItem) =>
          orderItem.id === item.id
            ? { ...orderItem, quantity: orderItem.quantity + 1 }
            : orderItem,
        )
      }

      return [...currentOrder, { ...item, quantity: 1 }]
    })
  }

  const updateQuantity = (itemId, change) => {
    setOrder((currentOrder) => currentOrder
      .map((item) => item.id === itemId ? { ...item, quantity: item.quantity + change } : item)
      .filter((item) => item.quantity > 0))
  }

  const subtotal = order.reduce((total, item) => total + item.price * item.quantity, 0)
  const tax = subtotal * 0.08
  const itemCount = order.reduce((total, item) => total + item.quantity, 0)

  useEffect(() => {
    const loadProducts = () => {
      try {
        const storedProducts = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
        const products = Array.isArray(storedProducts) ? storedProducts : []

        const addedItems = products
          .filter((product) => product && product.isAvailable !== false)
          .map((product, index) => {
            const id = product.id ?? product._id ?? index

            return {
              id: `product-${id}`,
              name: String(product.name ?? product.productName ?? '').trim(),
              price: Number(product.rate ?? product.price ?? product.salePrice ?? 0),
              stock: Number(product.stock ?? product.quantity ?? 20),
            }
          })
          .filter((product) => product.name)

        setMenu((previous) => {
          return [
            ...previous.filter((item) => !String(item.id).startsWith('product-')),
            ...addedItems,
          ]
        })
      } catch (error) {
        console.error('Product loading error:', error)
      }
    }

    loadProducts()

    window.addEventListener('storage', loadProducts)
    window.addEventListener('focus', loadProducts)

    return () => {
      window.removeEventListener('storage', loadProducts)
      window.removeEventListener('focus', loadProducts)
    }
  }, [])

  const handlebill = () => {
    const billRecord = { id: `${Date.now()}`, date: new Date().toISOString(), customerName: customerName.trim(), staffName: billstaff, itemCount, productCount: order.length, purchasedQuantity: itemCount, quantity: itemCount, items: order.map(({ id, name, price, quantity }) => ({ id, name, price, quantity })), subtotal, tax, total: subtotal + tax, }

    try {
      const history = JSON.parse(localStorage.getItem(BILL_HISTORY_KEY) || '[]')
      localStorage.setItem(BILL_HISTORY_KEY, JSON.stringify([
        ...(Array.isArray(history) ? history : []),
        billRecord,
      ]))
    } catch (error) {
      console.error('Bill history save error:', error)
    }

    setBill(true)
  }

  return (
    <>
      <div className='lg:fixed inset-x-0 top-0 z-50'><Header /></div>

      {/* top */}
      <div className='min-h-screen bg-amber-100/60 pb-20 md:pb-0 lg:pt-12'>
        <div className='mx-auto max-w-[1600px] px-4 pt-6 sm:px-6 lg:px-8'>
          <div className='flex flex-col-reverse gap-8 xl:flex-row xl:items-start xl:justify-between'>
            <div className='flex-1'>
              <div className='p-4 sm:p-6 lg:p-6'>
                <p className='py-2 text-xs font-extrabold tracking-[0.18em] text-amber-900/70'>Our Collection</p>
                <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
                  <p className='text-3xl font-bold font-serif text-amber-950 sm:text-4xl'>Coffee Menu</p>
                  <button className='flex items-center border border-amber-200 bg-white/90 px-3 py-2 shadow-sm ring-1 ring-transparent transition duration-200 hover:border-yellow-400 hover:shadow-md hover:ring-yellow-200 rounded-xl'>
                    <Search size={15} className='text-amber-800' />
                    <input type='text' value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder='Search' aria-label='Search products' className='w-28 border-0 bg-transparent px-2 text-sm text-amber-950 outline-none placeholder:text-amber-700/60' />
                  </button>
                </div>
                <p className='py-2 text-xs text-gray-500'>Discover your favourite coffee.</p>
              </div>

              {/* product */}
              <div className='grid gap-7 p-4 sm:p-6 grid-cols-2 md:grid-cols-4 lg:pb-7 xl:grid-cols-5 2xl:grid-cols-6 lg:max-h-80 lg:overflow-auto lg:scrollbar-none'>
                {filteredMenu.map((item) => (
                  <div key={item.id} className='group flex flex-col rounded-3xl border border-amber-300 bg-gradient-to-br from-yellow-50 via-white to-amber-100 p-2.5 shadow-lg hover:shadow-2xl hover:border-amber-700 transition-all duration-300 hover:scale-105 relative overflow-hidden'>

                    <div className="absolute -top-8 -right-8 w-24 h-24 bg-yellow-200 rounded-full opacity-40 group-hover:scale-10 transition-transform duration-300 z-0" />

                    <div className='flex flex-col items-center justify-center py-4 z-10'>
                      <p className='flex items-center text-base font-bold text-green-700 gap-2 font-serif'><span>{item.name}</span></p>
                      <p className='flex items-center text-lg mt-1'>
                        <IndianRupeeIcon size={15} className='text-amber-800' />
                        <span className='text-red-500 font-extrabold ml-1'>{item.price}</span>
                      </p>
                    </div>

                    <div className='mt-auto flex items-center justify-center z-10'>
                      <button onClick={() => addToOrder(item)} className='flex items-center gap-1 rounded-xl border border-amber-900 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-200 px-4 py-2 text-[13px] font-bold text-amber-950 shadow-md transition-all duration-200 hover:bg-yellow-400 hover:text-amber-900 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-yellow-400'> <Plus size={15} /> Add</button>
                    </div>
                  </div>
                ))}
                {filteredMenu.length === 0 && (
                  <p className='col-span-full py-8 text-center text-sm text-amber-800/70'>No products found.</p>
                )}
              </div>
            </div>

            {/* mobile screen bill nav */}
            <nav aria-label='Billing order bar' className='fixed inset-x-0 bottom-0 z-40 border-t border-amber-900/20 bg-[#21160f] px-3 py-2.5 shadow-[0_-8px_24px_rgba(33,22,15,0.18)] md:hidden'>
              <div className='mx-auto flex max-w-[1600px] items-center justify-between gap-3'>
                <button type='button' onClick={() => setOrderOpen(true)} aria-label='Open current order' className='flex min-w-0 items-center gap-3 text-left'>
                  <span className='relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-yellow-400 text-amber-950'><ShoppingCart size={21} /><span className='absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-500 px-1 text-[10px] font-bold text-white'>{itemCount}</span></span>
                  <span className='min-w-0'><span className='block truncate text-sm font-extrabold text-white'>₹{(subtotal + tax).toFixed(2)}</span><span className='block truncate text-[10px] text-amber-100/70'>{itemCount} {itemCount === 1 ? 'item' : 'items'} · Current order</span></span></button>
                <button type='button' onClick={() => setOrderOpen(true)} className='flex shrink-0 items-center gap-1.5 rounded-xl bg-yellow-400 px-4 py-3 text-xs font-extrabold text-amber-950 transition hover:bg-yellow-300'>View order <ArrowUpRight size={14} /></button>
              </div>
            </nav>

            {/* billing box */}
            <div onClick={() => setOrderOpen(false)} className={`w-full xl:max-w-90 xl:pt-6 ${orderOpen ? 'fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4' : 'hidden'} md:block`}>
              <div className='lg:w-90 p-4 sm:p-6 lg:p-8 xl:p-0'>
                <div onClick={(event) => event.stopPropagation()} className='overflow-y-auto scrollbar-none rounded-2xl border border-amber-900/10 bg-[#fffdf9] shadow-[0_20px_40px_rgba(75,45,25,0.12)] lg:h-[calc(100vh-6.5rem)] xl:sticky xl:top-8'>
                  <div className='relative flex w-full items-center justify-between gap-3 overflow-hidden bg-amber-950/90 px-5 py-3 sm:px-6'>
                    <div className='flex items-center gap-3'>
                      <p className='rounded-xl border border-amber-100/10 bg-yellow-300 p-2.5 text-[#4b2c0a]'><ShoppingCart size={20} /></p>
                      <div>
                        <p className='font-bold font-serif text-white'>Current Order</p>
                        <p className='mt-1 text-[9px] tracking-wide text-amber-100/60'>EREN COFFEE BAR</p>
                      </div>
                    </div>
                    <p className='flex md:h-9 md:min-w-9 items-center justify-center rounded-full bg-[#eedb07] px-2 text-sm font-bold text-[#2f1d13]'>{order.reduce((total, item) => total + item.quantity, 0)}</p>
                    <button type='button' onClick={() => setOrderOpen(false)} aria-label='Close current order' className='rounded-full p-2 text-white hover:bg-white/10 md:hidden'>X</button>
                  </div>

                  <div className='flex items-center justify-between border-b border-amber-100 px-5 py-2'>
                    <p className='flex items-center gap-2 text-[10px] font-extrabold tracking-[0.14em] text-amber-900'><ReceiptText size={14} /> ORDER ITEMS</p>
                    <button type='button' onClick={() => setOrder([])} className='flex items-center gap-1 text-[10px] font-semibold text-amber-800/70 transition hover:text-red-700'><RefreshCw size={12} /> Clear all</button>
                  </div>
                  <div className='border-b border-amber-100 bg-white px-5 py-3'>
                    <div>
                      <label htmlFor='billing-customer-name' className='mb-1 block text-[10px] font-bold text-amber-900'>Customer name</label>
                      <input id='billing-customer-name' type='text' value={customerName} onChange={(event) => setCustomerName(event.target.value)} placeholder='Enter customer name' className='w-full rounded-lg border border-amber-900/20 bg-white px-3 py-2 text-xs text-amber-950 outline-none transition placeholder:text-amber-700/50 focus:border-amber-700 focus:ring-1 focus:ring-amber-300'/>
                    </div>
                    <div className='mt-3'>
                      <label htmlFor='billing-staff' className='mb-1 block text-[10px] font-bold text-amber-900'>Billing staff</label>
                      <Dropdown value={billstaff} onChange={(selection) => setBillstaff(selection?.target?.value ?? selection?.value ?? selection?.name ?? selection ?? '',)}/>
                    </div>
                  </div>
                  <div className='space-y-3 bg-white px-5 py-4'>
                    {order.length === 0 ? (
                      <p className='py-6 text-center text-xs text-stone-400'>Your order is empty. Add a coffee to get started.</p>
                    ) : order.map((item) => (
                      <div key={item.id} className='rounded-xl border border-amber-900/10 bg-[#fcfaf7] p-3'>
                        <div className='flex items-start justify-between gap-2'>
                          <div><p className='text-xs font-bold text-[#39271c]'></p><p className='mt-1 text-[9px] text-stone-500 gap-2'><span className='text-black font-bold'>{item.name}</span> <span>₹{Number(item.price).toFixed(2)} / unit</span></p></div>
                          <button type='button' onClick={() => setOrder((currentOrder) => currentOrder.filter((orderItem) => orderItem.id !== item.id))} aria-label={`Remove ${item.name}`} className='p-1 text-stone-400 transition hover:text-red-600'><Trash2 size={14} /></button>
                        </div>
                        <div className='mt-3 flex items-center justify-between'>
                          <div className='flex items-center gap-3 rounded-lg border border-amber-900/10 bg-white px-2 py-1'>
                            <button type='button' onClick={() => updateQuantity(item.id, -1)} aria-label={`Decrease ${item.name} quantity`} className='text-stone-500 hover:text-amber-900'><Minus size={12} /></button>
                            <span className='min-w-3 text-center text-[11px] font-bold text-[#39271c]'>{item.quantity}</span>
                            <button type='button' onClick={() => updateQuantity(item.id, 1)} aria-label={`Increase ${item.name} quantity`} className='text-stone-500 hover:text-amber-900'><Plus size={12} /></button>
                          </div>
                          <span className='text-xs font-bold text-[#68462e]'>₹{(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className='space-y-3 border-t border-dashed border-amber-900/15 bg-white px-5 py-4'>
                    <div className='flex justify-between text-[10px] text-stone-500'><span>Subtotal ({order.reduce((total, item) => total + item.quantity, 0)} items)</span><span className='font-semibold text-[#39271c]'>₹{subtotal.toFixed(2)}</span></div>
                    <div className='flex justify-between text-[10px] text-stone-500'><span>GST (8%)</span><span className='font-semibold text-[#39271c]'>₹{tax.toFixed(2)}</span></div>
                    <div className='md:flex items-center justify-between hidden md:block rounded-2xl bg-[#f4ebdf] p-4'>
                      <div><p className='text-[9px] font-extrabold tracking-[0.14em] text-[#9b7a5c]'>GRAND TOTAL</p><p className='mt-1 text-sm font-extrabold text-[#39271c]'>₹{(subtotal + tax).toFixed(2)}</p></div>
                      <span className='rounded-xl bg-amber-950/90 p-3 text-[#edf904]'><IndianRupeeIcon size={15} /></span>
                    </div>
                    <button onClick={handlebill} type='button' disabled={order.length === 0} className='flex w-full items-center justify-center gap-2 rounded-xl bg-amber-950/90 px-4 py-3.5 text-[10px] font-extrabold text-white shadow-lg transition hover:bg-[#472c1a] disabled:cursor-not-allowed disabled:opacity-50'>GENERATE CUSTOMER BILL <ArrowUpRight size={14} /></button>
                    <p className='flex items-center justify-center gap-1.5 pt-1 text-[9px] text-stone-400'><CheckCircle2 size={11} className='text-emerald-500' /> Stock updates after generating the bill.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* add product bill */}
          {
            bill && (
              <div className='fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#21160f]/75 px-4 py-4 backdrop-blur-sm'>
                <style>{`@media print { @page { size: 3in auto; margin: 0; } body { margin: 0 !important; } body * { visibility: hidden !important; } #print-receipt, #print-receipt * { visibility: visible !important; } #print-receipt { position: absolute !important; top: 0 !important; left: 0 !important; width: 3in !important; max-width: 3in !important; margin: 0 !important; padding: 0.15in !important; border: 0 !important; border-radius: 0 !important; box-shadow: none !important; background: white !important; color: black !important; } .receipt-actions { display: none !important; } }`}</style>
                <div id='print-receipt' className='w-full max-w-sm rounded-xl bg-white p-6 text-stone-900 shadow-2xl'>
                  <div className='text-center'>
                    <p className='text-lg font-bold'>EREN COFFEE BAR</p>
                    <p className=' text-xs'>Crafted with passion. Served with love.</p>
                    <p className='mt-1 border-y border-dashed border-stone-400 py-2 text-sm font-bold'>CUSTOMER RECEIPT</p>
                    <p className='mt-1 text-xs'>{new Date().toLocaleString()}</p>
                  </div>
                  <div className='my-4 space-y-2 border-b border-dashed border-stone-400 pb-4 text-xs'>
                    <div className='grid grid-cols-[1fr_auto_auto] gap-3 border-b border-stone-300 pb-2 font-bold'>
                      <span>Item</span><span>Qty</span><span className='text-right'>Amount</span>
                    </div>
                    {order.map((item) => (
                      <div key={item.id} className='grid grid-cols-[1fr_auto_auto] gap-3'>
                        <span>{item.name}</span><span>{item.quantity}</span><span className='text-right'>₹{(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <div className='space-y-2 text-xs'>
                    <div className='flex justify-between'><span>Subtotal</span><span>₹{subtotal.toFixed(1)}</span></div>
                    <div className='flex justify-between'><span>CGST (5%)</span><span>₹{tax.toFixed(0.5)}</span></div>
                    <div className='flex justify-between'><span>SGST (5%)</span><span>₹{tax.toFixed(0.5)}</span></div>
                    <div className='flex justify-between border-t border-dashed border-stone-400 pt-2 text-sm font-bold'><span>Grand Total</span><span>₹{(subtotal + tax).toFixed(2)}</span></div>
                  </div>
                  <p className='mt-5 text-center text-xs'>Thank you. Please visit again!</p>
                  <div className='receipt-actions mt-5 flex gap-3'>
                    <button type='button' onClick={() => window.print()} className='flex-1 rounded-lg bg-amber-950 px-4 py-2 text-sm font-semibold text-white'>Print the Bill</button>
                    <button type='button' onClick={() => setBill(false)} className='rounded-lg border border-stone-300 px-4 py-2 text-sm font-semibold'>Close</button>
                  </div>
                </div>
              </div>
            )
          }

        </div>
      </div>
    </>
  )
}

export default Billing