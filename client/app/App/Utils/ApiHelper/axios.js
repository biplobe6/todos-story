import Axios from 'axios';


export const axiosInstance = Axios.create({
  baseURL: '/',
  xsrfHeaderName: 'X-CSRFToken',
  xsrfCookieName: 'csrftoken',
})

export default axiosInstance
