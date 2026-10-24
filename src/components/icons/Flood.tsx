/********************************************************************* 
Author: Sukanta Manna  
Purpose: Render high-contrast vector logo for flood.
**********************************************************************/
import type { SVGProps } from "react";

export function Flood(props: SVGProps<SVGSVGElement>) {
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
      {/* Roof */}
      <path d="M4 10l8-6 8 6" />
      
      {/* House Base / Door (Submerged) */}
      <path d="M6 11.5V16" />
      <path d="M18 11.5V16" />
      <path d="M11 12v3h2v-3" />

      {/* Top Water Wave */}
      <path d="M3 16c2.5 0 3.5-1 6-1s3.5 1 6 1 3.5-1 6-1" />

      {/* Bottom Water Wave */}
      <path d="M3 20c2.5 0 3.5-1 6-1s3.5 1 6 1 3.5-1 6-1" />
    </svg>
  );
}

export default Flood;