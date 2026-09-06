// Light, educational palette for the "Psychologie du recrutement" series.
export const ep01 = {
  colors: {
    paper: '#F6F1E7', // warm cream paper
    paper2: '#EFE7D5',
    card: '#FFFFFF',
    cardBorder: 'rgba(34,48,58,0.10)',
    ink: '#21303A', // main text
    inkSoft: '#5D6B74', // secondary text
    indigo: '#5A46E0', // psychology / primary
    indigoSoft: '#EDEAFB',
    amber: '#EF9D33', // energy / company
    amberSoft: '#FCEBD2',
    green: '#149C81', // positive / you
    greenSoft: '#D9F1EB',
    coral: '#E0503C', // warning / imbalance
    coralSoft: '#FADFD9',
    line: 'rgba(34,48,58,0.14)',
  },
  font: 'Inter, system-ui, sans-serif',
  spring: {damping: 22, stiffness: 150, mass: 0.9},
  safe: {x: 92, top: 150, bottom: 150},
} as const;
