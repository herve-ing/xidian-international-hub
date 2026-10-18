import React from 'react';
import type {Club} from './clubs';
// Original vector illustrations; no university photos or third-party assets.
export function ClubVisual({club}:{club:Club}){
 const id=club.id,ink='#f7f1e7',dark='#183d38',accent=club.tone==='rose'?'#bd626a':club.tone==='blue'?'#668fa4':club.tone==='amber'?'#d8a053':'#8aab8d';
 return <svg className="club-visual" viewBox="0 0 640 360" preserveAspectRatio="xMidYMid slice" role="img" aria-label={club.name} xmlns="http://www.w3.org/2000/svg"><rect width="640" height="360" fill={dark}/><circle cx="520" cy="80" r="220" fill={accent} opacity=".32"/><path d="M0 300Q240 130 640 270V360H0Z" fill={accent} opacity=".38"/><g fill="none" stroke={ink} strokeWidth="2" opacity=".16"><path d="M0 90H640M0 180H640M0 270H640M160 0V360M320 0V360M480 0V360"/><circle cx="320" cy="180" r="135"/></g><g transform="translate(320 180)"><g className="club-visual-subject" stroke={ink} strokeWidth="7" fill="none" strokeLinecap="round" strokeLinejoin="round">
 {id==='basketball'?<><circle r="102" fill={accent}/><path d="M-102 0H102M0-102V102M-73-73Q55 0-73 73M73-73Q-55 0 73 73" stroke={dark}/></>:
 ['tennis','badminton','pickleball'].includes(id)?<><g transform="rotate(30)"><ellipse cy="-30" rx="65" ry="85" fill={accent}/><path d="M0 55V135M-35-97V37M0-110V52M35-97V37M-60-60H60M-64-25H64M-56 10H56" stroke={dark} strokeWidth="4"/></g>{id==='badminton'?<path d="M95-100L135-62L100-20L63-57ZM75-45L95-25M87-60L110-42"/>:<circle cx="110" cy="70" r="24" fill={ink} stroke={accent}/>}</>:
 id==='volleyball'?<><circle r="102" fill={accent}/><path d="M0 0Q-12-80 50-88M0 0Q80 10 62 78M0 0Q-60 60-100 0M-40-94Q-50-30-4 0M96-30Q30-32 0 0M-40 94Q2 45 0 0" stroke={dark}/></>:
 id==='football'?<><circle r="102" fill={ink}/><path d="M0-42L40-12L25 36H-25L-40-12ZM0-42V-98M40-12L94-30M25 36L58 82M-25 36L-58 82M-40-12L-94-30" stroke={dark} fill={accent}/></>:
 id==='boxing'?<><path d="M-68 100L-100 0Q-115-70-64-84Q-18-106 2-52L18-18Q50-60 75-20Q91 15 47 62L42 107Z" fill={accent}/><path d="M-68 72L42 79M-78-38Q-30-66-5-15M-59 107L38 115"/></>:
 id==='open-canvas'?<><path d="M-95 55L-83-93H86L99 55ZM0 55V120M-65 120L-30 55M65 120L30 55"/><path d="M-65 29Q-28-55 1-8T65-55" stroke={accent} strokeWidth="20"/><circle cx="42" cy="-53" r="16" fill={ink} stroke="none"/></>:
 id==='singing'?<><g transform="rotate(25)"><rect x="-33" y="-115" width="66" height="117" rx="33" fill={accent}/><path d="M-55-48V-20Q-55 40 0 40Q55 40 55-20V-48M0 40V110M-40 110H40M-20-85H20M-20-65H20M-20-45H20"/></g><path d="M100-40V20M100-35L130-45V6"/><ellipse cx="88" cy="22" rx="13" ry="9" fill={ink}/></>:
 ['street-dance','chinese-dance'].includes(id)?<><circle cx="8" cy="-92" r="21" fill={accent}/><path d="M4-61L-18 5L-81 78M-18 5L51 35L80 105M-2-49L-65-39L-110-90M-2-49L63-33L100-80" strokeWidth="18"/>{id==='chinese-dance'&&<path d="M-110-90Q-135 20-100 80M100-80Q150-5 115 60" stroke={accent} strokeWidth="13"/>}</>:
 id==='fox'?<><rect x="-105" y="-50" width="210" height="140" rx="8" fill={accent}/><path d="M-105-50L-125-99L77-145L89-96ZM-85-108L-49-68M-20-123L15-83M44-137L76-99"/><path d="M-19-18L42 20L-19 58Z" fill={ink} stroke="none"/></>:
 <><path d="M-67-95H55L-32 0L55 95H-67" strokeWidth="16"/><circle cx="108" cy="-55" r="12" fill={accent}/><path d="M86 44H132M109 21V67M-125 0H-100" stroke={accent}/></>}
 </g></g><path d="M30 30H80M30 30V65M610 330H560M610 330V295" stroke={ink} strokeWidth="2" opacity=".65"/></svg>;
}
