import {sortByPosition, pushLeft, pushRight} from './sortByPosition';
const {expect} = global;



describe('"pushLeft" method', () => {
  it('Should not be undefined', () => {
    expect(pushLeft).not.toBeUndefined()
  })


  it('Should push item left', () => {
    const dataList = [{
      id: 1,
    }, {
      id: 2,
      position: 0,
      placedAt: 10
    }]

    pushLeft(dataList, dataList[1], 1)
    expect(dataList.length).toBe(2)
    expect(dataList[0].id).toBe(2)
    expect(dataList[1].id).toBe(1)
  })


  it('Should push item all the way left', () => {
    const dataList = [{
      id: 1,
    }, {
      id: 2,
    }, {
      id: 3,
    }, {
      id: 4,
    }, {
      id: 5,
      position: 0,
      placedAt: 10
    }]

    pushLeft(dataList, dataList[4], 4)
    expect(dataList.length).toBe(5)
    expect(dataList[0].id).toBe(5)
    expect(dataList[1].id).toBe(1)
    expect(dataList[2].id).toBe(2)
    expect(dataList[3].id).toBe(3)
    expect(dataList[4].id).toBe(4)
  })


  it('Should push item left with respect to "placedAt"', () => {
    const dataList = [{
      id: 1,
      position: 0,
      placedAt: 15
    }, {
      id: 2,
    }, {
      id: 3,
    }, {
      id: 4,
    }, {
      id: 5,
      position: 0,
      placedAt: 10
    }]

    pushLeft(dataList, dataList[4], 4)
    expect(dataList.length).toBe(5)
    expect(dataList[0].id).toBe(1)
    expect(dataList[1].id).toBe(5)
    expect(dataList[2].id).toBe(2)
    expect(dataList[3].id).toBe(3)
    expect(dataList[4].id).toBe(4)
  })


  it('Should push item left with respect to "placedAt" (multiple)', () => {
    const dataList = [{
      id: 1,
      position: 0,
      placedAt: 20,
    }, {
      id: 2,
      position: 0,
      placedAt: 10,
    }, {
      id: 3,
      position: 0,
      placedAt: 5,
    }, {
      id: 4,
    }, {
      id: 5,
      position: 0,
      placedAt: 15,
    }]

    pushLeft(dataList, dataList[4], 4)
    expect(dataList.length).toBe(5)

    expect(dataList[0].id).toBe(1)
    expect(dataList[1].id).toBe(5)
    expect(dataList[2].id).toBe(2)
    expect(dataList[3].id).toBe(3)
    expect(dataList[4].id).toBe(4)
  })
})


describe('"pushRight" method', () => {
  it('Should push right', () => {
    const dataList = [{
      id: 1,
      position: 1,
      placedAt: 10
    }, {
      id: 2,
    }]

    pushRight(dataList, dataList[0], 0)
    expect(dataList.length).toBe(2)
    expect(dataList[0].id).toBe(2)
    expect(dataList[1].id).toBe(1)
  })


  it('Should push right all the way', () => {
    const dataList = [{
      id: 1,
      position: 10,
      placedAt: 10
    }, {
      id: 2,
    }, {
      id: 3,
    }, {
      id: 4,
    }, {
      id: 5,
    }, {
      id: 6,
    }]

    pushRight(dataList, dataList[0], 0)
    expect(dataList.length).toBe(6)
    expect(dataList[0].id).toBe(2)
    expect(dataList[1].id).toBe(3)
    expect(dataList[2].id).toBe(4)
    expect(dataList[3].id).toBe(5)
    expect(dataList[4].id).toBe(6)
    expect(dataList[5].id).toBe(1)
  })
})



