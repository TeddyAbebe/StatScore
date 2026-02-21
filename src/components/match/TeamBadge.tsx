import { useState } from "react";

interface TeamBadgeProps {
  src?: string;
  name?: string;
  size?: number;
}

export const TeamBadge = ({ src, name, size = 52 }: TeamBadgeProps) => {
  const [errored, setErrored] = useState(false);
  const dim = `${size}px`;

  if (src && !errored) {
    return (
      <img
        src={src}
        alt={name || ""}
        style={{ width: dim, height: dim }}
        className="object-contain drop-shadow-lg"
        onError={() => setErrored(true)}
      />
    );
  }

  return (
    <div
      style={{ width: dim, height: dim }}
      className="rounded-xl bg-white/10 flex items-center justify-center font-black text-white/30 text-xl"
    >
      {name?.charAt(0)}
    </div>
  );
};
