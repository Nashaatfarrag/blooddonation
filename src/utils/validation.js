function EmailErrors(val, flag) {
  const errors = [];
  if (!val.$dirty) return errors;
  !val.email && errors.push("مطلوب بريد إليكترونى صحيح");
  !val.required && errors.push("البريد الإليكتروني مطلوب");
  if (flag) errors.push("هذا البريد مستخدم من قبل مستخدم آخر");
  return errors;
}

function NotReqEmailErrors(val, flag) {
  const errors = [];
  if (!val.$dirty) return errors;
  !val.email && errors.push("مطلوب بريد إليكترونى صحيح");
  // !val.required && errors.push("البريد الإليكتروني مطلوب");
  if (flag) errors.push("هذا البريد مستخدم من قبل مستخدم آخر");
  return errors;
}
function FieldErrors(val) {
  const errors = [];
  if (!val.$dirty) return errors;
  !val.required && errors.push("هذا الحقل مطلوب");
  !val.minLength && errors.push("عدد حروف قليل");
  !val.maxLength && errors.push("عدد حروف زائد");
  return errors;
}

function NumberErrors(val) {
  const errors = [];
  if (!val.$dirty) return errors;
  !val.required && errors.push("خطأ");
  !val.minLength && errors.push("خطأ");
  !val.maxLength && errors.push("خطأ");
  !val.between && errors.push("قيمة خارج الحدود المسموحة");

  return errors;
}
function UniqueFieldErrors(val, flag) {
  const errors = [];
  // console.log(flag);
  if (!val.$dirty) return errors;
  !val.required && errors.push("خطأ");
  !val.minLength && errors.push("خطأ");
  !val.maxLength && errors.push("خطأ");
  if (flag) errors.push("هذا الرقم مستخدم من قبل");

  return errors;
}

// export feature declared earlier as default
export {
  EmailErrors,
  FieldErrors,
  UniqueFieldErrors,
  NotReqEmailErrors,
  NumberErrors,
};

// // export individual features as default
// export default function () { ... }
// export default class { .. }
