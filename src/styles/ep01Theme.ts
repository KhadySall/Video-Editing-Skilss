// Dark premium palette for Episode 1 "Le rapport de pouvoir".
export const ep01 = {
  colors: {
    bg0: '#080B11',
    bg1: '#0F1826',
    panel: 'rgba(255,255,255,0.045)',
    panelBorder: 'rgba(255,255,255,0.10)',
    text: '#F3F7FB',
    muted: '#93A4B3',
    gold: '#F6B94D', // power / authority
    teal: '#37E0BE', // collaboration / balance
    coral: '#FF6B6B', // imbalance / warning
    ink: '#0A0E14',
  },
  font: 'Inter, system-ui, sans-serif',
  spring: {damping: 22, stiffness: 150, mass: 0.9},
  safe: {x: 92, top: 150, bottom: 150},
} as const;
