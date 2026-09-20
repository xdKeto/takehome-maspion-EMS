import av1 from "@/assets/avatars/boy/AV1.png"
import av2 from "@/assets/avatars/boy/AV2.png"
import av3 from "@/assets/avatars/boy/AV3.png"
import av4 from "@/assets/avatars/boy/AV4.png"
import av5 from "@/assets/avatars/boy/AV5.png"
import av6 from "@/assets/avatars/boy/AV6.png"
import av7 from "@/assets/avatars/boy/AV7.png"
import av8 from "@/assets/avatars/boy/AV8.png"
import av9 from "@/assets/avatars/boy/AV9.png"
import av10 from "@/assets/avatars/boy/AV10.png"
import av51 from "@/assets/avatars/girl/AV51.png"
import av52 from "@/assets/avatars/girl/AV52.png"
import av53 from "@/assets/avatars/girl/AV53.png"
import av54 from "@/assets/avatars/girl/AV54.png"
import av55 from "@/assets/avatars/girl/AV55.png"
import av56 from "@/assets/avatars/girl/AV56.png"
import av57 from "@/assets/avatars/girl/AV57.png"
import av58 from "@/assets/avatars/girl/AV58.png"
import av59 from "@/assets/avatars/girl/AV59.png"
import av60 from "@/assets/avatars/girl/AV60.png"

export const avatarMap: Record<string, string> = {
  "boy/AV1.png": av1,
  "boy/AV2.png": av2,
  "boy/AV3.png": av3,
  "boy/AV4.png": av4,
  "boy/AV5.png": av5,
  "boy/AV6.png": av6,
  "boy/AV7.png": av7,
  "boy/AV8.png": av8,
  "boy/AV9.png": av9,
  "boy/AV10.png": av10,
  "girl/AV51.png": av51,
  "girl/AV52.png": av52,
  "girl/AV53.png": av53,
  "girl/AV54.png": av54,
  "girl/AV55.png": av55,
  "girl/AV56.png": av56,
  "girl/AV57.png": av57,
  "girl/AV58.png": av58,
  "girl/AV59.png": av59,
  "girl/AV60.png": av60,
}

const DEFAULT_AVATAR_KEY = "boy/AV1.png"

export function resolveAvatar(key: string | null | undefined): string {
  return (key && avatarMap[key]) || avatarMap[DEFAULT_AVATAR_KEY]
}
