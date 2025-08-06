import React from 'react'

const Background = () => {
  return (
    <div className="background">
      <div className="background-overlay"></div>
      {/* You can replace this with an actual anime GIF URL */}
      <img 
        src="https://i.pinimg.com/originals/7f/27/9f/7f279f0c6e0e7b6d9b0b1b9b7b3b5b9b.gif" 
        alt="Lo-fi anime background"
        className="background-gif"
        onError={(e) => {
          // Fallback to a solid color background if GIF fails to load
          e.target.style.display = 'none';
        }}
      />
    </div>
  )
}

export default Background
