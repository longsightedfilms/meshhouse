import Local from './local'

type Integrations = {
  [key: string]: any;
}

const integrations: Integrations = {
  local: Local
}

export default integrations
