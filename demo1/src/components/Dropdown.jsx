import React, { useState } from 'react'

const Dropdown = () => {

const [billing, setBilling] = useState('')

  return (
    <>
     <div>
        <select id='billing-staff' value={billing} onChange={(event) => setBilling(event.target.value)} className='w-40 rounded-lg border border-amber-900/15 bg-[#fcfaf7] px-1 py-2 text-sm font-bold font-serif text-[#945003] outline-none focus:border-amber-700'>
            <option value=''>Select staff</option>
            {(() => {
              try {
                const storedStaff = JSON.parse(localStorage.getItem('coffee_staff') || '[]')

                return (Array.isArray(storedStaff) ? storedStaff : [])
                  .filter((staffMember) => staffMember && String(staffMember.name ?? '').trim())
                  .map((staffMember, index) => {
                    const staffName = String(staffMember.name).trim()

                    return (
                      <option key={staffMember.id ?? `${staffName}-${index}`} value={staffName}>{staffName}</option>
                    )
                  })
              } catch (error) {
                console.error('Staff loading error:', error)
                return null
              }
            })()}
          </select>
     </div>
    </>
  )
}

export default Dropdown