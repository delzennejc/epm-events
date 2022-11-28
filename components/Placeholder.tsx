import ContentLoader from "react-content-loader"
import { useAppState } from "../store"

interface PlaceholderType {
    type: 'logo' | 'image' | 'app'
}

const Placeholder = ({ type }: PlaceholderType) => {
  const isMobile: boolean = useAppState((state) => state.data.ui.isMobile)
    if (type === 'logo') {
        return <LogoLoader isMobile={isMobile} />
    } else if (type === 'image') {
        return <AppImageLoader isMobile={isMobile} />
    }
    return <AppLoader isMobile={isMobile} />
}

export default Placeholder

const AppImageLoader = (props: any) => (
    <ContentLoader 
      speed={3}
      width={455}
      height={238}
      viewBox="0 0 455 238"
      backgroundColor="#594bb1"
      foregroundColor="#9e91fd"
      {...props}
    >
      <rect x="-24" y="-7" rx="0" ry="0" width="551" height="360" />
    </ContentLoader>
)

const LogoLoader = (props: any) => (
    <ContentLoader 
      speed={3}
      width={80}
      height={80}
      viewBox="0 0 80 80"
      backgroundColor="#594BB1"
      foregroundColor="#9E91FD"
      {...props}
    >
      <rect x="-24" y="-7" rx="0" ry="0" width="143" height="115" />
    </ContentLoader>
)

const AppLoader = (props: any) => (
  <ContentLoader 
    speed={3}
    width={props.isMobile ? 300 : 752}
    height={112}
    viewBox="0 0 752 112"
    backgroundColor="#362e71"
    foregroundColor="#534a96"
    {...props}
  >
    <circle cx="50" cy="58" r="49" /> 
    <rect x="117" y="15" rx="5" ry="5" width="123" height="16" /> 
    <rect x="120" y="50" rx="5" ry="5" width="341" height="12" /> 
    <rect x="120" y="82" rx="5" ry="5" width="232" height="8" /> 
    <rect x="660" y="4" rx="7" ry="7" width="90" height="35" />
  </ContentLoader>
)


