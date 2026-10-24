/********************************************************************* 
Author: Sukanta Manna  
Purpose: Render high-contrast vector logo for Volcano.
**********************************************************************/
import type { SVGProps } from "react";

export function Volcano(props: SVGProps<SVGSVGElement>) {
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
      {/* Volcano Base / Outline */}
      <path d="M3 20h18l-3-8h-3l-2 4h-2l-2-4H8z" />
      
      {/* Eruption / Burst Lines */}
      <path d="M12 2v3" />
      <path d="M8.5 4.5l1.5 2" />
      <path d="M15.5 4.5l-1.5 2" />
    </svg>
  );
}

export default Volcano;