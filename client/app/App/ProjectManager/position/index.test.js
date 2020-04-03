import { sortByPosition } from '.';
const {expect} = global;


describe('sortByPosition()', () => {
  it('Should not be undefined', () => {
    expect(sortByPosition).not.toBeUndefined()
  })


  it('Should be callable', () => {
    expect(() => {
      sortByPosition([{
        alias: 1,
        position: 1
      }])
    }).not.toThrow()
  })


  it('Should be sorted', () => {
    const dataList = [{
      alias: 1,
      position: 1,
    }, {
      alias: 3,
      position: 3,
    }, {
      alias: 4,
      position: 4,
    }, {
      alias: 2,
      position: 2,
    }, {
      alias: 5,
      position: 5,
    }]

    sortByPosition(dataList)
    expect(dataList.length).toBe(5)
    expect(dataList[0].alias).toBe(1)
    expect(dataList[1].alias).toBe(2)
    expect(dataList[2].alias).toBe(3)
    expect(dataList[3].alias).toBe(4)
    expect(dataList[4].alias).toBe(5)
  })


  it('Should be sorted with fraction', () => {
    const dataList = [{
      alias: 1,
      position: 0.7,
    }, {
      alias: 3,
      position: 0.9,
    }, {
      alias: 4,
      position: 1.2,
    }, {
      alias: 2,
      position: 0.8,
    }, {
      alias: 5,
      position: 1.5,
    }]

    sortByPosition(dataList)
    expect(dataList.length).toBe(5)
    expect(dataList[0].alias).toBe(1)
    expect(dataList[1].alias).toBe(2)
    expect(dataList[2].alias).toBe(3)
    expect(dataList[3].alias).toBe(4)
    expect(dataList[4].alias).toBe(5)
  })

  it('Should be sorted (decending order)', () => {
    const dataList = [{
      alias: 1,
      position: 4
    }, {
      alias: 2,
      position: 1
    }, {
      alias: 3,
      position: 3
    }, {
      alias: 4,
      position: 2
    }, {
      alias: 5,
      position: 5
    }]
    sortByPosition(dataList, false)
    expect(dataList.length).toBe(5)
    expect(dataList[0].alias).toBe(5)
    expect(dataList[1].alias).toBe(1)
    expect(dataList[2].alias).toBe(3)
    expect(dataList[3].alias).toBe(4)
    expect(dataList[4].alias).toBe(2)
  })
})

