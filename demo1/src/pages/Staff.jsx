
import { useEffect, useMemo, useState } from 'react'
import Header from '../components/Header'
import { Coffee, Plus, Search, Eye, Edit3, Trash2, X, Loader2, Package, ChevronLeft, ChevronRight, AlertTriangle, UserCheck2, LucideLoaderPinwheel, Users } from 'lucide-react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import AllFooter from '../components/AllFooter'

const STORAGE_KEY = 'coffee_staff'
const PRODUCTS_PER_PAGE = 10

const emptyForm = { name: '', email: '', mobile: '', role: '' }

const Staff = () => {

    const [staff, setStaff] = useState([])
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

            setStaff(
                Array.isArray(storedProducts) ? storedProducts : []
            )
        } catch (error) {
            console.error(error)
            setStaff([])
            toast.error('Unable to load staff')
        } finally {
            setLoading(false)
        }
    }, [])

    const saveLocalProducts = (updatedProducts) => {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(updatedProducts)
        )

        setStaff(updatedProducts)
    }

    const openAddModal = () => {
        setEditingId(null)
        setForm({ ...emptyForm })
        setIsModalOpen(true)
    }

    const openEditModal = (product) => {
        setEditingId(product.id)

        setForm({ name: product.name || '', email: product.email || '', mobile: product.mobile || '', role: product.role || '' })

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

        const staffName = form.name.trim()
        const email = form.email.trim()
        const mobile = form.mobile.trim()
        const role = form.role.trim()

        if (!staffName) {
            toast.warning('Please enter staff name')
            return
        }

        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            toast.warning('Please enter a valid email address')
            return
        }

        if (!/^\d{10}$/.test(mobile)) {
            toast.warning('Please enter a valid 10-digit mobile number')
            return
        }

        if (!role) {
            toast.warning('please enter staff role')
        }

        const staffData = { name: staffName, email, mobile, role }

        try {
            setSaving(true)

            let updatedProducts

            if (isEditing) {

                updatedProducts = staff.map(product =>
                    product.id === editingId
                        ? { ...product, ...staffData }
                        : product
                )

            } else {

                const newProduct = {
                    id: crypto.randomUUID(),
                    ...staffData,
                    createdAt: new Date().toISOString()
                }

                updatedProducts = [newProduct, ...staff]

                setCurrentPage(1)
            }

            saveLocalProducts(updatedProducts)

            toast.success(
                isEditing
                    ? 'Staff member updated successfully!'
                    : 'Staff member added successfully!'
            )

            setIsModalOpen(false)
            setEditingId(null)
            setForm({ ...emptyForm })

        } catch (error) {
            console.error(error)
            toast.error('Unable to save staff member')
        } finally {
            setSaving(false)
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

            const updatedProducts = staff.filter(
                item => item.id !== deleteProductData.id
            )

            saveLocalProducts(updatedProducts)

            toast.success('Staff member deleted successfully!')

            setDeleteProductData(null)

        } catch (error) {
            console.error(error)
            toast.error('Unable to delete staff member')
        } finally {
            setDeleting(false)
        }
    }

    const filteredProducts = useMemo(() => {

        const search = searchQuery.toLowerCase().trim()

        return staff.filter(product => {

            const searchableValues = [
                product.name,
                product.email,
                product.mobile,
                product.role
            ]

            return searchableValues.some(value =>
                String(value ?? '').toLowerCase().includes(search)
            )
        })

    }, [staff, searchQuery])

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
                                    Staff Management
                                </p>
                            </div>

                            <h1 className="font-serif text-3xl font-bold text-[#38281e] sm:text-4xl">
                                Staff Management
                            </h1>

                            <p className="mt-2 text-sm text-[#383634]">
                                Manage your Staff, Add New Staff.
                            </p>
                        </div>

                        <div className="relative w-full py-3.5 sm:max-w-sm">

                            <Search
                                size={18}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9b806b]"
                            />

                            <input
                                type="search"
                                placeholder="Search Staff..."
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
                            className="flex items-center justify-center gap-2 rounded-xl bg-[#68452f] px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-[#523724]"
                        >
                            <Plus size={18} />
                            Add New Staff
                        </button>

                    </section>

                    <section>

                        <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

                            <div>
                                <h2 className="font-serif text-2xl font-semibold text-[#38281e]">
                                    Staff Table
                                </h2>

                                <p className="mt-1 text-xs text-[#4a4847]">
                                    Your complete Staff List.
                                </p>
                            </div>

                        </div>

                        <div className="overflow-hidden rounded-2xl border border-[#edb76f] bg-white shadow-[0_12px_40px_rgba(63,42,25,0.06)]">

                            {loading ? (

                                <div className="flex flex-col items-center justify-center py-24">
                                    <Loader2 size={35} className="animate-spin text-[#9b6b46]" />

                                    <p className="mt-4 text-sm font-semibold text-[#806f60]">
                                        Brewing your Staff List...
                                    </p>
                                </div>

                            ) : filteredProducts.length > 0 ? (

                                <>

                                    <div className="overflow-x-auto">

                                        <table className="w-full min-w-187.5 border-collapse text-left">

                                            <thead>
                                                <tr className="bg-[#f4e0c5] text-[10px] font-extrabold uppercase tracking-[1.5px] text-[#80664f]">
                                                    <th className="px-5 py-5">#</th>
                                                    <th className="px-5 py-5">Staff Name</th>
                                                    <th className="px-5 py-5">Mobile</th>
                                                    <th className="px-5 py-5">Email</th>
                                                    <th className="px-5 py-5">Role</th>
                                                    <th className="px-5 py-5 text-right">Actions</th>
                                                </tr>
                                            </thead>

                                            <tbody>

                                                {currentProducts.map((product, index) => {

                                                    return (
                                                        <tr key={product.id} className="border-t border-[#e1a055] bg-[#ebeed817] text-sm transition hover:bg-[#e0dfde]">

                                                            <td className={`${cellClass} font-semibold text-[#a18c79]`}>{String(startIndex + index + 1).padStart(2, '0')}</td>

                                                            <td className={cellClass}>
                                                                <div className="flex items-center gap-3">

                                                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-100 text-[#0ca004]">
                                                                        <UserCheck2 size={15} />
                                                                    </div>

                                                                    <div>
                                                                        <p className="items-center text-base font-extrabold text-green-600">
                                                                            {product.name}
                                                                        </p>
                                                                    </div>

                                                                </div>
                                                            </td>

                                                            <td className={`${cellClass} font-bold text-blue-600`}>{product.mobile || '—'}</td>

                                                            <td className={`${cellClass} font-bold text-red-600`}>{product.email || '—'}</td>

                                                            <td className={`${cellClass} font-bold text-orange-500`}>{product.role || '_'}</td>


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
                                            {' '}staff members
                                        </p>

                                        <div className="flex flex-wrap items-center justify-center gap-2">

                                            <button type="button" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1} className="flex h-9 items-center gap-1 rounded-lg border border-[#e7ddd0] px-3 text-xs font-semibold text-[#68452f] disabled:opacity-40"> <ChevronLeft size={15} /> Previous</button>

                                            {Array.from(
                                                { length: totalPages },
                                                (_, index) => index + 1
                                            ).map(page => (

                                                <button key={page} type="button" onClick={() => goToPage(page)} className={`h-9 min-w-9 rounded-lg px-3 text-xs font-bold ${currentPage === page ? 'bg-[#68452f] text-white' : 'border border-[#e7ddd0] text-[#68452f] hover:bg-[#f3e8db]' }`}>{page}</button>

                                            ))}

                                            <button type="button" onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages} className="flex h-9 items-center gap-1 rounded-lg border border-[#e7ddd0] px-3 text-xs font-semibold text-[#68452f] disabled:opacity-40" >Next<ChevronRight size={15} /></button>

                                        </div>

                                    </div>

                                </>

                            ) : (

                                <div className="flex flex-col items-center justify-center px-6 py-24 text-center">

                                    <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-[#f3e8db] text-[#68452f]">
                                        <Package size={34} />
                                    </div>

                                    <h3 className="font-serif text-2xl font-semibold text-[#38281e]">
                                        {searchQuery ? 'No staff found' : 'Your staff list is empty'}
                                    </h3>

                                    <p className="mt-2 max-w-sm text-sm text-[#806f60]">
                                        {searchQuery
                                            ? 'Try searching by staff name, email, or mobile number.'
                                            : 'Add your first staff member to get started.'}
                                    </p>

                                    {!searchQuery && (
                                        <button
                                            type="button"
                                            onClick={openAddModal}
                                            className="mt-6 flex items-center gap-2 rounded-xl bg-[#68452f] px-5 py-3 text-sm font-semibold text-white"
                                        >
                                            <Plus size={17} />
                                            Add First Staff Member
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
                                <UserCheck2 size={22} />
                            </div>

                            <div className="min-w-0">
                                <p className="text-[10px] font-bold uppercase tracking-wider text-[#9b6b46]">
                                    Staff Details
                                </p>

                                <h2 className="truncate font-serif text-lg font-semibold text-[#38281e]">
                                    {viewProduct.name}
                                </h2>
                            </div>

                        </div>

                        <div className="space-y-3">

                            <div className="flex justify-between px-3">
                                <span className="text-xs text-[#806f60]">Email</span>

                                <span className="text-sm font-semibold">
                                    {viewProduct.email || 'Not available'}
                                </span>
                            </div>

                            <div className="flex justify-between rounded-xl bg-[#f8f3ec] px-3 py-3">
                                <span className="text-xs text-[#806f60]">Mobile</span>

                                <span className="text-xs font-semibold">
                                    {viewProduct.mobile || 'Not available'}
                                </span>
                            </div>

                            <div className="flex justify-between rounded-xl bg-[#f8f3ec] px-3 py-3">
                                <span className="text-xs text-[#806f60]">Role</span>

                                <span className="text-xs font-semibold">
                                    {viewProduct.role || 'Not available'}
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
                                <Users size={20} />
                            </div>

                            <div className="pr-10">
                                <h2 className="font-serif text-lg font-bold text-[#38281e]">
                                    {isEditing ? 'Edit Staff' : 'Add New Staff'}
                                </h2>

                                <p className="mt-0.5 text-[11px] text-[#806f60]">
                                    Enter your Staff details.
                                </p>
                            </div>

                        </div>

                        <form onSubmit={handleSubmit} className="flex min-h-0 flex-col gap-3">

                            <label className={labelClass}><p> Staff Name <span className='text-red-600 font-extrabold'>*</span></p><input type="text" name="name" required maxLength={60} placeholder="e.g. eren" value={form.name} onChange={handleChange} className={inputClass}/></label>
                            <label className={labelClass}><p> Staff Email <span className='text-red-600 font-extrabold'>*</span></p><input name="email" type="email" required maxLength={100} placeholder="e.g. eren@gmail.com" value={form.email} onChange={handleChange} className={inputClass}/></label>
                            <label className={labelClass}><p> Staff Mobile no <span className='text-red-600 font-extrabold'>*</span></p><input type="tel" name="mobile" required inputMode="numeric" pattern="[0-9]{10}" maxLength={10} placeholder="e.g. 1234567890" value={form.mobile} onChange={handleChange} className={inputClass}/></label>
                            <label className={labelClass}><p> Staff Role <span className='text-red-600 font-extrabold'>*</span></p><input type="text" name="role" required maxLength={60} placeholder="e.g. cashier" value={form.role} onChange={handleChange} className={inputClass}/></label>


                            <div className="flex shrink-0 gap-2 pt-1">

                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-amber-950/90 px-3 py-2.5 text-sm font-bold text-white hover:bg-[#523724] disabled:opacity-60"
                                >
                                    {saving ? (
                                        <>
                                            <LucideLoaderPinwheel size={16} className="animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Plus size={16} />
                                            {isEditing ? 'Save Changes' : 'Save Staff'}
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
                                Delete Staff Member?
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
                                <UserCheck2 size={22} />
                            </div>

                            <div className="min-w-0 flex-1">

                                <p className="truncate text-sm font-bold text-[#38281e]">
                                    {deleteProductData.name}
                                </p>

                                <p className="mt-1 truncate text-xs text-[#806f60]">
                                    {deleteProductData.email} · {deleteProductData.mobile}
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
                                        Delete Staff Member
                                    </>
                                )}
                            </button>

                        </div>

                    </div>

                </div>

            )}

            {/* footer */}
            <div className='bg-amber-100/60'>
                <AllFooter />
            </div>

        </>
    )
}

export default Staff
