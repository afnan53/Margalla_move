import { useState } from "react";
import { CLASS_IMAGES } from "../assets/index.js";

// Falls back to a text placeholder if the image is missing or fails to load.
export default function ClassImage({ cls }) {
  const [failed, setFailed] = useState(false);
  const src = CLASS_IMAGES[cls.type];
  if (!src || failed) {
    return <div className="img img-fallback" role="img" aria-label={`${cls.title}, no image available`}>{cls.type}</div>;
  }
  return <img className="img" src={src} alt={`${cls.title}: ${cls.type} class illustration`} onError={() => setFailed(true)} />;
}
