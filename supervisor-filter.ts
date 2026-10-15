import type {Supervisor} from './supervisors';
export function matchesDegree(s:Pick<Supervisor,'levels'>,degree:string,includeUnknown=true){return !degree||(degree==='unconfirmed'?!s.levels.length:s.levels.includes(degree)||(includeUnknown&&!s.levels.length));}
