import ReduxApiProvider from "Utils/ApiProvider";
import axiosInstance from "./axios";


export const apiProvider = ReduxApiProvider({
  urlPrefix: "/api/v1",
  axios: axiosInstance,
})


export const {registerApi} = apiProvider;
