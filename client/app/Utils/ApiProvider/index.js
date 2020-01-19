import _get from 'lodash/get';
import _isFunction from 'lodash/isFunction';
import _isString from 'lodash/isString';
import _isArray from 'lodash/isArray';

const Status = {
  OK: 200,
  REDIRECT: 300,
  FORBIDDEN: 403,
}

const SUCCESS_STATUS_CODE = Status.OK;
const REDIRECT_STATUS_CODE = Status.REDIRECT;
const FORBIDDEN_STATUS_CODE = Status.FORBIDDEN;


const loadMoreHelper = ({payload, method, config={}, response, dispatch, loadMoreArgs}) => {
  if(!payload.hasMore) return;

  const nextUrl = response.data.next;
  const executor = serializeUrl({
    ...config,
    BASE_URL: '',
    url: nextUrl,
    type: method,
    isUrlString: true,
    isUrlFunc: false
  })

  const action = actionBuilder({
    ...config,
    apiType: method,
    config,
    axiosRequest: executor,
    oldPayload: payload,
    oldDispatch: dispatch,
  })

  return action(...loadMoreArgs);
}


const generateData = ({oldPayload, response}) => {
  let data = _get(response, 'data.results', _get(response, 'data', false));
  if(!_isArray(data)) return data;

  const hadMore = _get(oldPayload, 'hasMore', false);
  if(!hadMore) return data;

  const oldData = _get(oldPayload, 'data', false);
  if(!_isArray(oldData)) return data;

  return [...oldData, ...data]
}

const dispatchAction = ({config, method, oldPayload, dispatch, isInvalidReduxRequest, ...extra}) => {
  const { response } = extra;

  const payload = {
    data: generateData({ oldPayload, response }),
    loading: false,
    error: false,
    hasMore: Boolean(_get(response, 'data.next', false)),
    loadMore: (...args) => {
      return loadMoreHelper({
        payload,
        method,
        config,
        response,
        dispatch,
        loadMoreArgs: args,
      })
    },
    getData: (path, defaultValue) => {
      if(path){
        return _get(payload.data, path, defaultValue)
      }

      return payload.data
    },
    is: {
      success: null,
      error: null,
      forbidden: null,
    },
    ...extra,
  }

  payload.is.success = ((
    !payload.loading && !payload.error
  ) && (
    response
  ) && (
    response.status >= SUCCESS_STATUS_CODE
  ) && (
    response.status < REDIRECT_STATUS_CODE
  ))

  payload.is.error = ((
    !payload.loading && !response
  ) && (
    payload.error && payload.error.response
  ))

  payload.is.forbidden = ((
    payload.is.error
  ) && (
    payload.error.response.status == FORBIDDEN_STATUS_CODE
  ))

  if(isInvalidReduxRequest) return payload;
  if(!dispatch) return payload;

  dispatch(payload);
}


const extractArgsOfFunc = (func) => {
  const accessedKeys = []
  const obj = new Proxy({}, {
    get: function(target, name){
      accessedKeys.push(name)
      return target[name]
    }
  })

  func(obj)
  return accessedKeys
}


const filterReservedParams = (params, reservedParams) => {
  const newParams = {}
  const allKeys = Object.keys(params)

  allKeys.forEach(key => {
    const isReserved = reservedParams.includes(key)

    if(!isReserved){
      newParams[key] = params[key]
    }
  })

  return newParams
}

/*
Return Array:
  [Data, Args]
Args index is 0:
  - If request type is 'GET' or 'DELETE'.
Args index is 1:
  - If request type is 'POST', 'PATCH' or 'PUT'.
Data index is 0:
  - If request type is 'POST', 'PATCH' or 'PUT'.
*/
const extractArgsAndData = (allArgs, requestType) => {
  const patchList = [
    'post',
    'patch',
    'put',
  ]

  let argsIndex = 0;
  let dataIndex = null;

  if(patchList.includes(requestType)){
    dataIndex = 0;
    argsIndex = 1;
  }

  const data = allArgs[dataIndex];
  const args = allArgs[argsIndex];

  return [data, args];
}


/*
First arg is api param:
  - If request type is 'GET' or 'DELETE'
First arg is api data:
  - If request type is 'POST', 'PATCH' or 'PUT'
Second arg is api param:
  - If request type is 'POST', 'PATCH' or 'PUT'
*/
const serializeUrl = ({BASE_URL, url, type, axios, isUrlString, isUrlFunc, reservedParams}) => {
  const executor = (...allArgs) => {
    const [ _data, _args ] = extractArgsAndData(allArgs, type);
    const hasArgs = _args != undefined;
    const hasData = _data != undefined;

    const args = _args || {};
    const data = _data || {};

    const requestParams = [];
    let fullUrl = BASE_URL;

    const params = {
      params: isUrlFunc ?
        filterReservedParams(args, reservedParams)
      : args
    }

    if(isUrlString){
      fullUrl += url
    }

    if(isUrlFunc){
      fullUrl += url(args)
    }

    requestParams.push(fullUrl)

    if(hasData){
      requestParams.push(data)
    }
    requestParams.push(params)

    return axios[type](...requestParams)
  }
  return executor
}

