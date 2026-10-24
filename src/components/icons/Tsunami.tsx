/********************************************************************* 
Author: Sukanta Manna  
Purpose: Render high-contrast vector logo for Tsunami.
**********************************************************************/
import type { SVGProps } from "react";

export function Tsunami(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {/* Curling Wave Crest */}
      <path d="M3 15c4.5 0 6.5-6.5 9.5-10.5C14.5 1.8 17 2 17.5 4c.6 2.4-1.5 4.5-3.5 5.5-1.5.8-3.5 1.5-3 3.5.5 2 3.5 2 6 2h4" />
      
      {/* Bottom Ripples */}
      <path d="M3 18.5c2 0 3.5.8 5.5.8s3.5-.8 5.5-.8 3.5.8 5.5.8" />
    </svg>
  );
}

export default Tsunami;