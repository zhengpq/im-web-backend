import COS from 'cos-nodejs-sdk-v5';
import { cosConfig } from 'src/config';

const cos = new COS(cosConfig);

export default cos;
