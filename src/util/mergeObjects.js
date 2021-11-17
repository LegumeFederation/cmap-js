export default function mergeObjects(...objs){
  const res = {};
  //deep merge object to base;
  objs.forEach( obj => {
    merge(obj,res);
  });
  return res;
}

const merge = (o,res) => {
  for( let prop in o){
    // eslint-disable-next-line no-prototype-builtins
    if(o.hasOwnProperty(prop)){
      if (Object.prototype.toString.call(o[prop]) === '[object Object]') {
        res[prop] = merge(res[prop], o[prop]); // make recursive if nested object
      } else {
        res[prop] = o[prop]; // otherwise assign
      }
    }
  }
  return res;
};
