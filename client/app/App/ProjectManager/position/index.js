const swap = (items=[], firstIndex, secondIndex) => {
  const temp = items[firstIndex];
  items[firstIndex] = items[secondIndex];
  items[secondIndex] = temp;
}


const partition = (items=[], left, right, asc=true) => {
  const pivot = items[Math.floor((right + left) / 2)].position
  let i = left, j = right;

  while( i <= j){
    while(asc ? (items[i].position < pivot) : (items[i].position > pivot)){
      i++;
    }
    while(asc ? (items[j].position > pivot) : (items[j].position < pivot)){
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

const quickSort = (items=[], left, right, asc=true) => {
  let index;

  if(items.length > 1){
    index = partition(items, left, right, asc)

    if(left < (index - 1)){
      quickSort(items, left, (index - 1), asc)
    }

    if(index < right){
      quickSort(items, index, right, asc)
    }
  }

  return items;
}


export const sortByPosition = (dataList=[], asc=true) => {
  if(dataList.length > 1){
    quickSort(dataList, 0, (dataList.length - 1), asc)
  }
}






export default sortByPosition
