import React, { useEffect, useState } from 'react'
import { Grid } from '@giphy/react-components'
import { GiphyFetch } from '@giphy/js-fetch-api'
import { useDebounce } from '../Common/Hook/useDebounce'
import useDevice from '../Common/useDevice'
// import { useRouter } from 'next/router'

const giphyFetch = new GiphyFetch('sXpGFDGZs0Dv1mmNFvYaGUvYwKX0PWIh')

const GifSelector = ({
  setGifAttachment,
  setShowModal,
  className,
  bottom,
  setShowGiphyDrawer,
  left
}) => {
  const [categories, setCategories] = useState([])
  const [debouncedGifInput, setDebouncedGifInput] = useState('')
  const [searchText, setSearchText] = useState('')
  // const router = useRouter()

  const fetchGiphyCategories = async () => {
    const { data } = await giphyFetch.categories()
    // TODO: we can persist this categories
    setCategories(data)
  }
  const onSelectGif = (item) => {
    setGifAttachment(item)
    setDebouncedGifInput('')
    setSearchText('')
    if (!isMobile) setShowModal(false)
    else setShowGiphyDrawer(false)
  }

  useDebounce(
    () => {
      setSearchText(debouncedGifInput)
    },
    1000,
    [debouncedGifInput]
  )

  useEffect(() => {
    fetchGiphyCategories()
  }, [])

  const fetchGifs = (offset) => {
    return giphyFetch.search(searchText, { offset, limit: 10 })
  }

  const handleSearch = (evt) => {
    const keyword = evt.target.value
    setDebouncedGifInput(keyword)
  }
  const handleClick = (event) => {
    event.stopPropagation()
  }

  const { isMobile } = useDevice()

  return (
    <>
      {!isMobile ? (
        <div
          className="fixed top-0 left-0 no-scrollbar w-full h-full"
          style={{ zIndex: 50 }}
        >
          <div className="relative w-full h-full">
            <div
              className={`w-full h-full absolute z-10`}
              onClick={() => setShowModal(false)}
            />
            <div
              onClick={handleClick}
              className={`absolute z-40 bg-p-bg text-p-text sm:rounded-xl  p-3 sm:w-[550px]`}
              style={{
                bottom: bottom,
                left: left,
                top: 'auto',
                right: 'auto'
              }}
            >
              <div className={`m-2 ${className}`}>
                <input
                  type="text"
                  placeholder={`Search for GIFs`}
                  value={debouncedGifInput}
                  onChange={handleSearch}
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              <div className="flex h-[45vh] overflow-y-auto overflow-x-hidden">
                {debouncedGifInput ? (
                  <Grid
                    onGifClick={(item) => onSelectGif(item)}
                    fetchGifs={fetchGifs}
                    width={550}
                    hideAttribution
                    columns={3}
                    noResultsMessage={
                      <div className="grid h-full place-items-center">
                        <p>No GIFs found.</p>
                      </div>
                    }
                    noLink
                    key={searchText}
                  />
                ) : (
                  <div className="grid w-full grid-cols-2 gap-1">
                    {categories.map((category) => (
                      <button
                        type="button"
                        key={category.name_encoded}
                        className="relative flex outline-none"
                        onClick={() => setDebouncedGifInput(category.name)}
                      >
                        <img
                          className="h-32 w-full cursor-pointer object-cover"
                          height={128}
                          src={category.gif?.images?.original_still.url}
                          alt=""
                          draggable={false}
                        />
                        <div className="absolute right-0 bottom-0 w-full bg-gradient-to-b from-transparent to-gray-800 py-1 px-2 text-right text-lg font-bold text-white">
                          <span className="capitalize">{category.name}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div onClick={handleClick} className={`bg-p-bg text-p-text  p-3 `}>
            <div className={`m-2 `}>
              <input
                type="text"
                placeholder={`Search for GIFs`}
                value={debouncedGifInput}
                onChange={handleSearch}
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            <div className="flex h-[45vh] overflow-y-auto overflow-x-hidden no-scrollbar   ">
              {debouncedGifInput ? (
                <Grid
                  onGifClick={(item) => onSelectGif(item)}
                  fetchGifs={fetchGifs}
                  width={380}
                  hideAttribution
                  columns={2}
                  noResultsMessage={
                    <div className="grid h-full w-full place-items-center">
                      <p>No GIFs found.</p>
                    </div>
                  }
                  noLink
                  key={searchText}
                />
              ) : (
                <div className="grid w-full grid-cols-2 gap-1">
                  {categories.map((category) => (
                    <button
                      type="button"
                      key={category.name_encoded}
                      className="relative flex outline-none"
                      onClick={() => setDebouncedGifInput(category.name)}
                    >
                      <img
                        className="h-32 w-full cursor-pointer object-cover"
                        height={128}
                        src={category.gif?.images?.original_still.url}
                        alt=""
                        draggable={false}
                      />
                      <div className="absolute right-0 bottom-0 w-full bg-gradient-to-b from-transparent to-gray-800 py-1 px-2 text-right text-lg font-bold text-white">
                        <span className="capitalize">{category.name}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default GifSelector
