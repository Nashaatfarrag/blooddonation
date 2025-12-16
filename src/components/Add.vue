<template>
  <v-container>
    <v-row
      class="justify-center align-center"
      style="height: 15rem"
      id="grad-container"
    >
      <v-col cols="12">
        <p id="ads" class="header-container">تبرعك بالدم ينقذ حياة</p>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="12" md="8" lg="6">
        <v-form @reset="onReset" v-if="show" class="Addform">
          <p style="margin: 0; text-align: right">
            <strong>حقل إجباري *</strong>
          </p>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                    outlined
                    @input="v$.form.name.$touch()"
                    @blur="v$.form.name.$touch()"
                    :error-messages="generateErrors(v$.form.name)"
                    label="الإسم : *"
                    v-model="form.name"
                    type="text"
                    required
                    placeholder="من فضلك ادخل الإسم ثلاثي"
                  />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                outlined
                @input="v$.form.contactInfo.mail.$touch()"
                @blur="v$.form.contactInfo.mail.$touch()"
                :error-messages="
                  generateErrors(v$.form.contactInfo.mail, 'Email')
                "
                label=" البريد الإليكتروني :"
                v-model="form.contactInfo.mail"
                type="email"
                placeholder="يرجي إدخال بريد إليكترونى صالح"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                outlined
                @input="v$.form.contactInfo.tel.$touch()"
                @blur="v$.form.contactInfo.tel.$touch()"
                :error-messages="generateErrors(v$.form.contactInfo.tel)"
                label=" رقم الموبايل : *"
                v-model="form.contactInfo.tel"
                type="number"
                required
                placeholder="رقم موبايل للتواصل"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                outlined
                @input="v$.form.basicInfo.birthDate.$touch()"
                @blur="v$.form.basicInfo.birthDate.$touch()"
                :error-messages="generateErrors(v$.form.basicInfo.birthDate)"
                label=" تاريخ الميلاد : *"
                v-model="form.basicInfo.birthDate"
                type="date"
                required
                placeholder="من فضلك أدخل تاريح ميلادك"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="6">
              <v-select
                outlined
                @input="v$.form.bloodType.$touch()"
                @blur="v$.form.bloodType.$touch()"
                :error-messages="generateErrors(v$.form.bloodType)"
                label=" فصيلة الدم : * "
                v-model="form.bloodType"
                :items="types"
                item-title="text"
                item-value="value"
                required
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                outlined
                @input="v$.form.gender.$touch()"
                @blur="v$.form.gender.$touch()"
                :error-messages="generateErrors(v$.form.gender)"
                label=" النوع : *"
                v-model="form.gender"
                :items="genders"
                item-title="text"
                item-value="value"
                required
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" class="text-center">
              <v-btn
                class="ma-1"
                type="button"
                @click="onSubmit"
                color="primary"
                >إرسال</v-btn
              >
              <v-btn class="ma-1" type="reset" color="error">إعادة ملئ</v-btn>
            </v-col>
          </v-row>
        </v-form>
        <div v-else align="center">
          <v-icon size="72" color="green">mdi-check</v-icon>
          <br /><br /><br />
          <strong style="font-size: larger" class="text-success mt-2"
            >done</strong
          >
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Db from '../services/getDonors'
import axios from 'axios'
import { reactive, ref } from 'vue'
import useVuelidate from '@vuelidate/core'
import { required, maxLength, minLength, email } from '@vuelidate/validators'
import { FieldErrors, UniqueFieldErrors, NotReqEmailErrors } from '@/utils/validation'

export default {
  name: 'Add',
  setup() {
    const form = reactive({
      name: '',
      gender: '',
      bloodType: null,
      contactInfo: { tel: '', mail: '' },
      basicInfo: {
        nationalId: '',
        birthDate: new Date(new Date().setFullYear(new Date().getFullYear() - 18))
          .toISOString()
          .slice(0, 10),
      },
    })

    const genders = [
      { text: 'ذكر', value: 'male' },
      { text: 'أنثي', value: 'female' },
    ]

    const types = [
      { text: 'A+', value: 'A+' },
      { text: 'O+', value: 'O+' },
      { text: 'B+', value: 'B+' },
      { text: 'AB+', value: 'AB+' },
      { text: 'A-', value: 'A-' },
      { text: 'O-', value: 'O-' },
      { text: 'AB-', value: 'AB-' },
      { text: 'B-', value: 'B-' },
    ]

    const show = ref(true)

    const rules = {
      form: {
        name: { required, maxLength: maxLength(32), minLength: minLength(8) },
        gender: { required, maxLength: maxLength(10), minLength: minLength(3) },
        bloodType: { required, maxLength: maxLength(10), minLength: minLength(1) },
        contactInfo: {
          tel: { required, maxLength: maxLength(11), minLength: minLength(8) },
          mail: { email },
        },
        basicInfo: {
          birthDate: { required, maxLength: maxLength(10), minLength: minLength(8) },
        },
      },
    }

    const v$ = useVuelidate(rules, { form })

    function validateDuplicate() {
      return false
    }

    function generateErrors(val, filedType, fieldValue) {
      if (filedType === 'Email') return NotReqEmailErrors(val)
      else if (filedType === 'UniqueField') return UniqueFieldErrors(val, validateDuplicate(fieldValue))
      else return FieldErrors(val)
    }

    async function onSubmit(evt) {
      v$.value.$touch()

      if (!v$.value.$invalid) {
        axios.get(Db.apiUrl + form.contactInfo.tel).then((res) => {
          if (res.data) {
            alert('يوجد متبرع بنفس رقم الموبايل')
          } else {
            evt.preventDefault()
            const element = {
              name: form.name,
              bloodType: form.bloodType,
              imgUrl: 'Hi',
              contactInfo: { tel: form.contactInfo.tel, mail: form.contactInfo.mail },
              basicInfo: { birthDate: form.basicInfo.birthDate, gender: form.gender },
            }

            axios.post(Db.apiUrl, element).finally(() => {
              show.value = false
            })
          }
        })
      }
    }

    function onReset(evt) {
      evt.preventDefault()
      form.email = ''
      form.name = ''
      form.type = null

      show.value = false
      // reset display
      setTimeout(() => (show.value = true), 0)
    }

    return { form, genders, types, show, v$, generateErrors, onSubmit, onReset }
  },
}
</script>

<style scoped>
#grad-container {
  background-image: linear-gradient(
    to top,
    #051937,
    #35255b,
    #722670,
    #b31771,
    #eb125d
  );
  text-align: center;
}
.Addform,
#ads {
  font-family: myFirstFont;
}
input {
  text-align: right;
  font-family: mySecFont;
  font-weight: bold;
}

#ads {
  color: white;
  font-size: 2rem;
}
</style>
