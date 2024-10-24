import type React from "react"
import "./PlatformBlip.scss"

export interface PlatformInfo {
  color: string | null
  prettyName: string
}

const PlatformBlip: React.FC<PlatformInfo> = ({ color, prettyName }) => {
  return (
    <div
      className="platform-blip"
      style={{
        background: color ?? "",
      }}
    >
      {prettyName}
    </div>
  )
}

export default PlatformBlip
