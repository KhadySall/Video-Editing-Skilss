import {Composition} from 'remotion';
import {CareerDemo} from './compositions/CareerDemo';
import {Ep01RapportDePouvoir, EP01_FPS, EP01_TOTAL} from './compositions/Ep01RapportDePouvoir';
import '@fontsource/inter/400.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import '@fontsource/inter/800.css';

export const Root = () => (
  <>
    <Composition id="CareerDemo" component={CareerDemo} durationInFrames={432} fps={30} width={1080} height={1920} />
    <Composition id="Ep01RapportDePouvoir" component={Ep01RapportDePouvoir}
      durationInFrames={EP01_TOTAL} fps={EP01_FPS} width={1080} height={1920} />
  </>
);
