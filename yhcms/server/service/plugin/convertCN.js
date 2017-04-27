import pinyin from 'pinyin';

function convertCN(word) {
  let result = word;
  if (/[\u4E00-\u9FA5\uF900-\uFA2D]/.test(word)) {
    result = '';
    pinyin(word, {
      style: pinyin.STYLE_NORMAL
    }).map((key) => {
      result += key;
    });
  }
  return result;
}

export default convertCN;
