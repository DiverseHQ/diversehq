import React from 'react'

const SeeMoreResultsButton = ({
  goToSearchProfilePage
}: {
  goToSearchProfilePage: () => void
}) => {
  return (
    <div
      className="pb-2 hover:underline underline-offset-3  items-center rounded-xl px-4 cursor-pointer"
      onClick={goToSearchProfilePage}
    >
      <div className="text-sm">See more results</div>
    </div>
  )
}

export default SeeMoreResultsButton
