export const pushLeft = (dataList=[], data, currentPosition) => {
  const previousData = dataList[currentPosition - 2]
  const currentData = dataList[currentPosition - 1]
  const currentPlacedAtDefined = currentData && (
    currentData.placedAt != undefined
  ) && (currentData.placedAt != null)

  if(currentPlacedAtDefined){
    if(currentData.placedAt > data.placedAt){
      return;
    }
  }

  dataList.splice(currentPosition, 1)
  dataList.splice(currentPosition - 1, 0, data)


  const previousDataPositionDefined = previousData && (
    previousData.position != undefined
  ) && (
    previousData.position != null
  )

  if(previousDataPositionDefined){
    if(previousData.position == data.position){
      if(previousData.placedAt > data.placedAt){
        return
      }
    }
  }


  if((currentPosition - 1) != data.position){
    pushLeft(dataList, data, currentPosition - 1)
  }
}

export const pushRight = (dataList=[], data, currentPosition) => {
  dataList.splice(currentPosition, 1)
  dataList.splice(currentPosition + 1, 0, data)


  if(currentPosition + 1 != data.position){
    if(currentPosition + 2 > dataList.length){
      return
    }
    pushRight(dataList, data, currentPosition + 1)
  }
}


export const sortByPosition = (dataList=[]) => {
  let data;
  let cursorIndex = -1;

  dataList.forEach((eachData, loopIndex) => {
    cursorIndex += 1
    data = dataList[cursorIndex]

    const {position} = data;
    const dataPositionDefined = (position != undefined) && (position != null)
    if(!dataPositionDefined){
      return
    }

    if(cursorIndex < position){
      pushRight(dataList, data, cursorIndex)
      cursorIndex -= 1
    }

    if(cursorIndex > position){
      pushLeft(dataList, data, cursorIndex)
    }
  })
}


export default sortByPosition
