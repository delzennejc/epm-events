
const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY

interface LocationMapType {
    address: string;
    isMobile: boolean;
}

const LocationMap = ({ address, isMobile }: LocationMapType) => {
    const location = encodeURI(address)
    const startSrc = 'https://maps.googleapis.com/maps/api/staticmap?center'
    const size = isMobile ? '640x640' : '640x200'
    const zoom = isMobile ? '18' : '15'
    const src = `${startSrc}=${location}&zoom=${zoom}&size=${size}&markers=size:mid%7Ccolor:red%7C${location}&key=${apiKey}`
    return (
        <div className="w-full flex map-drop-shadow self-start cursor-pointer" onClick={() => window.open(`https://maps.google.com?q=${location}`, "_blank")}>
            <div className="w-full flex overflow-hidden rounded-2xl">
                <img className="w-full" src={src} alt="location" />
            </div>
        </div>
    )
}

export default LocationMap;