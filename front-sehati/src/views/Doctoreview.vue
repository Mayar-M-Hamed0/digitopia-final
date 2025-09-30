<template>
  <div class="container-fluid pb-5 bg-primary hero-header">
    <div class="container py-5">
      <div class="row g-5 align-items-center mb-5">
        <!-- النص - مساحة أكبر ومتوازنة -->
        <div
          class="col-12 col-md-6 col-lg-6 order-2 order-md-1 animate__animated animate__slideInRight"
        >
          <div class="text-center">
            <h1 class="display-4 fw-bold mb-4">بحث عن الأطباء</h1>
            <p>ابحث عن طبيبك واعرف مواعيد حضوره</p>
          </div>
        </div>
        <!-- الصورة - مساحة متوازنة -->
        <div
          class="col-12 col-md-6 col-lg-6 order-1 order-md-2 animate__animated animate__slideInLeft"
        >
          <div class="text-center">
            <img
              src="@/assets/img/young-handsome-physician-medical-robe-with-stethoscope.jpg"
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
  <div class="doctor-search-container">
    <h2 class="text-center my-4" data-aos="fade-in" data-aos-delay="300">
      اعرف مواعيد الأطباء المحدثه باستمرار
    </h2>

    <form @submit.prevent="searchDoctors" class="search-form">
      <!-- اختيار المحافظة -->
      <div class="form-group">
        <label for="governorate">المحافظة:</label>
        <select
          id="governorate"
          v-model="selectedGovernorate"
          @change="loadCities"
          required
        >
          <option value="">اختر المحافظة</option>
          <option
            v-for="governorate in governorates"
            :key="governorate.id"
            :value="governorate"
          >
            {{ governorate.name }}
          </option>
        </select>
      </div>

      <!-- اختيار المدينة -->
      <div class="form-group" v-if="cities.length > 0">
        <label for="city">المدينة:</label>
        <select
          id="city"
          v-model="selectedCity"
          @change="loadHealthcareCenters"
          required
        >
          <option value="">اختر المدينة</option>
          <option v-for="city in cities" :key="city.id" :value="city">
            {{ city.name }}
          </option>
        </select>
      </div>

      <!-- اختيار مركز الرعاية الصحية -->
      <div class="form-group" v-if="healthcareCenters.length > 0">
        <label for="healthcare">مركز الرعاية الصحية:</label>
        <select id="healthcare" v-model="selectedHealthcare" required>
          <option value="">اختر المركز الصحي</option>
          <option
            v-for="center in healthcareCenters"
            :key="center.id"
            :value="center"
          >
            {{ center.name }}
          </option>
        </select>
      </div>

      <!-- حقل البحث عن الطبيب -->
      <div class="form-group">
        <label for="doctorSearch">بحث عن الطبيب:</label>
        <input
          type="text"
          id="doctorSearch"
          v-model="doctorSearchTerm"
          :placeholder="
            selectedHealthcare
              ? 'اكتب اسم الطبيب للبحث...'
              : 'اختر المركز الصحي أولاً'
          "
          :disabled="!selectedHealthcare"
        />
      </div>

      <!-- زر الفلاتر -->
      <button type="button" @click="toggleFilters" class="filter-toggle">
        {{ showFilters ? "إخفاء الفلاتر" : "عرض فلاتر إضافية" }}
      </button>

      <!-- الفلاتر الإضافية -->
      <div v-if="showFilters" class="filters">
        <div class="form-group">
          <label for="specialty">التخصص:</label>
          <select
            id="specialty"
            v-model="filters.specialty"
            @change="searchDoctors"
          >
            <option value="">جميع التخصصات</option>
            <option
              v-for="specialty in allSpecialties"
              :key="specialty"
              :value="specialty"
            >
              {{ specialty }}
            </option>
          </select>
        </div>
        <div class="form-group">
          <label for="date">تاريخ التوفر:</label>
          <input
            type="date"
            id="date"
            v-model="filters.date"
            @change="searchDoctors"
          />
        </div>
      </div>
    </form>

    <!-- نتائج البحث -->
    <div
      class="results"
      v-if="
        searchResults.length > 0 &&
        (doctorSearchTerm || filters.specialty || filters.date)
      "
    >
      <h3>نتائج البحث ({{ filteredDoctors.length }})</h3>

      <div class="search-info">
        <p>
          <span v-if="doctorSearchTerm">
            عرض الأطباء التي تطابق: "{{ doctorSearchTerm }}"
          </span>
          <span v-else>عرض جميع الأطباء</span>
          <span v-if="filters.specialty"
            >، التخصص: {{ filters.specialty }}</span
          >
          <span v-if="filters.date"
            >، التاريخ: {{ formatDate(filters.date) }}</span
          >
        </p>
      </div>

      <div
        v-for="doctor in filteredDoctors"
        :key="doctor.id"
        class="doctor-card bg-white shadow-md rounded-xl p-4 mb-4 border hover:shadow-lg transition-all"
      >
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="row">
            <div class="col col-lg-5">
              <div class="doctor-info flex flex-col justify-between">
                <div>
                  <h3 class="text-lg font-semibold text-gray-800">
                    {{ doctor.name }}
                  </h3>
                  <p class="specialty text-sm text-gray-500">
                    {{ doctor.specialty }}
                  </p>
                </div>
                <div
                  class="status-badge mt-3 inline-block px-3 py-1 rounded-full text-xs font-semibold"
                  :class="getStatusClass(doctor)"
                >
                  {{ getStatusText(doctor) }}
                </div>
              </div>
            </div>
            <div class="col col-lg-7">
              <!-- العمود الثاني: المواعيد -->
              <div class="schedule-section">
                <!-- مواعيد اليوم -->
                <div
                  class="today-schedule bg-gray-50 rounded-lg p-3 mb-3"
                  v-if="getTodaySchedule(doctor).length > 0"
                >
                  <div
                    class="today-header flex justify-between items-center mb-2"
                  >
                    <span class="today-label font-medium text-gray-700"
                      >📅 اليوم</span
                    >
                    <span class="date text-xs text-gray-500">{{
                      getTodayDate()
                    }}</span>
                  </div>
                  <div class="time-slots grid gap-2 sm:grid-cols-2">
                    <div
                      v-for="slot in getTodaySchedule(doctor)"
                      :key="slot.id"
                      class="time-slot flex justify-between items-center px-2 py-1 rounded border"
                      :class="
                        slot.available
                          ? 'border-green-400 bg-green-50'
                          : 'border-red-300 bg-red-50'
                      "
                    >
                      <span class="time text-sm text-gray-700">
                        {{ formatTime(slot.start_time) }} -
                        {{ formatTime(slot.end_time) }}
                      </span>
                      <span
                        class="availability text-xs font-bold"
                        :class="
                          slot.available ? 'text-green-600' : 'text-red-500'
                        "
                      >
                        {{ slot.available ? "متاح" : "غير متاح" }}
                      </span>
                    </div>
                  </div>
                </div>

                <!-- جدول الأسبوع -->
                <div class="weekly-schedule">
                  <h5 class="font-medium text-gray-700 mb-2 text-sm">
                    📆 مواعيد الأسبوع
                  </h5>
                  <div class="week-days grid sm:grid-cols-2 gap-2">
                    <div
                      v-for="day in weekDays.filter(
                        (d) => getDaySchedule(doctor, d.value).length > 0
                      )"
                      :key="day.value"
                      class="day-schedule p-2 rounded bg-gray-50 shadow-sm"
                    >
                      <span
                        class="day-name font-medium text-gray-700 text-sm block mb-1"
                        >{{ day.ar }}</span
                      >
                      <div class="day-slots flex flex-wrap gap-1">
                        <div
                          v-for="schedule in getDaySchedule(doctor, day.value)"
                          :key="schedule.id"
                          class="day-slot px-2 py-0.5 text-xs rounded bg-green-100 text-green-700 font-medium"
                        >
                          <p>من {{ formatTime(schedule.start_time) }}</p>
                          <p>الي {{ formatTime(schedule.end_time) }}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="filteredDoctors.length === 0" class="no-results">
        <p>لا توجد أطباء حاليًا تطابق البحث</p>
      </div>
    </div>

    <div class="no-results" v-else-if="searchPerformed && !selectedHealthcare">
      <p>يرجى اختيار مركز الرعاية الصحية أولاً</p>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted, watch } from "vue";

