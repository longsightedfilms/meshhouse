import Local from './local';
// Remote databases
//import SFMLab from './remote/sfmlab_based/sfmlab';
//import Smutbase from './remote/sfmlab_based/smutbase';
//import Open3DLab from './remote/sfmlab_based/open3dlab';

/*const integrations: Integrations = {
  local: Local,
  sfmlab: SFMLab,
  smutbase: Smutbase,
  open3dlab: Open3DLab
};*/

const integrations: Integrations = {
  local: Local
};

export default integrations;
