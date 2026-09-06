import {Composition} from 'remotion';
import {CareerDemo} from './compositions/CareerDemo';
import {Ep01RapportDePouvoir} from './compositions/Ep01RapportDePouvoir';
import timeline from '../public/media/ep01/timeline.json';
import '@fontsource/inter/400.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import '@fontsource/inter/800.css';

const EP01_FPS = 30;
const ep01Frames = Math.round((timeline as {totalMs: number}).totalMs / 1000 * EP01_FPS);

export const Root = () => (
  <>
    <Composition id="CareerDemo" component={CareerDemo} durationInFrames={432} fps={30} width={1080} height={1920} />
    <Composition id="Ep01RapportDePouvoir" component={Ep01RapportDePouvoir}
      durationInFrames={ep01Frames} fps={EP01_FPS} width={1080} height={1920} />
  </>
);
