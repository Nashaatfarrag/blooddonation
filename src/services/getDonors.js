let donorInfo = [
  { name: "محمد نشأت", age: 23 , type : "A+" , tel : "01012490898" },
  { name: "Ahmed Khalid", age: 25 , type : "A+" , tel : "01012490898" },
  { name: "Abdo Elsharkawy", age: 22 , type : "A+" , tel : "01012490898" },
  { name: "محمد نشأت", age: 23 , type : "B+" , tel : "01012490898" },
  { name: "Ahmed Khalid", age: 25 , type : "A-" , tel : "01012490898" },
  { name: "Abdo Elsharkawy", age: 22 , type : "B-" , tel : "01012490898" }
];

function getAll() {
  return donorInfo;
}
function add(element){
  donorInfo.push(element);
}

module.exports = { getAll , add };

