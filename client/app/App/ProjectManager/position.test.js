import { sortByPosition } from './position';
const {expect} = global;


describe('"sortByPosition" method', () => {
  it('Should not be undefined', () => {
    expect(sortByPosition).not.toBeUndefined()
  })


  it('Should be callable', () => {
    expect(() => {
      sortByPosition([{
        id: 1,
        position: 1
      }])
    }).not.toThrow()
  })


  it('Should be sorted', () => {
    const dataList = [{
      id: 1,
      position: 1,
    }, {
      id: 3,
      position: 3,
    }, {
      id: 4,
      position: 4,
    }, {
      id: 2,
      position: 2,
    }, {
      id: 5,
      position: 5,
    }]

    sortByPosition(dataList)
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
      position: 0.7,
    }, {
      id: 3,
      position: 0.9,
    }, {
      id: 4,
      position: 1.2,
    }, {
      id: 2,
      position: 0.8,
    }, {
      id: 5,
      position: 1.5,
    }]

    sortByPosition(dataList)
    expect(dataList.length).toBe(5)
    expect(dataList[0].id).toBe(1)
    expect(dataList[1].id).toBe(2)
    expect(dataList[2].id).toBe(3)
    expect(dataList[3].id).toBe(4)
    expect(dataList[4].id).toBe(5)
  })
})


