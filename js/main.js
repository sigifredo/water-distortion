
import Environment from './Environment';
import Geometry from './Geometry';
import Lights from './Lights';

const env = new Environment(true);
new Geometry(env);
new Lights(env);

env.render();