const createReduxReducer = ({ACTION_LIST}={}) => {
  const initState = dispatchAction({})

  return (state=initState, action) => {
    switch (action.type) {
      case ACTION_LIST.get:
        return action
      default:
        return state
    }
  }
}


const actionBuilder = ({API, isInvalidReduxRequest, oldDispatch, apiType, ACTION_LIST, config, axiosRequest, oldPayload}) => {
  const defaultAxiosRequest = API[apiType];
  if(axiosRequest == undefined){
    axiosRequest = defaultAxiosRequest;
  }

  const dispatchRequest = ({...extra}) => dispatchAction({
    config,
    oldPayload,
    method: apiType,
    isInvalidReduxRequest,
    ...extra
  })

  const simpleAction = (...args) => {
    return new Promise((resolve, reject) => {
      const onSuccess = (response) => {
        resolve(
          dispatchRequest({ response })
        )
      }

      const onError = (error) => {
        reject(
          dispatchRequest({ error })
        )
      }

      axiosRequest(...args).then(onSuccess).catch(onError);
    })
  }

  if(isInvalidReduxRequest) return simpleAction;

  const reduxActionType = ACTION_LIST[apiType];

  const reduxAction = (...args) => (dispatch, getState) => {
    const reduxDispatchRequest = ({...extra}) => dispatchRequest({
      type: reduxActionType,
      dispatch,
      store: getState(),
      ...extra
    })

    const onSuccess = (response) => {
      reduxDispatchRequest({
        response,
      })
    }

    const onError = (error) => {
      reduxDispatchRequest({
        error,
      })
    }

    reduxDispatchRequest({
      loading: true
    })

    axiosRequest(...args).then(onSuccess).catch(onError)
  }

  if(oldDispatch){
    return (...args) => reduxAction(...args)(oldDispatch);
  }

  return Object.assign(reduxAction, {
    reduxAction,
    axiosRequest: simpleAction,
    actionType: reduxActionType,
  })

}


export const ReduxApiProvider = ({axios, urlPrefix=""}) => {
  const RootReducer = {};

  const registerApi = ({url, actionType='', stateName=''}) => {
    const config = {
      axios,
      urlPrefix,
      RootReducer,
      url,
      actionType,
      stateName,
      BASE_URL: urlPrefix,
      isUrlString: _isString(url),
      isUrlFunc: _isFunction(url),
      reservedParams: [],
      isInvalidReduxRequest: (actionType == '' || stateName == ''),
      ACTION_LIST: {
        get: `${actionType}_GET`,
        delete: `${actionType}_DELETE`,
        post: `${actionType}_POST`,
        patch: `${actionType}_PATCH`,
        put: `${actionType}_PUT`,
      },
      API: {},
      ACTION: {
        get: (params={}) => {},
        delete: (params={}) => {},
        post: (data={}, params={}) => {},
        patch: (data={}, params={}) => {},
        put: (data={}, params={}) => {},
      },
    }

    // Example Configuration
    /**
      config = {
        axios,
        urlPrefix: '/api/v1',
        RootReducer: {},
        url: `pharmacy/product/form/`,
        actionType: ProductFormAction,
        isUrlString: true,
        isUrlFunc: false,
        isInvalidReduxRequired: false,
        ACTION_LIST: {
          get: `ProductFormAction_GET`,
          delete: `ProductFormAction_DELETE`,
          post: `ProductFormAction_POST`,
          patch: `ProductFormAction_PATCH`,
          put: `ProductFormAction_PUT`,
        },
        API: {
        },
        ACTION: {
          get: (params={}) => {},
          delete: (params={}) => {},
          post: (data={}, params={}) => {},
          patch: (data={}, params={})  => {},
          put: (data={}, params={})  => {},
        }
      }
     *
     */

    if(config.isUrlFunc) config.reservedParams = extractArgsOfFunc(config.url);

    config.API = {
      get: serializeUrl({...config, type: 'get'}),
      delete: serializeUrl({...config, type: 'delete'}),
      post: serializeUrl({...config, type: 'post'}),
      patch: serializeUrl({...config, type: 'patch'}),
      put: serializeUrl({...config, type: 'put'}),
    }

    config.ACTION = {
      get: actionBuilder({...config, config, apiType: 'get'}),
      delete: actionBuilder({...config, config, apiType: 'delete'}),
      post: actionBuilder({...config, config, apiType: 'post'}),
      patch: actionBuilder({...config, config, apiType: 'patch'}),
      put: actionBuilder({...config, config, apiType: 'put'}),
    }

    if(config.isInvalidReduxRequest){
      return {
        ...(config.ACTION)
      }
    }

    RootReducer[stateName] = createReduxReducer({...config});
    return {
      ...(config.ACTION),
      stateName: config.stateName,
      getState: (state) => state[config.stateName],
    }
  }

  return {
    registerApi,
    getReducer: () => RootReducer
  }
}

export default ReduxApiProvider;
