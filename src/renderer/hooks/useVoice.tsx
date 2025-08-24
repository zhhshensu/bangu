import { useEffect, useState } from "react";
import type { VoiceListItem } from "../services/VoiceService";
import { VoiceService } from "../services/VoiceService";

const useVoice = () => {
  const [voices, setVoices] = useState<VoiceListItem[]>([]);
  const [total, setTotal] = useState<number>(0);

  useEffect(() => {
    VoiceService.list().then((info) => {
      const { total, items } = info;
      setVoices(items);
      setTotal(total);
    });
  }, []);

  return { voices, total,setVoices };
};

export default useVoice;
