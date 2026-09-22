import { useState, useEffect } from 'react'
import TerminalHero from './components/TerminalHero'
import ZoomSequence from './components/ZoomSequence'
import UzbekWorld from './components/UzbekWorld'
import PortfolioSection from './components/PortfolioSection'

export default function App() {
  const [dismissed, setDismissed] = useState(true) //TODO: change to false for prod

  useEffect(() => {
    document.body.style.overflow = dismissed ? '' : 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [dismissed])

  return (
    <div style={{ background: '#050a05' }}>
      {/*<TerminalHero dismissed={dismissed} onDismiss={() => setDismissed(true)} /> TODO: activate for prod*/}
      <div
        style={{
          opacity: dismissed ? 1 : 0,
          transition: 'opacity 1.5s ease',
          pointerEvents: dismissed ? 'auto' : 'none',
        }}
      >
        <ZoomSequence />
        <UzbekWorld />
        <PortfolioSection />
      </div>
    </div>
  )
}
