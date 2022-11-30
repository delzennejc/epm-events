
const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY

interface LocationMapType {
    address: string;
}

const LocationMap = ({ address }: LocationMapType) => {
    const location = encodeURI(address)
    const startSrc = 'https://maps.googleapis.com/maps/api/staticmap?center'
    const src = `${startSrc}=${location}&zoom=17&size=800x220&markers=size:mid%7Ccolor:red%7C${location}&key=${apiKey}`
    return (
        <div className="map-drop-shadow inline-flex self-start overflow-hidden rounded-2xl">
            <img src={src} alt="location" />
        </div>
    )
}

export default LocationMap;