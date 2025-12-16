// let donorInfo = [
//   // {
//   //   name: "محمد نشأت",
//   //   age: 23,
//   //   bloodType: "A+",
//   //   contactInfo: { tel: "01012490898" }
//   // },
//   // {
//   //   name: "محمد نشأت",
//   //   age: 23,
//   //   bloodType: "A+",
//   //   contactInfo: { tel: "01012490898" }
//   // },
//   // {
//   //   name: "محمد نشأت",
//   //   age: 23,
//   //   bloodType: "A+",
//   //   contactInfo: { tel: "01012490898" }
//   // },
//   // {
//   //   name: "محمد نشأت",
//   //   age: 23,
//   //   bloodType: "A+",
//   //   contactInfo: { tel: "01012490898" }
//   // },
//   // {
//   //   name: "محمد نشأت",
//   //   age: 23,
//   //   bloodType: "A+",
//   //   contactInfo: { tel: "01012490898" }
//   // }
// ];

import axios from "axios";
//let apiUrl = "http://localhost:5000/donor/";
const apiUrl = "https://blooddonation-api-983366835228.europe-west9.run.app/donor/";

// function getAll() {
//   axios
//     .get(apiUrl)
//     .then(response => {
//       let donors = response.data;
//       donorInfo = donors
//     })
//     .catch(function(error) {
//       alert(error.data);
//     });

// }

// let element = {
//   contactInfo: {
//     tel: "01012490898",
//     mail: "nashaatfarrag@gmail.com"
//   },
//   basicInfo: {
//     nationalId: 20154545484,
//     birthDate: "1970-01-01T05:32:40.323Z"
//   },
//   name: "Mohamed Nashaat",
//   bloodType: "A+"
// };

function add(element) {
  axios
    .post(apiUrl, element)
    .catch(function (error) {
      alert(error.response.data);
    });
}
export default { add, apiUrl };
