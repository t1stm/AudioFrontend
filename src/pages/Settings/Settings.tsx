import "./Settings.scss"

import { useAppDispatch, useAppSelector } from "../../state/hooks"
import type { ChangeEvent} from "react";
import { useCallback } from "react"
import type { RootState } from "../../state/store"
import type { CodecInfo } from "../../objects/codecs"
import { setCodec } from "../../state/settings/settingsSlice"

const Settings = () => {
  const { supportedCodecs } = useAppSelector((state: RootState) => {
    return {
      currentCodec: state.settings.currentCodec as CodecInfo,
      supportedCodecs: state.settings.supportedCodecs as CodecInfo[]
    }
  });
  const dispatch = useAppDispatch();
  const selectCallback = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
    console.log(e)
    const selectedName = e.currentTarget.value;

    const codec = supportedCodecs.find(info => {
      return info.name === selectedName;
    })

    if (!codec) return
    dispatch(setCodec(codec))
  }, [dispatch, supportedCodecs]);

  return (
    <div>
      <select onChange={selectCallback}>
        {supportedCodecs.map(c => (
          <option key={c.name} value={c.name}>{c.name}</option>
        ))}
      </select>
    </div>
  )
}

export default Settings
