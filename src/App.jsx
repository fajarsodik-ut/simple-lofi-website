import React from 'react'
import Background from './components/Background'
import Player from './components/Player'

function App() {
  return (
    <div className="App">
      <Background />
      <div className="content">
        <h1 className="title">Lo-Fi Vibes</h1>
        <Player />
      </div>
    </div>
  )
}

export default App
