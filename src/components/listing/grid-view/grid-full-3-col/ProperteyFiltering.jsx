'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import ListingSidebar from '../../sidebar'
import AdvanceFilterModal from '@/components/common/advance-filter-two'
import TopFilterBar from './TopFilterBar'
import FeaturedListings from './FeaturedListings'
import PaginationTwo from "../../PaginationTwo"
import { useListings } from "@/lib/useApi"
import Spinner from '@/components/common/Spinner'

export default function ProperteyFiltering() {
  const searchParams = useSearchParams()

  // Stable key (avoid infinite loops)
  const searchKey = useMemo(() => searchParams?.toString() ?? '', [searchParams])
  const sp = useMemo(() => new URLSearchParams(searchKey), [searchKey])

  // Build server query from URL params, stripping empty values.
  // NOTE: we DO NOT forward Buy/Rent to the API until backend supports it.
  const serverParams = useMemo(() => {
    const get = (k) => sp.get(k)
    const out = {}
    const put = (k, v) => {
      if (v == null) return
      const s = String(v).trim()
      if (!s || s === 'undefined' || s === 'null') return
      out[k] = s
    }
    put('q',          get('q'))
    put('city',       get('location'))
    put('minPrice',   get('minPrice'))
    put('maxPrice',   get('maxPrice'))
    put('bedrooms',   get('beds'))
    put('bathrooms',  get('baths'))
    put('category',   get('type'))
    put('propertyId', get('propertyId'))
    // DO NOT map status=Buy|Rent to listedIn for now
    return out
  }, [sp])

  const hookParams = Object.keys(serverParams).length ? serverParams : undefined
  const { data: listings = [], isLoading, error } = useListings(hookParams)

  const [filteredData, setFilteredData] = useState([])
  const [sortedFilteredData, setSortedFilteredData] = useState([])
  const [pageItems, setPageItems] = useState([])
  const [pageContentTrac, setPageContentTrac] = useState([])

  const [currentSortingOption, setCurrentSortingOption] = useState('Newest')
  const [pageNumber, setPageNumber] = useState(1)
  const [colstyle, setColstyle] = useState(false)

  const [listingStatus, setListingStatus] = useState('All') // Buy | Rent | All
  const [propertyTypes, setPropertyTypes] = useState([])
  const [priceRange, setPriceRange] = useState([0, 100000])
  const [bedrooms, setBedrooms] = useState(0)
  const [bathroms, setBathroms] = useState(0)
  const [location, setLocation] = useState('All Cities')
  const [squirefeet, setSquirefeet] = useState([])
  const [yearBuild, setyearBuild] = useState([0, 2050])
  const [categories, setCategories] = useState([])
  const [searchQuery, setSearchQuery] = useState('')

  const handlelistingStatus = (elm) => setListingStatus(elm)
  const handlepropertyTypes = (elm) => {
    if (elm == "All") {
      setPropertyTypes([])
    } else {
      setPropertyTypes((pre) =>
        pre.includes(elm) ? pre.filter((el) => el != elm) : [...pre, elm]
      )
    }
  }
  const handlepriceRange = (elm) => setPriceRange(elm)
  const handlebedrooms = (elm) => setBedrooms(elm)
  const handlebathroms = (elm) => setBathroms(elm)
  const handlelocation = (elm) => setLocation(elm)
  const handlesquirefeet = (elm) => setSquirefeet(elm)
  const handleyearBuild = (elm) => setyearBuild(elm)
  const handlecategories = (elm) => {
    if (elm == "All") {
      setCategories([])
    } else {
      setCategories((pre) =>
        pre.includes(elm) ? pre.filter((el) => el != elm) : [...pre, elm]
      )
    }
  }

  const resetFilter = () => {
    setListingStatus('All')
    setPropertyTypes([])
    setPriceRange([0, 100000])
    setBedrooms(0)
    setBathroms(0)
    setLocation('All Cities')
    setSquirefeet([])
    setyearBuild([0, 2050])
    setCategories([])
    setSearchQuery('')
  }

  const filterFunctions = {
    handlelistingStatus,
    handlepropertyTypes,
    handlepriceRange,
    handlebedrooms,
    handlebathroms,
    handlelocation,
    handlesquirefeet,
    handleyearBuild,
    handlecategories,
    priceRange,
    listingStatus,
    propertyTypes,
    resetFilter,
    bedrooms,
    bathroms,
    location,
    squirefeet,
    yearBuild,
    categories,
    setPropertyTypes,
    setSearchQuery,
  }

  // Initialize filters from URL
  useEffect(() => {
    const getNum = (k) => {
      const v = sp.get(k)
      if (v == null || v === '') return undefined
      const n = Number(v)
      return Number.isNaN(n) ? undefined : n
    }

    setSearchQuery(sp.get('q') || '')
    setLocation(sp.get('location') || 'All Cities')

    const status = sp.get('status')
    setListingStatus(['Buy','Rent','All'].includes(status) ? status : 'All')

    const type = sp.get('type')
    setPropertyTypes(type ? type.split(',').map((s) => s.trim()).filter(Boolean) : [])

    const minP = getNum('minPrice')
    const maxP = getNum('maxPrice')
    setPriceRange([minP ?? 0, maxP ?? 100000])

    setBedrooms(getNum('beds') ?? 0)
    setBathroms(getNum('baths') ?? 0)

    const yMin = getNum('yearMin')
    const yMax = getNum('yearMax')
    setyearBuild([yMin ?? 0, yMax ?? 2050])
  }, [sp])

  // Helper: derive Buy/Rent mode if present; otherwise null
  const deriveMode = (el) => {
    if (typeof el?.forRent === 'boolean') return el.forRent ? 'Rent' : 'Buy'
    const direct = el?.listedIn ?? el?.listed ?? el?.rentOrBuy ?? el?.transactionType ?? el?.offerType
    const purpose = el?.purpose ?? el?.status
    const test = (v) => {
      if (!v) return null
      const s = String(v).toLowerCase()
      if (/(rent|lease)/.test(s)) return 'Rent'
      if (/(buy|sale|sell)/.test(s)) return 'Buy'
      if (s === 'rent' || s === 'buy') return s === 'rent' ? 'Rent' : 'Buy'
      return null
    }
    return test(direct) || test(purpose)
  }

  // Apply all client filters
  useEffect(() => {
    if (isLoading) return
    if (!Array.isArray(listings)) return

    if (listings.length === 0) {
      setFilteredData((prev) => (prev.length === 0 ? prev : []))
      return
    }

    const toNum = (v) => (typeof v === 'number' ? v : Number(String(v || '').replace(/\$|,/g, '')))

    const refItems = listings.filter((el) => {
      if (listingStatus === 'All') return true
      const mode = deriveMode(el)
      if (!mode) return true // provision only; don't filter if unknown
      return listingStatus === mode
    })

    let andFilters = []

    // category / type
    if (propertyTypes.length > 0) {
      andFilters.push(refItems.filter(el => propertyTypes.includes(el.propertyType || el.category)))
    }

    // bedrooms / bathrooms
    if (bedrooms > 0) {
      andFilters.push(refItems.filter(el => (el.bedrooms ?? el.bed ?? el.rooms ?? 0) >= bedrooms))
    }
    if (bathroms > 0) {
      andFilters.push(refItems.filter(el => (el.bathrooms ?? el.bath ?? 0) >= bathroms))
    }

    // amenities / features
    if (categories.length > 0) {
      andFilters.push(refItems.filter(el => categories.every(c => (el.amenities || el.features || []).includes(c))))
    }

    // city/location
    if (location !== 'All Cities') {
      andFilters.push(refItems.filter(el => (el.city || '').toString() === location))
    }

    // price range
    if (priceRange.length > 0 && (priceRange[0] > 0 || priceRange[1] < 100000)) {
      andFilters.push(
        refItems.filter(el => {
          const priceNum = toNum(el.price)
          return priceNum >= priceRange[0] && priceNum <= priceRange[1]
        })
      )
    }

    // sqft/size
    if (squirefeet.length > 0 && squirefeet[1] > 0) {
      andFilters.push(refItems.filter(el => {
        const size = el.sizeInFt ?? el.sqft ?? 0
        return size >= squirefeet[0] && size <= squirefeet[1]
      }))
    }

    // year built
    if (yearBuild.length > 0 && (yearBuild[0] > 0 || yearBuild[1] < 2050)) {
      andFilters.push(refItems.filter(el => {
        const y = el.yearBuilt ?? el.yearBuilding ?? 0
        return y >= yearBuild[0] && y <= yearBuild[1]
      }))
    }

    // free-text search across many fields
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      andFilters.push(
        refItems.filter(el =>
          [
            el.title,
            el.name,
            el.description,
            el.address,
            el.city,
            el.state,
            el.country,
            el.propertyId
          ].some(v => v?.toString().toLowerCase().includes(q))
        )
      )
    }

    const nextFiltered =
      andFilters.length === 0
        ? refItems
        : refItems.filter(item => andFilters.every(arr => arr.includes(item)))

    setFilteredData((prev) => {
      const sameLen = prev.length === nextFiltered.length
      const sameIds = sameLen && prev.every((p, i) => (p._id ?? p.id ?? i) === (nextFiltered[i]?._id ?? nextFiltered[i]?.id ?? i))
      return sameIds ? prev : nextFiltered
    })
  }, [
    isLoading,
    listings,
    listingStatus,
    propertyTypes,
    priceRange,
    bedrooms,
    bathroms,
    location,
    squirefeet,
    yearBuild,
    categories,
    searchQuery
  ])

  // Sorting
  useEffect(() => {
    if (!Array.isArray(filteredData)) return
    setPageNumber(1)
    const toNum = (v) => (typeof v === 'number' ? v : Number(String(v ?? '').replace(/\$|,/g, '')))
    let next = filteredData
    if (currentSortingOption === 'Newest') {
      next = [...filteredData].sort((a, b) => (b.yearBuilt ?? b.yearBuilding ?? 0) - (a.yearBuilt ?? a.yearBuilding ?? 0))
    } else if (currentSortingOption === 'Price Low') {
      next = [...filteredData].sort((a, b) => toNum(a.price) - toNum(b.price))
    } else if (currentSortingOption === 'Price High') {
      next = [...filteredData].sort((a, b) => toNum(b.price) - toNum(a.price))
    }
    setSortedFilteredData(next)
  }, [filteredData, currentSortingOption])

  // Pagination
  useEffect(() => {
    if (!Array.isArray(sortedFilteredData)) return
    const start = (pageNumber - 1) * 9
    const end = pageNumber * 9
    const total = sortedFilteredData.length
    setPageItems(sortedFilteredData.slice(start, end))
    setPageContentTrac([
      total === 0 ? 0 : start + 1,
      Math.min(end, total),
      total,
    ])
  }, [pageNumber, sortedFilteredData])

  if (isLoading) return <Spinner />
  if (error) return <div className="text-center py-5">Error loading properties: {error.message}</div>

  return (
    <section className="pt0 pb90 bgc-f7">
      <div className="container">
        {/* Mobile filter sidebar */}
        <div className="offcanvas offcanvas-start p-0" tabIndex="-1" id="listingSidebarFilter">
          <div className="offcanvas-header">
            <h5 className="offcanvas-title">Listing Filter</h5>
            <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas"></button>
          </div>
          <div className="offcanvas-body p-0">
            <ListingSidebar filterFunctions={filterFunctions} />
          </div>
        </div>

        {/* Advanced Modal */}
        <div className="advance-feature-modal">
          <div className="modal fade" id="advanceSeachModal" tabIndex={-1}>
            <AdvanceFilterModal filterFunctions={filterFunctions} />
          </div>
        </div>

        <div className="row">
          <TopFilterBar
            pageContentTrac={pageContentTrac || [0, 0, 0]}
            colstyle={colstyle}
            setColstyle={setColstyle}
            filterFunctions={filterFunctions}
            setCurrentSortingOption={setCurrentSortingOption}
          />
        </div>

        <div className="row">
          <FeaturedListings colstyle={colstyle} data={pageItems || []} />
          {sortedFilteredData.length === 0 && (
            <div className="text-center py-5">No properties match your search.</div>
          )}
        </div>

        <div className="row">
          <PaginationTwo
            pageCapacity={9}
            data={sortedFilteredData || []}
            pageNumber={pageNumber}
            setPageNumber={setPageNumber}
          />
        </div>
      </div>
    </section>
  )
}