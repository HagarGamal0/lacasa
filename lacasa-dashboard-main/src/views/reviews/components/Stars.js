import React from 'react'
import CsLineIcons from 'cs-line-icons/CsLineIcons';

const Stars = ({ n }) => {
  const stars = []
  for (let i = 0; i < n; i += 1) {
    stars.push(<CsLineIcons icon="star" key={i} fill='gold' />)
  }

  return (
    <div className="Stars">
      {stars}
    </div>
  )
}

export default Stars