describe('"sortByPosition", method', () => {
  it('Should not be undefined', () => {
    expect(sortByPosition).not.toBeUndefined()
  })


  it('Should be callable', () => {
    const dataList = [{
      id: 1
    }]
    expect(() => {
      sortByPosition(dataList)
    }).not.toThrow()
  })


  it('Should not change any data without "position" property.', () => {
    const dataList = [{
      id: 1
    }, {
      id: 2,
    }, {
      id: 3,
    }, {
      id: 4,
    }]
    sortByPosition(dataList)
    expect(dataList.length).toBe(4)
    expect(dataList[0].id).toBe(1)
    expect(dataList[1].id).toBe(2)
    expect(dataList[2].id).toBe(3)
    expect(dataList[3].id).toBe(4)
  })

  describe('Should push item left', () => {
    it('Should push 1 item', () => {
      const dataList = [{
        id: 1
      }, {
        id: 2
      }, {
        id: 3
      }, {
        id: 4,
        position: 2,
        placedAt: 10,
      }]

      sortByPosition(dataList)
      expect(dataList.length).toBe(4)
      expect(dataList[0].id).toBe(1)
      expect(dataList[1].id).toBe(2)
      expect(dataList[2].id).toBe(4)
      expect(dataList[3].id).toBe(3)
    })


    it('Should push item all the way left', () => {
      const dataList = [{
        id: 1
      }, {
        id: 2
      }, {
        id: 3
      }, {
        id: 4,
        position: 0,
        placedAt: 10,
      }]

      sortByPosition(dataList)
      expect(dataList.length).toBe(4)
      expect(dataList[0].id).toBe(4)
      expect(dataList[1].id).toBe(1)
      expect(dataList[2].id).toBe(2)
      expect(dataList[3].id).toBe(3)
    })


    it('Should push multiple item', () => {
      const dataList = [{
        id: 1
      }, {
        id: 2,
        position: 0,
        placedAt: 10,
      }, {
        id: 3
      }, {
        id: 4,
        position: 0,
        placedAt: 15
      }]

      sortByPosition(dataList)
      expect(dataList.length).toBe(4)
      expect(dataList[0].id).toBe(4)
      expect(dataList[1].id).toBe(2)
      expect(dataList[2].id).toBe(1)
      expect(dataList[3].id).toBe(3)
    })


    it('Should not push item at left', () => {
      const dataList = [{
        id: 1,
      }, {
        id: 4,
        position: 4,
        placedAt: 10
      }]

      sortByPosition(dataList)
      expect(dataList.length).toBe(2)
      expect(dataList[0].id).toBe(1)
      expect(dataList[1].id).toBe(4)
    })


    it('Should sort item with respect of "placedAt" (multiple)', () => {
      const dataList = [{
        id: 1,
        position: 0,
        placedAt: 20,
      }, {
        id: 2,
        position: 0,
        placedAt: 10,
      }, {
        id: 3,
        position: 0,
        placedAt: 5,
      }, {
        id: 4,
      }, {
        id: 5,
        position: 0,
        placedAt: 15,
      }]

      sortByPosition(dataList)
      expect(dataList.length).toBe(5)
      expect(dataList[0].id).toBe(1)
      expect(dataList[1].id).toBe(5)
      expect(dataList[2].id).toBe(2)
      expect(dataList[3].id).toBe(3)
      expect(dataList[4].id).toBe(4)
    })
  })

  describe('Should push item right', () => {
    it('Should push 1 item', () => {
      const dataList = [{
        id: 1,
        position: 4,
        placedAt: 10
      }, {
        id: 4,
      }]

      sortByPosition(dataList)
      expect(dataList.length).toBe(2)
      expect(dataList[0].id).toBe(4)
      expect(dataList[1].id).toBe(1)
    })


    it('Should push item all the way', () => {
      const dataList = [{
        id: 4,
        position: 10,
        placedAt: 10
      }, {
        id: 1,
      }, {
        id: 2,
      }, {
        id: 3,
      }]

      sortByPosition(dataList)
      expect(dataList.length).toBe(4)
      expect(dataList[0].id).toBe(1)
      expect(dataList[1].id).toBe(2)
      expect(dataList[2].id).toBe(3)
      expect(dataList[3].id).toBe(4)
    })


    it('Should not push item all the way right.', () => {
      const dataList = [{
        id: 3,
        position: 2,
        placedAt: 10
      }, {
        id: 1,
      }, {
        id: 2,
      }, {
        id: 4,
      }]

      sortByPosition(dataList)
      expect(dataList.length).toBe(4)
      expect(dataList[0].id).toBe(1)
      expect(dataList[1].id).toBe(2)
      expect(dataList[2].id).toBe(3)
      expect(dataList[3].id).toBe(4)
    })


    it('Should not push item right if "placedAt" property is bigger', () => {
      const dataList = [{
        id: 3,
        position: 2,
        placedAt: 10
      }, {
        id: 1,
        position: 2,
        placedAt: 15
      }, {
        id: 2,
      }, {
        id: 4,
      }]

      sortByPosition(dataList)
      expect(dataList.length).toBe(4)
      expect(dataList[0].id).toBe(2)
      expect(dataList[1].id).toBe(1)
      expect(dataList[2].id).toBe(3)
      expect(dataList[3].id).toBe(4)
    })
  })

  describe('Should sort items (mixed)', () => {
    it('Should not change position', () => {
      const dataList = [{
        id: 1,
        position: 0,
        placedAt: 30,
      }, {
        id: 2,
        position: 0,
        placedAt: 25,
      }, {
        id: 3,
        position: 0,
        placedAt: 20,
      }, {
        id: 4,
        position: 0,
        placedAt: 15,
      }]

      sortByPosition(dataList)
      expect(dataList.length).toBe(4)
      expect(dataList[0].id).toBe(1)
      expect(dataList[1].id).toBe(2)
      expect(dataList[2].id).toBe(3)
      expect(dataList[3].id).toBe(4)
    })
  })
})
