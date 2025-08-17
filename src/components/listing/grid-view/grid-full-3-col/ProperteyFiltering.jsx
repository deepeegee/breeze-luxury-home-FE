'use client'

import React, { useState, useEffect, useMemo } from 'react'
import ListingSidebar from '../../sidebar'
import AdvanceFilterModal from '@/components/common/advance-filter-two'
import TopFilterBar from './TopFilterBar'
import FeaturedListings from './FeaturedListings'
import PaginationTwo from "../../PaginationTwo"
import { useListings } from "@/lib/useApi"
import Spinner from '@/components/common/Spinner'

// import listings from "@/data/listings";

export default function ProperteyFiltering() {
  const { data: listings = [], isLoading, error } = useListings()
  const [filteredData, setFilteredData] = useState([])
  const [sortedFilteredData, setSortedFilteredData] = useState([])
  const [pageItems, setPageItems] = useState([])
  const [pageContentTrac, setPageContentTrac] = useState([])

  const [currentSortingOption, setCurrentSortingOption] = useState('Newest')
  const [pageNumber, setPageNumber] = useState(1)
  const [colstyle, setColstyle] = useState(false)

  const [listingStatus, setListingStatus] = useState('All')
  const [propertyTypes, setPropertyTypes] = useState([])
  const [priceRange, setPriceRange] = useState([0, 100000])
  const [bedrooms, setBedrooms] = useState(0)
  const [bathroms, setBathroms] = useState(0)
  const [location, setLocation] = useState('All Cities')
  const [squirefeet, setSquirefeet] = useState([])
  const [yearBuild, setyearBuild] = useState([0, 2050])
  const [categories, setCategories] = useState([])
  const [searchQuery, setSearchQuery] = useState('')

  const handlelistingStatus = (elm) => {
    setListingStatus(elm);
  };

  const handlepropertyTypes = (elm) => {
    if (elm == "All") {
      setPropertyTypes([]);
    } else {
      setPropertyTypes((pre) =>
        pre.includes(elm) ? [...pre.filter((el) => el != elm)] : [...pre, elm]
      );
    }
  };

  const handlepriceRange = (elm) => {
    setPriceRange(elm);
  };

  const handlebedrooms = (elm) => {
    setBedrooms(elm);
  };

  const handlebathroms = (elm) => {
    setBathroms(elm);
  };

  const handlelocation = (elm) => {
    setLocation(elm);
  };

  const handlesquirefeet = (elm) => {
    setSquirefeet(elm);
  };

  const handleyearBuild = (elm) => {
    setyearBuild(elm);
  };

  const handlecategories = (elm) => {
    if (elm == "All") {
      setCategories([]);
    } else {
      setCategories((pre) =>
        pre.includes(elm) ? [...pre.filter((el) => el != elm)] : [...pre, elm]
      );
    }
  };

  const resetFilter = () => {
    setListingStatus('All');
    setPropertyTypes([]);
    setPriceRange([0, 100000]);
    setBedrooms(0);
    setBathroms(0);
    setLocation('All Cities');
    setSquirefeet([]);
    setyearBuild([0, 2050]);
    setCategories([]);
    setSearchQuery('');
    if (listings.length > 0) {
      setFilteredData(listings);
      setSortedFilteredData(listings);
    }
  };

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
  };



  // initialize filtered data when listings are loaded
  useEffect(() => {
    if (listings.length > 0) {
      setFilteredData(listings)
      setSortedFilteredData(listings)
    }
  }, [listings])

  useEffect(() => {
    if (!sortedFilteredData || !Array.isArray(sortedFilteredData)) return;
    
    const newPageItems = sortedFilteredData.slice((pageNumber - 1) * 9, pageNumber * 9);
    setPageItems(newPageItems)
    setPageContentTrac([
      ((pageNumber - 1) * 9) + 1,
      pageNumber * 9,
      sortedFilteredData.length
    ])
  }, [pageNumber, sortedFilteredData])

  useEffect(() => {
    if (!listings.length) return

    const refItems = listings.filter((elm) => {
      if (listingStatus == "All") return true
      if (listingStatus == "Buy") return !elm.forRent
      if (listingStatus == "Rent") return elm.forRent
    })

    let filteredArrays = []

    // Apply property type filter
    if (propertyTypes.length > 0) {
      filteredArrays.push(refItems.filter(elm => propertyTypes.includes(elm.propertyType)))
    }

    // Apply bedroom filter
    if (bedrooms > 0) {
      filteredArrays.push(refItems.filter(el => el.bed >= bedrooms))
    }

    // Apply bathroom filter
    if (bathroms > 0) {
      filteredArrays.push(refItems.filter(el => el.bath >= bathroms))
    }

    // Apply categories filter
    if (categories.length > 0) {
      filteredArrays.push(refItems.filter(elm => categories.every(c => elm.features.includes(c))))
    }

    // Apply location filter
    if (location != 'All Cities') {
      filteredArrays.push(refItems.filter(el => el.city == location))
    }

    // Apply price range filter
    if (priceRange.length > 0 && (priceRange[0] > 0 || priceRange[1] < 100000)) {
      filteredArrays.push(refItems.filter(el => {
        const priceNum = Number(el.price.replace(/\$|,/g, ''))
        return priceNum >= priceRange[0] && priceNum <= priceRange[1]
      }))
    }

    // Apply square feet filter
    if (squirefeet.length > 0 && squirefeet[1] > 0) {
      filteredArrays.push(refItems.filter(el =>
        el.sqft >= squirefeet[0] && el.sqft <= squirefeet[1]
      ))
    }

    // Apply year built filter
    if (yearBuild.length > 0 && (yearBuild[0] > 0 || yearBuild[1] < 2050)) {
      filteredArrays.push(refItems.filter(el =>
        el.yearBuilding >= yearBuild[0] && el.yearBuilding <= yearBuild[1]
      ))
    }

    // Apply search filter
    if (searchQuery.trim()) {
      filteredArrays.push(refItems.filter(el => 
        el.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        el.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        el.address?.toLowerCase().includes(searchQuery.toLowerCase())
      ))
    }

    // If no filters are applied, use all items
    if (filteredArrays.length === 0) {
      setFilteredData(refItems)
    } else {
      // Find common items across all applied filters
      const commonItems = refItems.filter((item) =>
        filteredArrays.every((array) => array.includes(item))
      )
      setFilteredData(commonItems)
    }
  }, [listings, listingStatus, propertyTypes, priceRange, bedrooms, bathroms, location, squirefeet, yearBuild, categories, searchQuery])

  // 🔹 Update sortedFilteredData when filteredData changes
  useEffect(() => {
    if (filteredData && Array.isArray(filteredData) && filteredData.length > 0) {
      setSortedFilteredData(filteredData)
    }
  }, [filteredData])

  // 🔹 Sorting logic
  useEffect(() => {
    if (!filteredData || !Array.isArray(filteredData)) return;
    
    setPageNumber(1)
    if (currentSortingOption == 'Newest') {
      setSortedFilteredData([...filteredData].sort((a, b) => b.yearBuilding - a.yearBuilding))
    } else if (currentSortingOption == 'Price Low') {
      setSortedFilteredData([...filteredData].sort((a, b) =>
        Number(a.price.replace(/\$|,/g, '')) - Number(b.price.replace(/\$|,/g, ''))
      ))
    } else if (currentSortingOption == 'Price High') {
      setSortedFilteredData([...filteredData].sort((a, b) =>
        Number(b.price.replace(/\$|,/g, '')) - Number(a.price.replace(/\$|,/g, ''))
      ))
    } else {
      setSortedFilteredData(filteredData)
    }
  }, [filteredData, currentSortingOption])

  if (isLoading) return <Spinner />;
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