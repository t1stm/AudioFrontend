import "./Settings.scss"

import { useAppDispatch, useAppSelector } from "../../state/hooks"
import type { ChangeEvent } from "react";
import { useState } from "react"
import { useCallback } from "react"
import type { RootState } from "../../state/store"
import { setBitrate, setCodec } from "../../state/settings/settingsSlice"
import { updateRoomInfo } from "../../state/rooms/roomSlice"
import playerService from "../../state/websockets/playerService"

const BitRates = [8, 16, 32, 48, 64, 96, 112, 128, 160, 192, 224, 256, 320]
const Settings = () => {
  const { currentCodec, supportedCodecs, bitrate, initialRoomName, initialRoomDescription } = useAppSelector(
    (state: RootState) => {
      return {
        currentCodec: state.settings.currentCodec,
        supportedCodecs: state.settings.supportedCodecs,
        bitrate: state.settings.bitrate,
        initialRoomName: state.rooms.currentRoom?.name,
        initialRoomDescription: state.rooms.currentRoom?.description,
      }
    },
  )

  const dispatch = useAppDispatch()
  const codecSelect = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      const selectedName = e.currentTarget.value

      const codec = supportedCodecs.find(info => {
        return info.name === selectedName
      })

      if (!codec) return
      dispatch(setCodec(codec))
    },
    [dispatch, supportedCodecs],
  )

  const bitrateSelect = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      const value = e.currentTarget.value
      const bitrate = Number.parseInt(value)

      if (!bitrate) return
      dispatch(setBitrate(bitrate))
    },
    [dispatch],
  )

  const codecIsFLAC = currentCodec.name === "FLAC";
  const [roomName, setRoomName] = useState(initialRoomName ?? "")
  const [roomDescription, setRoomDescription] = useState(initialRoomDescription ?? "")

  return (
    <div className={"settings"}>
      <p>Quality</p>
      <span>These changes apply automatically for the next added song.</span>
      <div className={"settings-section"}>
        <span>Codec: </span>
        <select onChange={codecSelect} value={currentCodec.name}>
          {supportedCodecs.map(c => (
            <option key={c.name} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className={"settings-section"}>
        <span>Bitrate: </span>
        <select
          onChange={bitrateSelect}
          value={codecIsFLAC ? "Lossless" : bitrate}
          disabled={codecIsFLAC}
        >
          {BitRates.map(b => (
            <option key={b} value={b}>
              {b}kbps
            </option>
          ))}
          {
            codecIsFLAC ? <option value={"Lossless"}>Lossless VBR</option> : <></>
          }
        </select>
      </div>

      <hr />
      <p>Room Settings</p>
      <span>These fields only work when connected to a room.</span>

      <div className={"settings-section"}>
        <span>Name: </span>
        <input
          type={"text"}
          placeholder={"Name..."}
          value={roomName}
          onChange={e => setRoomName(e.target.value)}
        />
      </div>

      <div className={"settings-section"}>
        <span>Description: </span>
        <input
          type={"text"}
          placeholder={"Description..."}
          value={roomDescription}
          onChange={e => setRoomDescription(e.target.value)}
        />
      </div>

      <div className={"settings-section"}>
        <button
          onClick={() => {
            if (playerService.isConnected()) {
              if (roomName.trim().length !== 0)
                playerService.send(`updateroom name ${roomName}`)
              if (roomDescription.trim().length !== 0)
                playerService.send(`updateroom description ${roomDescription}`)
              return
            }
            dispatch(
              updateRoomInfo({
                name: roomName,
                description: roomDescription,
              }),
            )
          }}
        >
          Apply
        </button>
      </div>
    </div>
  )
}

export default Settings
