import { createContext, useState, useContext } from 'react'

const AirdropContext = createContext()

export function AirdropProvider({ children }) {
    const [cryptoDrop, setCryptoDrop] = useState(false);
    const [neonDrop, setNeonDrop] = useState(false);
    const [celestialDrop, setCelestialDrop] = useState(false);
    const [futureDrop, setFutureDrop] = useState(false);
    const [phase, setPhase] = useState(1);
    const [cryptoAir, setCryptoAir] = useState([]);
    const [selectedCryptoAir, setSelectedCryptoAir] = useState([]);
    const [neonAir, setNeonAir] = useState([]);
    const [selectedNeonAir, setSelectedNeonAir] = useState([]);
    const [celestialAir, setCelestialAir] = useState([]);
    const [selectedCelestialAir, setSelectedCelestialAir] = useState([]);
    const [futureAir, setFutureAir] = useState([]);
    const [selectedFutureAir, setSelectedFutureAir] = useState([]);
    const [searchAddress, setSearchAddress] = useState();
  
  return (
    <AirdropContext.Provider
      value={{
        cryptoDrop, setCryptoDrop,
        neonDrop, setNeonDrop,
        celestialDrop, setCelestialDrop,
        futureDrop, setFutureDrop,
        phase, setPhase,
        cryptoAir, setCryptoAir,
        selectedCryptoAir, setSelectedCryptoAir,
        neonAir, setNeonAir,
        selectedNeonAir, setSelectedNeonAir,
        celestialAir, setCelestialAir,
        selectedCelestialAir, setSelectedCelestialAir,
        futureAir, setFutureAir,
        selectedFutureAir, setSelectedFutureAir,
        searchAddress, setSearchAddress,
      }}
    >
      {children}
    </AirdropContext.Provider>
  )
}

//Export useContext Hook
export function useAirdropContext() {
  return useContext(AirdropContext)
}
