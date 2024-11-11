import "./Settings.scss"

import { useAppDispatch, useAppSelector } from "../../state/hooks"
import type { ChangeEvent} from "react";
import { useCallback } from "react"
import type { RootState } from "../../state/store"
import type { CodecInfo } from "../../objects/codecs"
import { setBitrate, setCodec } from "../../state/settings/settingsSlice"

const BitRates = [8, 16, 32, 48, 64, 96, 112, 128, 160, 192, 224, 256, 320]
const Settings = () => {
  const { currentCodec, supportedCodecs, bitrate } = useAppSelector((state: RootState) => {
    return {
      currentCodec: state.settings.currentCodec as CodecInfo,
      supportedCodecs: state.settings.supportedCodecs as CodecInfo[],
      bitrate: state.settings.bitrate
    }
  });

  const dispatch = useAppDispatch();
  const codecSelect = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
    const selectedName = e.currentTarget.value;

    const codec = supportedCodecs.find(info => {
      return info.name === selectedName;
    })

    if (!codec) return
    dispatch(setCodec(codec))
  }, [dispatch, supportedCodecs]);

  const bitrateSelect = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.currentTarget.value;
    const bitrate = Number.parseInt(value);
    dispatch(setBitrate(bitrate))
  }, [dispatch])

  return (
    <div className={"settings"}>
      <select onChange={codecSelect}>
        {supportedCodecs.map(c => (
          <option key={c.name} value={c.name} selected={c.name === currentCodec.name}>{c.name}</option>
        ))}
      </select>

      <select onChange={bitrateSelect}>
        {BitRates.map(b => (
          <option key={b} value={b} selected={bitrate === b}>{b}kbps</option>
        ))}
      </select>
    </div>
  )
}

export default Settings
