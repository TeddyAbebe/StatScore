declare module "react-world-flags" {
  import React from "react";

  interface FlagProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    code?: string;
    fallback?: React.ReactNode;
    height?: number | string;
    width?: number | string;
  }

  const Flag: React.FC<FlagProps>;
  export default Flag;
}
