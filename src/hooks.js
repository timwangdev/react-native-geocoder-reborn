import Geocoder from './geocoder'

export const useGeocodePosition = (position) => {
  const [geocodePosition, setGeocodePosition] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    (async () => {
      if (!position) return

      try {
        const geocodePositions = await Geocoder.geocodePosition(position)
        setGeocodePosition(geocodePositions)
      } catch (error) {
        setError(error)
      }
    })()
  }, [position?.lat, position?.lng])

  return { geocodePosition, error }
}
