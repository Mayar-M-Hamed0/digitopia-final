<template>
  <div class="container-fluid pb-5 bg-primary hero-header">
    <div class="container py-5">
      <div class="row g-5 align-items-center mb-5">
        <!-- النص - مساحة أكبر ومتوازنة -->
        <div
          class="col-12 col-md-6 col-lg-6 order-2 order-md-1 animate__animated animate__slideInRight"
        >
          <div class="text-center">
            <h1 class="display-4 fw-bold mb-4">حجز موعد التطعيم</h1>
            <p class="fs-5 mb-4">
              احجز موعد التطعيم لطفلك بسهولة وتجنب الزحام في المراكز الصحية
            </p>
          </div>
        </div>
        <!-- الصورة - مساحة متوازنة -->
        <div
          class="col-12 col-md-6 col-lg-6 order-1 order-md-2 animate__animated animate__slideInLeft"
        >
          <div class="text-center">
            <img
              src="@/assets/img/vaccine-bottle-syringe-held-by-doctor-with-gloves.jpg"
              class="img-fluid border-black shadow-lg"
              style="
                max-width: 70%;
                height: auto;
                object-fit: cover;
                border-radius: 36px;
              "
              alt="طجاجة لقاح- خدمة حجز مواعيد التطعيم"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
  <h2 class="text-center my-4" data-aos="fade-in" data-aos-delay="300">
    حماية طفلك تبدأ بخطوة
  </h2>
  <p class="text-center text-muted" data-aos="fade-in" data-aos-delay="500">
    سجل بيانات طفلك واحجز موعد التطعيم لتجنب الانتظار وضمان حصوله على الرعاية في
    الوقت المناسب.
  </p>
  <div class="vaccine-booking my-5">
    <div class="header">
      <p>اختر التطعيم المناسب وحدد الموعد</p>
    </div>

    <div class="progress-bar-2">
      <div class="row">
        <div class="col-3">
          <div class="progress-step w-25" :class="{ active: step >= 1 }">
            <span>1</span>
            <p>البيانات الأساسية</p>
          </div>
        </div>
        <div class="col-3">
          <div class="progress-step w-25" :class="{ active: step >= 2 }">
            <span>2</span>
            <p>اختر التطعيم</p>
          </div>
        </div>
        <div class="col-3">
          <div class="progress-step w-25" :class="{ active: step >= 3 }">
            <span>3</span>
            <p>اختر المركز</p>
          </div>
        </div>
        <div class="col-3">
          <div class="progress-step w-25" :class="{ active: step >= 4 }">
            <span>4</span>
            <p>اختر الموعد</p>
          </div>
        </div>
      </div>
    </div>

    <form @submit.prevent="book" class="booking-form">
      <!-- الخطوة 1: البيانات الأساسية -->
      <div v-show="step === 1" class="form-step">
        <div class="form-group">
          <label for="childName">اسم الطفل</label>
          <input
            id="childName"
            v-model="childName"
            type="text"
            placeholder="أدخل اسم الطفل"
            :class="{ error: errors.childName }"
            @blur="validateChildName"
          />
          <span v-if="errors.childName" class="error-text">{{
            errors.childName
          }}</span>
        </div>

        <div class="form-group">
          <label for="nationalId">الرقم القومي للطفل</label>
          <input
            id="nationalId"
            v-model="nationalId"
            type="text"
            placeholder="أدخل الرقم القومي"
            :class="{ error: errors.nationalId }"
            @blur="validateNationalId"
          />
          <span v-if="errors.nationalId" class="error-text">{{
            errors.nationalId
          }}</span>
        </div>

        <div class="form-group">
          <label for="phoneNumber">رقم الهاتف</label>
          <input
            id="phoneNumber"
            v-model="phoneNumber"
            type="text"
            placeholder="أدخل رقم الهاتف"
            :class="{ error: errors.phoneNumber }"
            @blur="validatePhoneNumber"
          />
          <span v-if="errors.phoneNumber" class="error-text">{{
            errors.phoneNumber
          }}</span>
        </div>

        <div class="form-actions">
          <button
            type="button"
            @click="nextStep"
            :disabled="!basicDataValid"
            class="btn btn-primary"
          >
            التالي
          </button>
        </div>
      </div>

      <!-- الخطوة 2: اختيار التطعيم -->
      <div v-show="step === 2" class="form-step">
        <div class="form-group">
          <label>اختر نوع التطعيم</label>
          <div v-if="loading.vaccines" class="loading">
            جاري تحميل التطعيمات...
          </div>
          <select
            v-else
            v-model="selectedVaccine"
            @change="loadGovernoratesCitiesCenters"
            class="form-select"
          >
            <option value="">اختر التطعيم</option>
            <option v-for="v in vaccines" :key="v.id" :value="v.id">
              <strong>{{ v.name }}</strong>
              <!-- <br />
              <small class="text-muted d-block">{{ v.description }}</small> -->
            </option>
          </select>
          <span v-if="errors.vaccine" class="error-text">{{
            errors.vaccine
          }}</span>
        </div>

        <div class="form-actions">
          <button type="button" @click="prevStep" class="btn btn-secondary">
            السابق
          </button>
          <button
            type="button"
            @click="nextStep"
            :disabled="!selectedVaccine"
            class="btn btn-primary"
          >
            التالي
          </button>
        </div>
      </div>

      <!-- الخطوة 3: اختيار المحافظة والمدينة والمركز -->
      <div v-show="step === 3" class="form-step">
        <div class="form-row">
          <div class="form-group">
            <label>المحافظة</label>
            <select
              v-model="selectedGovernorate"
              @change="filterCitiesByGovernorate"
              class="form-select"
            >
              <option value="">اختر المحافظة</option>
              <option v-for="g in governorates" :key="g.id" :value="g.id">
                {{ g.name }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label>المدينة</label>
            <select
              v-model="selectedCity"
              @change="filterCentersByCity"
              class="form-select"
              :disabled="!selectedGovernorate"
            >
              <option value="">اختر المدينة</option>
              <option v-for="c in filteredCities" :key="c.id" :value="c.id">
                {{ c.name }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label>المركز الصحي</label>
            <select
              v-model="selectedCenter"
              @change="loadAvailableTimes"
              class="form-select"
              :disabled="!selectedCity"
            >
              <option value="">اختر المركز</option>
              <option v-for="h in filteredCenters" :key="h.id" :value="h.id">
                {{ h.name }}
              </option>
            </select>
            <span v-if="errors.center" class="error-text">{{
              errors.center
            }}</span>
          </div>
        </div>

        <div class="form-actions">
          <button type="button" @click="prevStep" class="btn btn-secondary">
            السابق
          </button>
          <button
            type="button"
            @click="nextStep"
            :disabled="!selectedCenter"
            class="btn btn-primary"
          >
            التالي
          </button>
        </div>
      </div>

      <!-- الخطوة 4: اختيار الموعد -->
      <div v-show="step === 4" class="form-step">
        <div class="form-group">
          <label>اختر التاريخ</label>
          <input
            type="date"
            v-model="selectedDate"
            :min="new Date().toISOString().slice(0, 10)"
            @change="loadAvailableTimes"
            class="form-control"
          />
        </div>

        <div class="form-group mt-3">
          <label>اختر الموعد المناسب</label>
          <div v-if="loading.times" class="loading">جاري تحميل المواعيد...</div>
          <select v-else v-model="selectedTime" class="form-select">
            <option value="">اختر الموعد</option>
            <option v-for="t in availableTimes" :key="t" :value="t">
              {{ formatTime(t) }}
            </option>
          </select>
          <span v-if="errors.time" class="error-text">{{ errors.time }}</span>
        </div>

        <div class="booking-summary" v-if="selectedTime">
          <h3>ملخص الحجز</h3>
          <div class="summary-item">
            <span>اسم الطفل:</span>
            <span>{{ childName }}</span>
          </div>
          <div class="summary-item">
            <span>رقم الهاتف:</span>
            <span>{{ phoneNumber }}</span>
          </div>
          <div class="summary-item">
            <span>التطعيم:</span>
            <span>{{ selectedVaccineName }}</span>
          </div>
          <div class="summary-item">
            <span>المحافظة:</span>
            <span>{{ selectedGovernorateName }}</span>
          </div>
          <div class="summary-item">
            <span>المدينة:</span>
            <span>{{ selectedCityName }}</span>
          </div>
          <div class="summary-item">
            <span>المركز:</span>
            <span>{{ selectedCenterName }}</span>
          </div>
          <div class="summary-item">
            <span>التاريخ:</span>
            <span>{{ selectedDate }}</span>
          </div>
          <div class="summary-item">
            <span>الموعد:</span>
            <span>{{ selectedDate }} - {{ formatTime(selectedTime) }}</span>
          </div>
        </div>

        <div class="form-actions">
          <button
            type="button"
            @click="prevStep"
            class="btn btn-secondary"
            :disabled="bookingSuccess"
          >
            السابق
          </button>
          <button
            type="submit"
            :disabled="!selectedTime || booking || bookingSuccess"
            class="btn btn-success"
          >
            {{ booking ? "جاري الحجز..." : "تأكيد الحجز" }}
          </button>
        </div>
      </div>
    </form>

    <!-- رسالة النجاح -->
    <div v-if="bookingSuccess" class="success-message">
      <h3>تم الحجز بنجاح!</h3>
      <p>سيصلك تأكيد الحجز على بريدك الإلكتروني</p>
      <button @click="resetForm" class="btn btn-primary">حجز جديد</button>
    </div>
  </div>
</template>

<script>
import toastr from "toastr";
export default {
  name: "AppointView",
  data() {
    return {
      step: 1,
      childName: "",
      nationalId: "",
      phoneNumber: "",
      vaccines: [],
      selectedVaccine: "",
      governorates: [],
      selectedGovernorate: "",
      cities: [],
      selectedCity: "",
      centers: [],
      selectedCenter: "",
      availableTimes: [],
      selectedTime: "",
      selectedDate: new Date().toISOString().slice(0, 10),
      booking: false,
      bookingSuccess: false,
      loading: {
        vaccines: false,
        times: false,
      },
      errors: {
        childName: "",
        nationalId: "",
        phoneNumber: "",
        vaccine: "",
        center: "",
        time: "",
      },
    };
  },
  computed: {
    basicDataValid() {
      return (
        this.childName &&
        this.nationalId &&
        this.phoneNumber &&
        this.nationalIdValid &&
        this.phoneNumberValid &&
        !this.errors.childName &&
        !this.errors.nationalId &&
        !this.errors.phoneNumber
      );
    },
    nationalIdValid() {
      return this.nationalId.length >= 10 && !this.errors.nationalId;
    },
    phoneNumberValid() {
      return this.phoneNumber.length >= 10 && !this.errors.phoneNumber;
    },
    filteredCities() {
      if (!this.selectedGovernorate) return [];
      return this.cities.filter(
        (c) => c.governorate_id == this.selectedGovernorate
      );
    },
    filteredCenters() {
      if (!this.selectedCity) return [];
      return this.centers.filter((c) => c.city_id == this.selectedCity);
    },
    selectedVaccineName() {
      const vaccine = this.vaccines.find((v) => v.id === this.selectedVaccine);
      return vaccine ? vaccine.name : "";
    },
    selectedGovernorateName() {
      const governorate = this.governorates.find(
        (g) => g.id === this.selectedGovernorate
      );
      return governorate ? governorate.name : "";
    },
    selectedCityName() {
      const city = this.cities.find((c) => c.id === this.selectedCity);
      return city ? city.name : "";
    },
    selectedCenterName() {
      const center = this.centers.find((c) => c.id === this.selectedCenter);
      return center ? center.name : "";
    },
  },
  methods: {
    validateChildName() {
      if (!this.childName) {
        this.errors.childName = "اسم الطفل مطلوب";
      } else if (this.childName.length < 2) {
        this.errors.childName = "اسم الطفل يجب أن يكون حرفين على الأقل";
      } else {
        this.errors.childName = "";
      }
    },

    validateNationalId() {
      if (!this.nationalId) {
        this.errors.nationalId = "الرقم القومي مطلوب";
      } else if (this.nationalId.length < 10) {
        this.errors.nationalId = "الرقم القومي يجب أن يكون 10 أرقام على الأقل";
      } else if (!/^\d+$/.test(this.nationalId)) {
        this.errors.nationalId = "الرقم القومي يجب أن يحتوي على أرقام فقط";
      } else {
        this.errors.nationalId = "";
      }
    },

    validatePhoneNumber() {
      if (!this.phoneNumber) {
        this.errors.phoneNumber = "رقم الهاتف مطلوب";
      } else if (this.phoneNumber.length < 10) {
        this.errors.phoneNumber = "رقم الهاتف يجب أن يكون 10 أرقام على الأقل";
      } else if (!/^[0-9+\-\s()]+$/.test(this.phoneNumber)) {
        this.errors.phoneNumber = "رقم الهاتف غير صحيح";
      } else {
        this.errors.phoneNumber = "";
      }
    },

    async loadVaccines() {
      this.loading.vaccines = true;
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/api/vaccines-by-id",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              national_id: this.nationalId,
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        this.vaccines = data.vaccines;
      } catch (error) {
        console.error("Error loading vaccines:", error);
        this.errors.vaccine = "حدث خطأ في تحميل التطعيمات";
      } finally {
        this.loading.vaccines = false;
      }
    },

    async loadGovernoratesCitiesCenters() {
      if (!this.selectedVaccine) return;

      try {
        const response = await fetch(
          "http://127.0.0.1:8000/api/cities-centers",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              vaccine_id: this.selectedVaccine,
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        this.cities = data.cities;
        this.centers = data.centers;
        this.governorates = data.governorates;

        this.selectedGovernorate = "";
        this.selectedCity = "";
        this.selectedCenter = "";
      } catch (error) {
        console.error("Error loading governorates, cities and centers:", error);
      }
    },

    filterCitiesByGovernorate() {
      this.selectedCity = "";
      this.selectedCenter = "";
    },

    filterCentersByCity() {
      this.selectedCenter = "";
    },

    async loadAvailableTimes() {
      if (!this.selectedCenter) return;

      this.loading.times = true;
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/api/available-times",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              health_center_id: this.selectedCenter,
              appointment_date: this.selectedDate,
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        this.availableTimes = data;
        this.selectedTime = "";
      } catch (error) {
        console.error("Error loading available times:", error);
        this.errors.time = "حدث خطأ في تحميل المواعيد";
      } finally {
        this.loading.times = false;
      }
    },

    formatTime(time) {
      const [hours, minutes] = time.split(":");
      return `${hours}:${minutes}`;
    },

    nextStep() {
      if (this.step === 1 && this.basicDataValid) {
        this.loadVaccines();
      }
      if (this.step < 4) {
        this.step++;
      }
    },

    prevStep() {
      if (this.step > 1) {
        this.step--;
      }
    },

    async book() {
      if (!this.selectedTime) {
        this.errors.time = "يجب اختيار موعد";
        return;
      }

      this.booking = true;
      try {
        const response = await fetch("http://127.0.0.1:8000/api/appointments", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            child_name: this.childName,
            national_id: this.nationalId,
            phone_number: this.phoneNumber,
            vaccine_id: this.selectedVaccine,
            health_center_id: this.selectedCenter,
            appointment_date: this.selectedDate,
            appointment_time: this.selectedTime,
          }),
        });

        // استخراج البيانات من الاستجابة أولاً
        const responseData = await response.json();

        if (!response.ok) {
          // عرض رسالة الخطأ من السيرفر
          toastr.error(responseData.message || "حدث خطأ في الحجز");
          return;
        }

        this.bookingSuccess = true;
      } catch (error) {
        console.error("Error booking appointment:", error);
        toastr.error("فشل الاتصال بالسيرفر، يرجى المحاولة مرة أخرى");
      } finally {
        this.booking = false;
      }
    },

    resetForm() {
      this.step = 1;
      this.childName = "";
      this.nationalId = "";
      this.phoneNumber = "";
      this.vaccines = [];
      this.selectedVaccine = "";
      this.governorates = [];
      this.selectedGovernorate = "";
      this.cities = [];
      this.selectedCity = "";
      this.centers = [];
      this.selectedCenter = "";
      this.availableTimes = [];
      this.selectedTime = "";
      this.bookingSuccess = false;
      this.errors = {
        childName: "",
        nationalId: "",
        phoneNumber: "",
        vaccine: "",
        center: "",
        time: "",
      };
    },
  },
};
</script>

