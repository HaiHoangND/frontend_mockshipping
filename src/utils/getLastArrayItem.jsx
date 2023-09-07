export const getArrayLastItem = (array) => {
  return array[array.length - 1];
};

export const getIndexOfItem = (arr, id) => {
  return arr.findIndex((item) => item.id === id);
};
