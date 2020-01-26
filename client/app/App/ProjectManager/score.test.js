import { sortByScore } from './score';
const {expect} = global;


describe('"sortByScore" method', () => {
  it('Should not be undefined', () => {
    expect(sortByScore).not.toBeUndefined()
  })


  it('Should be callable', () => {
    expect(() => {
      sortByScore([{
        id: 1,
        score: 1
      }])
    }).not.toThrow()
  })


  it('Should be sorted', () => {
    const dataList = [{
      id: 1,
      score: 1,
    }, {
      id: 3,
      score: 3,
    }, {
      id: 4,
      score: 4,
    }, {
      id: 2,
      score: 2,
    }, {
      id: 5,
      score: 5,
    }]

    sortByScore(dataList)
    expect(dataList.length).toBe(5)
    expect(dataList[0].id).toBe(1)
    expect(dataList[1].id).toBe(2)
    expect(dataList[2].id).toBe(3)
    expect(dataList[3].id).toBe(4)
    expect(dataList[4].id).toBe(5)
  })


  it('Should be sorted with fraction', () => {
    const dataList = [{
      id: 1,
      score: 0.7,
    }, {
      id: 3,
      score: 0.9,
    }, {
      id: 4,
      score: 1.2,
    }, {
      id: 2,
      score: 0.8,
    }, {
      id: 5,
      score: 1.5,
    }]

    sortByScore(dataList)
    expect(dataList.length).toBe(5)
    expect(dataList[0].id).toBe(1)
    expect(dataList[1].id).toBe(2)
    expect(dataList[2].id).toBe(3)
    expect(dataList[3].id).toBe(4)
    expect(dataList[4].id).toBe(5)
  })
})


