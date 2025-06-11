import { useEffect, useState } from "react";
import { VoiceService } from "../services/VoiceService";

const useSpeakers = () => {
  const [speakers, setSpeakers] = useState<any[]>([]);

  useEffect(() => {
    VoiceService.getSpeakers().then((info) => {
      setSpeakers(info as any);
    });
  }, []);

  return { speakers };
};

export default useSpeakers;
