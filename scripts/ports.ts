export const PORTS = {
  KATALYST_CORE: 20007,
  KATALYST_REMIX: 20008, 
  KATALYST_NEXTJS: 20009,
  
  RSDOCTOR: 20008,
  STORYBOOK: 20009,
  
  REACTONRUST: 20010,
} as const;

export type PortName = keyof typeof PORTS;
export type PortValue = typeof PORTS[PortName];
