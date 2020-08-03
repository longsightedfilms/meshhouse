import Local from './local';
// Remote databases
import SFMLab from './remote/sfmlab';

const integrations: Integrations = {
  local: Local,
  sfmlab: SFMLab
};

export default integrations;
