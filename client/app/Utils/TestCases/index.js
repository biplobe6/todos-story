export class TestCases {
  constructor() {
    this._unknownTests = []
    this._tests = {}
  }

  _insert(testList, test){
    if(!testList.includes(test)){
      testList.push(test)
    }
  }

  register(test, name=null){
    if(name){
      if(!this._tests[name]){
        this._tests[name] = []
      }
      this._insert(this._tests[name], test)
    } else {
      this._insert(this._unknownTests, test)
    }
  }

  run(){
    this._unknownTests.forEach(test => {
      test.apply(this)
    })
    Object.keys(this._tests).forEach(groupName => {
      describe(groupName, () => {
        this._tests[groupName].forEach(test => {
          test.apply(this)
        })
      })
    })
  }
}


export class TestCasesAuto {
  _collectTests(){
    const allTests = {
      unknownTests: [],
      tests: {}
    }

    const register = ({group, test}) => {
      if(group){
        if(!allTests.tests[group]){
          allTests.tests[group] = []
        }
        allTests.tests[group].push(test)
      } else {
        allTests.unknownTests.push(test)
      }
    }

    const _fnNames = []
    const getTestNames = (instanse) => {
      const protoType = Object.getPrototypeOf(instanse)
      if(!protoType) return;

      getTestNames(protoType)

      Object.getOwnPropertyNames(protoType).forEach(name => {
        if(!_fnNames.includes(name)){
          _fnNames.push(name)
        }
      })
    }
    getTestNames(this)

    const testsNames = _fnNames.filter(name => (
      name.indexOf('test') == 0
    ) && (
      typeof this[name] == 'function'
    ))

    testsNames.forEach(testName => {
      const testDetails = this[testName]()
      if(testDetails && testDetails.test){
        register(testDetails)
      }
    })

    return allTests
  }

  run(){
    const {unknownTests, tests} = this._collectTests()

    unknownTests.forEach(test => {
      test()
    })
    Object.keys(tests).forEach(groupName => {
      describe(groupName, () => {
        tests[groupName].forEach(test => {
          test()
        })
      })
    })
  }
}


export const Test = (Mixin) => (props) => {
  const test = new Mixin(props)
  test.run()
}
