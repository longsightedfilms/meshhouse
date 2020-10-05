import Local from './local';
// Remote databases
import SFMLab from './remote/sfmlab';
import Smutbase from './remote/smutbase';
import Open3DLab from './remote/open3dlab';

const integrations: Integrations = {
  local: Local,
  sfmlab: SFMLab,
  smutbase: Smutbase,
  open3dlab: Open3DLab
};

export default integrations;
