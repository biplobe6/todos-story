const swap = (items=[], firstIndex, secondIndex) => {
  const temp = items[firstIndex];
  items[firstIndex] = items[secondIndex];
  items[secondIndex] = temp;
}


const partition = (items=[], left, right) => {
  const pivot = items[Math.floor((right + left) / 2)].position
  let i = left, j = right;

  while( i <= j){
    while(items[i].position < pivot){
      i++;
    }
    while(items[j].position > pivot){
      j--;
    }

    if(i <= j){
      swap(items, i, j);
      i++;
      j--;
    }
  }

  return i
}

const quickSort = (items=[], left, right) => {
  let index;

  if(items.length > 1){
    index = partition(items, left, right)

    if(left < (index - 1)){
      quickSort(items, left, (index - 1))
    }

    if(index < right){
      quickSort(items, index, right)
    }
  }

  return items;
}


export const sortByPosition = (dataList=[]) => {
  if(dataList.length > 1){
    quickSort(dataList, 0, (dataList.length - 1))
  }
}

export default sortByPosition
