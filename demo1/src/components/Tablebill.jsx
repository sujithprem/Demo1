import { IndianRupee } from "lucide-react"

const Tablebill = ({ bills = [] }) => {
  return (
    <>
        <div className="overflow-hidden m-5 rounded-t-2xl border border-[#edb76f] bg-white shadow-[0_12px_40px_rgba(63,42,25,0.06)]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-187.5 border-collapse text-left">
              <thead>
                <tr className="bg-[#f4e0c5] text-[10px] font-extrabold uppercase tracking-[1.5px] text-[#5e4835]">
                  <th className="px-5 py-5">#</th>
                  <th className="px-5 py-5">Customer Name</th>
                  <th className="px-5 py-5">Purchase Date</th>
                  <th className="px-5 py-5">no of products</th>
                  <th className="px-5 py-5">Total price</th>
                </tr>
              </thead>
              <tbody className='bg-gray-50 font-extrabold'>
                {bills.map((bill, index) => {
                  const products = Array.isArray(bill.products) ? bill.products : Array.isArray(bill.items) ? bill.items : []
                  const productCount = bill.productCount ?? bill.numberOfProducts ?? products.reduce((total, product) => (total + Number(product?.quantity ?? product?.qty ?? 1)), 0)
                  const purchaseDate = bill.purchaseDate ?? bill.date
                  const totalPrice = bill.totalPrice ?? bill.total ?? bill.grandTotal
                  const customerName = bill.customerName ?? bill.customer_name ?? bill.customer?.name

                  return (
                    <tr key={bill.id ?? index} className='border border-amber-200 text-gray-700 hover:border-green-600 hover:bg-green-100/70'>
                      <td className='px-5 py-4'>{index + 1}</td>
                      <td className='px-5 py-4 text-sm text-green-600 font-extrabold'>{customerName || '—'}</td>
                      <td className='px-5 py-4 text-[11px] text-blue-600 font-extrabold'>{purchaseDate ? new Date(purchaseDate).toLocaleDateString() : '—'}</td>
                      <td className='px-5 py-4 text-sm text-amber-600 font-extrabold'>{productCount}</td>
                      <td className='flex items-center text-xs px-5 py-4 text-red-600 font-extrabold'><IndianRupee size={13}/>{totalPrice ?? '—'}</td>
                    </tr>
                  )
                })}
                {bills.length === 0 && (
                  <tr><td colSpan={5} className='px-5 py-6 text-center text-gray-500'>No bills found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
    </>
  )
}

export default Tablebill