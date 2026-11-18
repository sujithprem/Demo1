
import { useEffect, useMemo, useState } from 'react'
import Header from '../components/Header'
import {
  Coffee,
  Plus,
  Search,
  Eye,
  Edit3,
  Trash2,
  X,
  Loader2,
  Package,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Package2,
  PowerIcon,
  PowerOff
} from 'lucide-react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const STORAGE_KEY = 'coffee_products'
const PRODUCTS_PER_PAGE = 10

const emptyForm = { name: '', rate: '', gst: '5' }

const Products = () => {

  const [products, setProducts] = useState([])
  const [form, setForm] = useState({ ...emptyForm })
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [viewProduct, setViewProduct] = useState(null)
  const [deleteProductData, setDeleteProductData] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const isEditing = editingId !== null

  useEffect(() => {
    try {
      const storedProducts = JSON.parse(
        localStorage.getItem(STORAGE_KEY) || '[]'
      )

      setProducts(
        Array.isArray(storedProducts) ? storedProducts : []
      )
    } catch (error) {
      console.error(error)
      setProducts([])
      toast.error('Unable to load products')
    } finally {
      setLoading(false)
    }
  }, [])

  const saveLocalProducts = (updatedProducts) => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(updatedProducts)
    )

    setProducts(updatedProducts)
  }

  const openAddModal = () => {
    setEditingId(null)
    setForm({ ...emptyForm })
    setIsModalOpen(true)
  }

  const openEditModal = (product) => {
    setEditingId(product.id)

    setForm({
      name: product.name || '',
      rate: String(product.rate ?? product.price ?? ''),
      gst: String(product.gst ?? 5)
    })

    setIsModalOpen(true)
  }

  const closeModal = () => {
    if (saving) return

    setIsModalOpen(false)
    setEditingId(null)
    setForm({ ...emptyForm })
  }

  const handleChange = (e) => {
    const { name, value } = e.target

    setForm(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const productName = form.name.trim()
    const rateNum = Number(form.rate)
    const gstNum = Number(form.gst)

    if (!productName) {
      toast.warning('Please enter product name')
      return
    }

    if (!Number.isFinite(rateNum) || rateNum <= 0) {
      toast.warning('Please enter a valid price')
      return
    }

    if (
      !Number.isFinite(gstNum) ||
      gstNum < 0 ||
      gstNum > 100
    ) {
      toast.warning('Please enter a valid GST rate')
      return
    }

    const productData = {
      name: productName,
      rate: rateNum,
      price: rateNum,
      gst: gstNum
    }

    try {
      setSaving(true)

      let updatedProducts

      if (isEditing) {

        updatedProducts = products.map(product =>
          product.id === editingId
            ? { ...product, ...productData }
            : product
        )

      } else {

        const newProduct = {
          id: crypto.randomUUID(),
          ...productData,
          isAvailable: true,
          createdAt: new Date().toISOString()
        }

        updatedProducts = [newProduct, ...products]

        setCurrentPage(1)
      }

      saveLocalProducts(updatedProducts)

      toast.success(
        isEditing
          ? 'Product updated successfully!'
          : 'Product added successfully!'
      )

      setIsModalOpen(false)
      setEditingId(null)
      setForm({ ...emptyForm })

    } catch (error) {
      console.error(error)
      toast.error('Unable to save product')
    } finally {
      setSaving(false)
    }
  }

  const toggleAvailability = (product) => {

    const newStatus = product.isAvailable === false

    const updatedProducts = products.map(item =>
      item.id === product.id
        ? { ...item, isAvailable: newStatus }
        : item
    )

    try {
      saveLocalProducts(updatedProducts)

      toast.success(
        `${product.name} is now ${newStatus ? 'Active' : 'Inactive'}`
      )
    } catch (error) {
      console.error(error)
      toast.error('Unable to update status')
    }
  }

  const openDeletePopup = (product) => {
    setDeleteProductData(product)
  }

  const closeDeletePopup = () => {
    if (deleting) return

    setDeleteProductData(null)
  }

  const confirmDeleteProduct = () => {

    if (!deleteProductData) return

    try {
      setDeleting(true)

      const updatedProducts = products.filter(
        item => item.id !== deleteProductData.id
      )

      saveLocalProducts(updatedProducts)

      toast.success('Product deleted successfully!')

      setDeleteProductData(null)

    } catch (error) {
      console.error(error)
      toast.error('Unable to delete product')
    } finally {
      setDeleting(false)
    }
  }

  const filteredProducts = useMemo(() => {

    const search = searchQuery.toLowerCase().trim()

    return products.filter(product => {

      const searchableValues = [
        product.name,
        product.rate ?? product.price,
        product.gst
      ]

      return searchableValues.some(value =>
        String(value ?? '').toLowerCase().includes(search)
      )
    })

  }, [products, searchQuery])

  const totalPages = Math.ceil(
    filteredProducts.length / PRODUCTS_PER_PAGE
  )

  useEffect(() => {

    if (totalPages === 0) {
      setCurrentPage(1)
    } else if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }

  }, [currentPage, totalPages])

  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE

  const currentProducts = filteredProducts.slice(
    startIndex,
    startIndex + PRODUCTS_PER_PAGE
  )

  const goToPage = (page) => {
    setCurrentPage(
      Math.max(1, Math.min(page, totalPages))
    )
  }

  const inputClass =
    'w-full rounded-xl border border-[#e8ded1] bg-[#fffdf9] px-3.5 py-2.5 text-sm text-[#34251c] outline-none transition focus:border-[#9b6b46] focus:ring-4 focus:ring-[#9b6b46]/10 placeholder:text-[#b5a99c]'

  const labelClass =
    'grid gap-1.5 text-xs font-semibold text-[#514033]'

  const cellClass = 'px-5 py-4'

  return (
    <>
      <Header />

      <ToastContainer
        position="top-center"
        autoClose={2500}
        theme="colored"
      />

      <main className="min-h-screen bg-amber-100/60 px-4 py-8 text-[#30231b] sm:px-6 lg:px-8">

        <div className="mx-auto max-w-312.5">

          <section className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">

            <div>
              <div className="mb-2 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#b57b50]" />

                <p className="text-[10px] font-bold uppercase tracking-[2px] text-[#7b461d]">
                  Coffee Shop Management
                </p>
              </div>

              <h1 className="font-serif text-3xl font-bold text-[#38281e] sm:text-4xl">
                Product Management
              </h1>

              <p className="mt-2 text-sm text-[#383634]">
                Manage your coffee menu, pricing and availability.
              </p>
            </div>

            <div className="relative w-full py-3.5 sm:max-w-sm">

                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9b806b]"
                />

                <input
                  type="search"
                  placeholder="Search coffee products..."
                  value={searchQuery}
                  onChange={e => {
                    setSearchQuery(e.target.value)
                    setCurrentPage(1)
                  }}
                  className={`${inputClass} pl-11`}
                />

              </div>

            <button
              type="button"
              onClick={openAddModal}
              className="flex items-center justify-center gap-2 rounded-xl bg-[#68452f] px-6 py-3.5 text-sm font-semibold text-white shadow-lg transition hover:bg-[#523724]"
            >
              <Plus size={18} />
              Add New Product
            </button>

          </section>

          <section>

            <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

              <div>
                <h2 className="font-serif text-2xl font-semibold text-[#38281e]">
                  Product Table
                </h2>

                <p className="mt-1 text-xs text-[#4a4847]">
                  Your complete product collection.
                </p>
              </div>

            </div>

            <div className="overflow-hidden rounded-2xl border border-[#edb76f] bg-white shadow-[0_12px_40px_rgba(63,42,25,0.06)]">

              {loading ? (

                <div className="flex flex-col items-center justify-center py-24">
                  <Loader2 size={35} className="animate-spin text-[#9b6b46]" />

                  <p className="mt-4 text-sm font-semibold text-[#806f60]">
                    Brewing your product collection...
                  </p>
                </div>

              ) : filteredProducts.length > 0 ? (

                <>

                  <div className="overflow-x-auto">

                    <table className="w-full min-w-187.5 border-collapse text-left">

                      <thead>
                        <tr className="bg-[#f4e0c5] text-[10px] font-extrabold uppercase tracking-[1.5px] text-[#80664f]">
                          <th className="px-5 py-5">#</th>
                          <th className="px-5 py-5">Product Details</th>
                          <th className="px-5 py-5">Price</th>
                          <th className="px-5 py-5">GST</th>
                          <th className="px-5 py-5">Status</th>
                          <th className="px-5 py-5 text-right">Actions</th>
                        </tr>
                      </thead>

                      <tbody>

                        {currentProducts.map((product, index) => {

                          const rate = product.rate ?? product.price ?? 0
                          const gst = product.gst ?? 5
                          const isActive = product.isAvailable !== false

                          return (
                            <tr
                              key={product.id}
                              className="border-t border-[#e1a055] bg-[#ebeed817] text-sm transition hover:bg-[#e0dfde]"
                            >

                              <td className={`${cellClass} font-semibold text-[#a18c79]`}>
                                {String(startIndex + index + 1).padStart(2, '0')}
                              </td>

                              <td className={cellClass}>
                                <div className="flex items-center gap-3">

                                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-amber-800/30 from-[#f5e8d8] to-[#e8d2ba] text-[#68452f]">
                                    <Package2 size={15} />
                                  </div>

                                  <div>
                                    <p className="items-center text-base font-extrabold text-[#4b1c04]">
                                      {product.name}
                                    </p>

                                  </div>

                                </div>
                              </td>

                              <td className={`${cellClass} font-extrabold text-[#f50a0a]`}>
                                ₹{Number(rate).toFixed(2)}
                              </td>

                              <td className={cellClass}>
                                <span className="rounded-lg bg-[#f5f0e8] px-3 py-1.5 text-xs font-extrabold text-[#0940f7]">
                                  {gst}%
                                </span>
                              </td>

                              <td className={cellClass}>
                                <button
                                  type="button"
                                  onClick={() => toggleAvailability(product)}
                                  className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-extrabold ${
                                    isActive
                                      ? 'bg-[#e6efe5] hover:bg-[#2bf024] text-[#2bf024] hover:text-[#eff8ef]'
                                      : 'bg-[#f4e4df] hover:bg-[#e12f0c] text-[#e12f0c] hover:text-[#eff8ef]'
                                  }`}
                                >

                                  {isActive ? <PowerIcon size={12} /> : <PowerOff size={12} />}
                                </button>
                              </td>

                              <td className={`${cellClass} text-right`}>

                                <div className="flex justify-end gap-2">

                                  <button
                                    type="button"
                                    onClick={() => setViewProduct(product)}
                                    className="rounded-lg p-2.5 text-[#3550d8] transition hover:bg-[#2c3dae] hover:text-white"
                                  >
                                    <Eye size={16} />
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => openEditModal(product)}
                                    className="rounded-lg p-2.5 text-[#2ade0f] transition hover:bg-[#0ddb1b] hover:text-white"
                                  >
                                    <Edit3 size={16} />
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => openDeletePopup(product)}
                                    className="rounded-lg p-2.5 text-[#934b3c] transition hover:border-[#d35e49] hover:bg-[#dc3a11] hover:text-white"
                                  >
                                    <Trash2 size={16} />
                                  </button>

                                </div>

                              </td>

                            </tr>
                          )
                        })}

                      </tbody>

                    </table>

                  </div>

                  <div className="flex flex-col items-center justify-between gap-4 border-t border-[#eee5da] bg-[#f4e0c5] px-5 py-5 sm:flex-row">

                    <p className="text-xs font-medium text-[#806f60]">
                      Showing{' '}
                      <span className="font-bold text-[#68452f]">
                        {startIndex + 1} - {Math.min(
                          startIndex + PRODUCTS_PER_PAGE,
                          filteredProducts.length
                        )}
                      </span>
                      {' '}of{' '}
                      <span className="font-bold text-[#68452f]">
                        {filteredProducts.length}
                      </span>
                      {' '}products
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-2">

                      <button
                        type="button"
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="flex h-9 items-center gap-1 rounded-lg border border-[#e7ddd0] px-3 text-xs font-semibold text-[#68452f] disabled:opacity-40"
                      >
                        <ChevronLeft size={15} />
                        Previous
                      </button>

                      {Array.from(
                        { length: totalPages },
                        (_, index) => index + 1
                      ).map(page => (

                        <button
                          key={page}
                          type="button"
                          onClick={() => goToPage(page)}
                          className={`h-9 min-w-9 rounded-lg px-3 text-xs font-bold ${
                            currentPage === page
                              ? 'bg-[#68452f] text-white'
                              : 'border border-[#e7ddd0] text-[#68452f] hover:bg-[#f3e8db]'
                          }`}
                        >
                          {page}
                        </button>

                      ))}

                      <button
                        type="button"
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="flex h-9 items-center gap-1 rounded-lg border border-[#e7ddd0] px-3 text-xs font-semibold text-[#68452f] disabled:opacity-40"
                      >
                        Next
                        <ChevronRight size={15} />
                      </button>

                    </div>

                  </div>

                </>

              ) : (

                <div className="flex flex-col items-center justify-center px-6 py-24 text-center">

                  <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-[#f3e8db] text-[#68452f]">
                    <Package size={34} />
                  </div>

                  <h3 className="font-serif text-2xl font-semibold text-[#38281e]">
                    {searchQuery ? 'No products found' : 'Your menu is waiting'}
                  </h3>

                  <p className="mt-2 max-w-sm text-sm text-[#806f60]">
                    {searchQuery
                      ? 'Try searching with a different product name.'
                      : 'Start building your coffee collection by adding your first product.'}
                  </p>

                  {!searchQuery && (
                    <button
                      type="button"
                      onClick={openAddModal}
                      className="mt-6 flex items-center gap-2 rounded-xl bg-[#68452f] px-5 py-3 text-sm font-semibold text-white"
                    >
                      <Plus size={17} />
                      Add First Product
                    </button>
                  )}

                </div>

              )}

            </div>

          </section>

        </div>

      </main>

      {viewProduct && (

        <div
          className="fixed inset-0 z-60 flex items-center justify-center bg-[#21160f]/65 px-4 backdrop-blur-sm"
          onClick={e => {
            if (e.target === e.currentTarget) {
              setViewProduct(null)
            }
          }}
        >

          <div
            role="dialog"
            aria-modal="true"
            className="relative w-full max-w-80 rounded-2xl border border-[#e9dfd3] bg-[#fffdf9] p-5 shadow-2xl"
          >

            <button
              type="button"
              onClick={() => setViewProduct(null)}
              className="absolute right-3 top-3 rounded-full p-2 text-[#806f60] hover:bg-[#f3e8db]"
            >
              <X size={18} />
            </button>

            <div className="mb-4 flex items-center gap-3 border-b border-[#eee5da] pb-4 pr-8">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f3e8db] text-[#68452f]">
                <Coffee size={22} />
              </div>

              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#9b6b46]">
                  Product Details
                </p>

                <h2 className="truncate font-serif text-lg font-semibold text-[#38281e]">
                  {viewProduct.name}
                </h2>
              </div>

            </div>

            <div className="space-y-3">

              <div className="flex justify-between rounded-xl bg-[#f8f3ec] px-3 py-3">
                <span className="text-xs text-[#806f60]">Price</span>

                <span className="text-sm font-bold text-[#68452f]">
                  ₹{Number(viewProduct.rate ?? viewProduct.price ?? 0).toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between px-3">
                <span className="text-xs text-[#806f60]">GST Rate</span>

                <span className="text-sm font-semibold">
                  {Number(viewProduct.gst ?? 5)}%
                </span>
              </div>

              <div className="flex justify-between rounded-xl bg-[#f8f3ec] px-3 py-3">
                <span className="text-xs text-[#806f60]">Availability</span>

                <span className="text-xs font-semibold">
                  {viewProduct.isAvailable === false ? 'Inactive' : 'Active'}
                </span>
              </div>

              <div className="flex justify-between px-3">
                <span className="text-xs text-[#806f60]">Created</span>

                <span className="text-xs font-semibold">
                  {viewProduct.createdAt
                    ? new Date(viewProduct.createdAt).toLocaleDateString()
                    : 'Not available'}
                </span>
              </div>

            </div>

            <button
              type="button"
              onClick={() => setViewProduct(null)}
              className="mt-5 w-full rounded-xl bg-[#68452f] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#523724]"
            >
              Close
            </button>

          </div>

        </div>

      )}

      {isModalOpen && (

        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#21160f]/65 px-3 py-3 backdrop-blur-sm"
          onClick={e => {
            if (e.target === e.currentTarget && !saving) {
              closeModal()
            }
          }}
        >

          <div
            role="dialog"
            aria-modal="true"
            className="relative flex max-h-[calc(100dvh-24px)] w-full max-w-120 flex-col overflow-hidden rounded-2xl border border-[#e9dfd3] bg-[#fffdf9] p-4 shadow-2xl sm:p-5"
          >

            <button
              type="button"
              onClick={closeModal}
              disabled={saving}
              className="absolute right-3 top-3 z-10 rounded-full bg-[#f3e8db] p-2 text-[#806f60] hover:bg-[#e9d9c8] disabled:opacity-50"
            >
              <X size={18} />
            </button>

            <div className="mb-3 flex shrink-0 items-center gap-3 border-b border-[#eee5da] pb-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-400 text-[#4e3423]">
                <Coffee size={20} />
              </div>

              <div className="pr-10">
                <h2 className="font-serif text-lg font-bold text-[#38281e]">
                  {isEditing ? 'Edit Product' : 'Add New Product'}
                </h2>

                <p className="mt-0.5 text-[11px] text-[#806f60]">
                  Enter your coffee product details.
                </p>
              </div>

            </div>

            <form
              onSubmit={handleSubmit}
              className="flex min-h-0 flex-col gap-3"
            >

              <label className={labelClass}>
                Product Name *

                <input
                  type="text"
                  name="name"
                  required
                  maxLength={60}
                  placeholder="e.g. Cappuccino"
                  value={form.name}
                  onChange={handleChange}
                  className={inputClass}
                />
              </label>

              <label className={labelClass}>
                Rate / Price (₹) *

                <input
                  type="number"
                  name="rate"
                  required
                  min="0.01"
                  step="0.01"
                  placeholder="e.g. 120"
                  value={form.rate}
                  onChange={handleChange}
                  className={inputClass}
                />
              </label>

              <div className={labelClass}>
                GST Rate (%)

                <div className="grid grid-cols-4 gap-2">

                  {[0, 5, 12, 18].map(gst => (

                    <button
                      key={gst}
                      type="button"
                      onClick={() => setForm(prev => ({
                        ...prev,
                        gst: String(gst)
                      }))}
                      className={`rounded-lg border py-2 text-xs font-bold transition ${
                        Number(form.gst) === gst
                          ? 'border-[#a6a61f] bg-[#efd408] text-amber-950'
                          : 'border-[#e7ddd0] bg-white text-[#68452f] hover:bg-[#f3e8db]'
                      }`}
                    >
                      {gst}%
                    </button>

                  ))}

                </div>

                <input
                  name="gst"
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  placeholder="Custom GST percentage"
                  value={form.gst}
                  onChange={handleChange}
                  className={inputClass}
                />

              </div>

              {form.rate && Number(form.rate) > 0 && (

                <div className="rounded-xl border border-[#e9dfd3] bg-[#f8f2e9] px-3 py-3">

                  <div className="flex items-center justify-between">

                    <div>
                      <p className="text-xs font-bold text-[#38281e]">
                        Product Price
                      </p>

                      <p className="mt-1 text-[10px] text-[#806f60]">
                        GST: {Number(form.gst) || 0}%
                      </p>
                    </div>

                    <p className="text-lg font-bold text-[#68452f]">
                      ₹{Number(form.rate).toFixed(2)}
                    </p>

                  </div>

                </div>

              )}

              <div className="flex shrink-0 gap-2 pt-1">

                <button
                  type="submit"
                  disabled={saving}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-amber-950/90 px-3 py-2.5 text-sm font-bold text-white hover:bg-[#523724] disabled:opacity-60"
                >
                  {saving ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Plus size={16} />
                      {isEditing ? 'Save Changes' : 'Save Product'}
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="rounded-xl border border-[#f30505] bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-500"
                >
                  Cancel
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

      {deleteProductData && (

        <div
          className="fixed inset-0 z-100 flex items-center justify-center bg-[#21160f]/65 px-4 py-4 backdrop-blur-sm"
          onClick={e => {
            if (e.target === e.currentTarget) {
              closeDeletePopup()
            }
          }}
        >

          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-title"
            aria-describedby="delete-description"
            className="relative w-full max-w-95 rounded-2xl border border-[#e9dfd3] bg-[#fffdf9] p-5 shadow-2xl sm:p-6"
          >

            <button
              type="button"
              onClick={closeDeletePopup}
              disabled={deleting}
              aria-label="Close delete confirmation"
              className="absolute right-3 top-3 rounded-full p-2 text-[#806f60] transition hover:bg-[#f3e8db] disabled:opacity-50"
            >
              <X size={19} />
            </button>

            <div className="flex flex-col items-center text-center">

              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#f0d7d1] bg-[#fbefec] text-[#b34e40]">
                <Trash2 size={26} />
              </div>

              <h2
                id="delete-title"
                className="font-serif text-xl font-bold text-[#38281e]"
              >
                Delete Product?
              </h2>

              <p
                id="delete-description"
                className="mt-2 max-w-72.5 text-sm leading-6 text-[#806f60]"
              >
                Are you sure you want to delete{' '}
                <span className="font-bold text-[#68452f]">
                  "{deleteProductData.name}"
                </span>
                ? This action cannot be undone.
              </p>

            </div>

            <div className="my-5 flex items-center gap-3 rounded-xl border border-[#eee5da] bg-[#f8f3ec] p-3">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#f3e8db] text-[#68452f]">
                <Coffee size={22} />
              </div>

              <div className="min-w-0 flex-1">

                <p className="truncate text-sm font-bold text-[#38281e]">
                  {deleteProductData.name}
                </p>

                <p className="mt-1 text-xs text-[#806f60]">
                  ₹{Number(
                    deleteProductData.rate ??
                    deleteProductData.price ?? 0
                  ).toFixed(2)}
                  {' '} • GST {deleteProductData.gst ?? 5}%
                </p>

              </div>

              <AlertTriangle
                size={19}
                className="shrink-0 text-[#b34e40]"
              />

            </div>

            <div className="flex gap-3">

              <button
                type="button"
                onClick={closeDeletePopup}
                disabled={deleting}
                className="flex-1 rounded-xl border border-[#e7ddd0] bg-white px-4 py-3 text-sm font-semibold text-[#68452f] transition hover:bg-[#f3e8db] disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={confirmDeleteProduct}
                disabled={deleting}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#b34e40] px-4 py-3 text-sm font-bold text-white shadow-md shadow-[#b34e40]/15 transition hover:bg-[#963c31] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deleting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={16} />
                    Delete Product
                  </>
                )}
              </button>

            </div>

          </div>

        </div>

      )}

    </>
  )
}

export default Products
