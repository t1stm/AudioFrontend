import "./Settings.scss"

import { useAppDispatch, useAppSelector } from "../../state/hooks"
import { ChangeEvent, useCallback, useEffect } from "react"
import { RootState } from "../../state/store"
import { Codec, CodecInfo } from "../../objects/codecs"
import { setCodec } from "../../state/settings/settingsSlice"

const Settings = () => {
  const { supportedCodecs } = useAppSelector((state: RootState) => {
    return {
      currentCodec: state.settings.currentCodec as Codec,
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
  }, []);

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
