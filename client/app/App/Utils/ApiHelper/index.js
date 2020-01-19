import { registerApi } from "./provider";

export const ApiHelper = {
  todo: registerApi({
    url: '/todo/'
  })
}

export default ApiHelper