<style scoped>
.vaccine-booking {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.header {
  text-align: center;
  margin-bottom: 30px;
}

.header h1 {
  color: #2c3e50;
  margin-bottom: 10px;
}

.header p {
  color: #7f8c8d;
}

.progress-bar {
  direction: rtl;
  display: flex;
  justify-content: space-between;
  margin-bottom: 40px;
  position: relative;
}

.progress-bar::before {
  content: "";
  position: absolute;
  top: 20px;
  left: 0;
  right: 0;
  height: 2px;
  background: #ecf0f1;
  z-index: 1;
}

.progress-step {
  text-align: center;
  position: relative;
  z-index: 2;
}

.progress-step span {
  width: 40px;
  height: 40px;
  background: #ecf0f1;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 10px;
  transition: all 0.3s ease;
}

.progress-step.active span {
  background: #3498db;
  color: white;
}

.progress-step p {
  font-size: 14px;
  color: #7f8c8d;
}

.progress-step.active p {
  color: #2c3e50;
  font-weight: bold;
}

.form-step {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.form-group {
  margin-bottom: 20px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: 600;
  color: #2c3e50;
}

input,
select {
  width: 100%;
  padding: 12px;
  border: 2px solid #ecf0f1;
  border-radius: 5px;
  font-size: 16px;
  transition: border-color 0.3s ease;
}

input:focus,
select:focus {
  outline: none;
  border-color: #3498db;
}

input.error,
select.error {
  border-color: #e74c3c;
}

.error-text {
  color: #e74c3c;
  font-size: 14px;
  margin-top: 5px;
  display: block;
}

.loading {
  text-align: center;
  padding: 20px;
  color: #7f8c8d;
}

.form-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 30px;
}

.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background: #3498db;
  color: white;
}

.btn-secondary {
  background: #95a5a6;
  color: white;
}

.btn-success {
  background: #27ae60;
  color: white;
}

.booking-summary {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 5px;
  margin-top: 20px;
}

.booking-summary h3 {
  margin-bottom: 15px;
  color: #2c3e50;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid #ecf0f1;
}

.summary-item:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.success-message {
  text-align: center;
  padding: 40px;
  background: #d4edda;
  border-radius: 5px;
  margin-top: 20px;
}

.success-message h3 {
  color: #155724;
  margin-bottom: 10px;
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }

  .progress-bar {
    flex-direction: column;
    gap: 20px;
  }

  .progress-bar::before {
    display: none;
  }

  .form-actions {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }
}
</style>