export default {
  name: "DoctorSearch",
  setup() {
    // البيانات الأساسية
    const governorates = ref([]);
    const cities = ref([]);
    const healthcareCenters = ref([]);

    // القيم المحددة
    const selectedGovernorate = ref(null);
    const selectedCity = ref(null);
    const selectedHealthcare = ref(null);
    const doctorSearchTerm = ref("");

    // عوامل التصفية
    const showFilters = ref(false);
    const filters = reactive({
      specialty: "",
      date: "",
      insuranceCovered: false,
      availability: "",
    });

    // نتائج البحث
    const searchResults = ref([]);
    const searchPerformed = ref(false);

    // التخصصات الفريدة لكل الأطباء في المركز
    const allSpecialties = ref([]);

    // أيام الأسبوع
    const weekDays = [
      { value: "monday", ar: "الإثنين" },
      { value: "tuesday", ar: "الثلاثاء" },
      { value: "wednesday", ar: "الأربعاء" },
      { value: "thursday", ar: "الخميس" },
      { value: "friday", ar: "الجمعة" },
      { value: "saturday", ar: "السبت" },
      { value: "sunday", ar: "الأحد" },
    ];

    // دوال جلب البيانات
    const loadGovernorates = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/governorates");
        governorates.value = await response.json();
      } catch (error) {
        console.error("Error loading governorates:", error);
      }
    };

    const loadCities = async () => {
      if (!selectedGovernorate.value) return;

      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/cities?governorate_id=${selectedGovernorate.value.id}`
        );
        cities.value = await response.json();
        selectedCity.value = null;
        selectedHealthcare.value = null;
        healthcareCenters.value = [];
        searchResults.value = [];
        searchPerformed.value = false;
        doctorSearchTerm.value = "";
        allSpecialties.value = [];
        filters.date = "";
        filters.specialty = "";
      } catch (error) {
        console.error("Error loading cities:", error);
      }
    };

    const loadHealthcareCenters = async () => {
      if (!selectedCity.value) return;

      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/healthcare-centers?city_id=${selectedCity.value.id}`
        );
        healthcareCenters.value = await response.json();
        selectedHealthcare.value = null;
        searchResults.value = [];
        searchPerformed.value = false;
        doctorSearchTerm.value = "";
        allSpecialties.value = [];
        filters.date = "";
        filters.specialty = "";
      } catch (error) {
        console.error("Error loading healthcare centers:", error);
      }
    };

    // دالة جلب الأطباء
    const searchDoctors = async () => {
      if (!selectedHealthcare.value) return;

      try {
        let url = `http://127.0.0.1:8000/api/doctors?health_center_id=${selectedHealthcare.value.id}`;
        if (filters.date) {
          url += `&date=${filters.date}`;
        }
        if (filters.specialty) {
          url += `&specialty=${encodeURIComponent(filters.specialty)}`;
        }
        if (filters.insuranceCovered) {
          url += `&insurance_covered=true`;
        }
        const response = await fetch(url);
        searchResults.value = await response.json();
        searchPerformed.value = true;

        // استخراج التخصصات الفريدة عند تحميل المركز لأول مرة فقط
        if (!filters.specialty && !filters.date && !filters.insuranceCovered) {
          allSpecialties.value = [
            ...new Set(searchResults.value.map((doctor) => doctor.specialty)),
          ].sort();
        }
      } catch (error) {
        console.error("Error searching doctors:", error);
      }
    };

    // دالة تبديل عرض الفلاتر
    const toggleFilters = () => {
      showFilters.value = !showFilters.value;
    };

    // مراقب لاختيار المركز الصحي
    watch(selectedHealthcare, async (newHealthcare) => {
      if (newHealthcare) {
        // إعادة تعيين الفلاتر
        filters.date = "";
        filters.specialty = "";
        filters.insuranceCovered = false;
        doctorSearchTerm.value = "";
        await searchDoctors();
      } else {
        searchResults.value = [];
        searchPerformed.value = false;
        doctorSearchTerm.value = "";
        allSpecialties.value = [];
      }
    });

    // الاطباء المصفاة بناء على البحث
    const filteredDoctors = computed(() => {
      let results = searchResults.value;

      if (results.length === 0) {
        return [];
      }

      // تصفية حسب مصطلح البحث (اختياري)
      if (doctorSearchTerm.value.trim()) {
        const term = doctorSearchTerm.value.toLowerCase().trim();
        results = results.filter((doctor) =>
          doctor.name.toLowerCase().includes(term)
        );
      }

      return results;
    });

    // تنسيق التاريخ
    const formatDate = (date) => {
      if (!date) return "";
      const d = new Date(date);
      return d.toLocaleDateString("ar-EG", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    };

    // تنسيق الوقت
    const formatTime = (time) => {
      if (!time) return "";
      const [hours, minutes] = time.split(":");
      const hoursNum = parseInt(hours);
      const period = hoursNum >= 12 ? "م" : "ص";
      const formattedHours = hoursNum % 12 || 12;
      return `${formattedHours}:${minutes} ${period}`;
    };

    // دالة الحصول على حالة الطبيب
    const getStatusClass = (doctor) => {
      return doctor.is_active ? "active" : "inactive";
    };

    const getStatusText = (doctor) => {
      return doctor.is_active ? "نشط" : "غير نشط";
    };

    // دالة الحصول على مواعيد اليوم
    const getTodaySchedule = (doctor) => {
      return (
        doctor.schedules?.filter(
          (schedule) =>
            schedule.day_of_week ===
            new Date()
              .toLocaleDateString("ar-EG", { weekday: "long" })
              .toLowerCase()
        ) || []
      );
    };

    // دالة الحصول على مواعيد يوم معين
    const getDaySchedule = (doctor, day) => {
      return (
        doctor.schedules?.filter((schedule) => schedule.day_of_week === day) ||
        []
      );
    };

    // دالة الحصول على تاريخ اليوم
    const getTodayDate = () => {
      return new Date().toLocaleDateString("ar-EG", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    };

    // تحميل البيانات الأولية عند تركيب المكون
    onMounted(() => {
      loadGovernorates();
    });

    return {
      governorates,
      cities,
      healthcareCenters,
      selectedGovernorate,
      selectedCity,
      selectedHealthcare,
      doctorSearchTerm,
      showFilters,
      filters,
      searchResults,
      searchPerformed,
      filteredDoctors,
      allSpecialties,
      weekDays,
      loadCities,
      loadHealthcareCenters,
      searchDoctors,
      toggleFilters,
      formatDate,
      formatTime,
      getStatusClass,
      getStatusText,
      getTodaySchedule,
      getDaySchedule,
      getTodayDate,
    };
  },
};
</script>

