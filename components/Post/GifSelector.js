import React, { useEffect, useState } from 'react'
import { Grid } from '@giphy/react-components'
import { GiphyFetch } from '@giphy/js-fetch-api'
import { useDebounce } from '../Common/Hook/useDebounce'
import PopUpWrapper from '../Common/PopUpWrapper'
import { usePopUpModal } from '../Common/CustomPopUpProvider'

const giphyFetch = new GiphyFetch('sXpGFDGZs0Dv1mmNFvYaGUvYwKX0PWIh')

const GifSelector = ({ setGifAttachment }) => {
  const [categories, setCategories] = useState([])
  const [debouncedGifInput, setDebouncedGifInput] = useState('')
  const [searchText, setSearchText] = useState('')
  const { hideModal } = usePopUpModal()

  const fetchGiphyCategories = async () => {
    const { data } = await giphyFetch.categories()
    // TODO: we can persist this categories
    setCategories(data)
  }
  const onSelectGif = (item) => {
    setGifAttachment(item)
    setDebouncedGifInput('')
    setSearchText('')
    hideModal()
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

  return (
    <PopUpWrapper title="Select GIF">
      <div className="m-3">
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
    </PopUpWrapper>
  )
}

export default GifSelector