<style scoped>
.doctor-search-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  min-height: 50vh;
}

.search-form {
  background: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 30px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

select,
input[type="text"] {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.search-btn,
.filter-toggle {
  background: #007bff;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 10px;
}

.filter-toggle {
  background: #6c757d;
}

.search-btn:hover {
  background: #0056b3;
}

.filter-toggle:hover {
  background: #545b62;
}

.filters {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #ddd;
}

.doctors-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.doctor-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  background: white;
}

.doctor-card h4 {
  margin-top: 0;
  color: #333;
}

.scientific-name {
  font-style: italic;
  color: #666;
}

.description {
  color: #777;
  font-size: 0.9em;
}

.doctor-details {
  margin-top: 10px;
}

.doctor-details p {
  margin: 5px 0;
  font-size: 0.9em;
}

.available {
  color: green;
  font-weight: bold;
}

.low-stock {
  color: orange;
  font-weight: bold;
}

.out-of-stock {
  color: red;
  font-weight: bold;
}

.covered {
  color: green;
}

.doctor-card.low-stock {
  border-left: 4px solid orange;
}

.doctor-card.out-of-stock {
  border-left: 4px solid red;
}

.no-results {
  text-align: center;
  padding: 20px;
  color: #666;
}

@media (max-width: 768px) {
  .filters {
    grid-template-columns: 1fr;
  }

  .doctors-grid {
    grid-template-columns: 1fr;
  }
}
</style>
