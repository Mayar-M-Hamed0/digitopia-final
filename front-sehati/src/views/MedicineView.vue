<template>
  <div class="container-fluid pb-5 bg-primary hero-header">
    <div class="container py-5">
      <div class="row g-5 align-items-center mb-5">
        <!-- النص - مساحة أكبر ومتوازنة -->
        <div
          class="col-12 col-md-6 col-lg-6 order-2 order-md-1 animate__animated animate__slideInRight"
        >
          <div class="text-center">
            <h1 class="display-4 fw-bold mb-4">بحث عن الأدوية والعلاجات</h1>
            <p class="fs-5 mb-4">
              ابحث عن الأدوية المتاحة بالتأمين الصحي في المنطقة المجاورة
            </p>
          </div>
        </div>
        <!-- الصورة - مساحة متوازنة -->
        <div
          class="col-12 col-md-6 col-lg-6 order-1 order-md-2 animate__animated animate__slideInLeft"
        >
          <div class="text-center">
            <img
              src="@/assets/img/drug.jpg"
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
  <div class="drug-search-container">
    <h2 class="text-center my-4" data-aos="fade-in" data-aos-delay="300">
      بحث عن الأدوية والعلاجات
    </h2>
    <p class="text-center text-muted" data-aos="fade-in" data-aos-delay="500">
      تأكد من توفر الدواء قبل الذهاب للصيدلية
    </p>

    <form @submit.prevent="searchDrugs" class="search-form">
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

      <!-- حقل البحث عن العلاج -->
      <div class="form-group">
        <label for="drugSearch">بحث عن العلاج:</label>
        <input
          type="text"
          id="drugSearch"
          v-model="drugSearchTerm"
          :placeholder="
            selectedHealthcare
              ? 'اكتب اسم الدواء للبحث...'
              : 'اختر المركز الصحي أولاً'
          "
          :disabled="!selectedHealthcare"
        />
      </div>

      <!-- إزالة زر البحث وإبقاء زر الفلاتر فقط -->
      <button type="button" @click="toggleFilters" class="filter-toggle">
        {{ showFilters ? "إخفاء الفلاتر" : "عرض فلاتر إضافية" }}
      </button>
    </form>

    <!-- نتائج البحث -->
    <div class="results" v-if="searchResults.length > 0">
      <div v-if="!drugSearchTerm" class="search-prompt">
        <p>👆 ابدأ بالكتابة في حقل البحث لعرض الأدوية المتاحة</p>
      </div>

      <div v-else>
        <h3>نتائج البحث ({{ filteredDrugs.length }})</h3>

        <div class="search-info">
          <p>عرض الأدوية التي تطابق: "{{ drugSearchTerm }}"</p>
        </div>

        <div class="drugs-grid">
          <div
            v-for="drug in filteredDrugs"
            :key="drug.id"
            class="drug-card"
            :class="{
              'low-stock': drug.pivot.stock < 10,
              'out-of-stock': drug.pivot.stock === 0,
            }"
          >
            <h4>{{ drug.name }}</h4>
            <p class="scientific-name">{{ drug.scientific_name }}</p>
            <p class="description">{{ drug.description }}</p>

            <div class="drug-details">
              <p><strong>الصناعة:</strong> {{ drug.manufacturer }}</p>
              <p><strong>السعر:</strong> {{ drug.price }} جنيه</p>
              <p><strong>الفئة:</strong> {{ drug.category }}</p>
              <p><strong>الشكل الصيدلاني:</strong> {{ drug.dosage_form }}</p>
              <p>
                <strong>التوفر:</strong>
                <span :class="getAvailabilityClass(drug.pivot.availability)">
                  {{ getAvailabilityText(drug.pivot.availability) }}
                </span>
              </p>
              <p>
                <strong>التأمين:</strong>
                <span :class="{ covered: drug.insurance_covered }">
                  {{ drug.insurance_covered ? "مغطى" : "غير مغطى" }}
                </span>
              </p>
            </div>
          </div>
        </div>

        <div v-if="filteredDrugs.length === 0" class="no-results">
          <p>لا توجد أدوية تطابق "{{ drugSearchTerm }}"</p>
        </div>
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
  name: "DrugSearch",
  setup() {
    // البيانات الأساسية
    const governorates = ref([]);
    const cities = ref([]);
    const healthcareCenters = ref([]);

    // القيم المحددة
    const selectedGovernorate = ref(null);
    const selectedCity = ref(null);
    const selectedHealthcare = ref(null);
    const drugSearchTerm = ref("");

    // عوامل التصفية
    const showFilters = ref(false);
    const filters = reactive({
      category: "",
      insuranceCovered: false,
      availability: "",
    });

    // نتائج البحث
    const searchResults = ref([]);
    const searchPerformed = ref(false);

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
        drugSearchTerm.value = "";
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
        drugSearchTerm.value = "";
      } catch (error) {
        console.error("Error loading healthcare centers:", error);
      }
    };

    // دالة جلب الأدوية (بدون زر - تعمل تلقائياً)
    const searchDrugs = async () => {
      if (!selectedHealthcare.value) return;

      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/drugs?health_center_id=${selectedHealthcare.value.id}`
        );
        searchResults.value = await response.json();
        searchPerformed.value = true;
        drugSearchTerm.value = ""; // مسح حقل البحث بعد جلب الأدوية
      } catch (error) {
        console.error("Error searching drugs:", error);
      }
    };

    // watch لتفعيل البحث تلقائياً عند اختيار المركز الصحي
    watch(selectedHealthcare, async (newVal) => {
      if (newVal) {
        await searchDrugs(); // يجلب الأدوية تلقائياً
      } else {
        searchResults.value = [];
        searchPerformed.value = false;
        drugSearchTerm.value = "";
      }
    });

    // الأدوية المصفاة بناء على البحث والفلاتر
    const filteredDrugs = computed(() => {
      // إذا لم يكن هناك بحث، لا تعرض أي أدوية
      if (!drugSearchTerm.value.trim()) {
        return [];
      }

      let results = searchResults.value;

      // إذا لم يكن هناك نتائج بحث، لا تعرض شيء
      if (results.length === 0) {
        return [];
      }

      // تصفية حسب مصطلح البحث (إجباري)
      const term = drugSearchTerm.value.toLowerCase().trim();
      results = results.filter(
        (drug) =>
          drug.name.toLowerCase().includes(term) ||
          drug.scientific_name.toLowerCase().includes(term) ||
          drug.description.toLowerCase().includes(term)
      );

      // تصفية حسب الفئة (اختياري)
      if (filters.category) {
        results = results.filter((drug) => drug.category === filters.category);
      }

      // تصفية حسب التأمين (اختياري)
      if (filters.insuranceCovered) {
        results = results.filter((drug) => drug.insurance_covered);
      }

      // تصفية حسب التوفر (اختياري)
      if (filters.availability) {
        results = results.filter((drug) => {
          if (filters.availability === "available") {
            return drug.pivot.stock > 10;
          } else if (filters.availability === "low_stock") {
            return drug.pivot.stock > 0 && drug.pivot.stock <= 10;
          } else if (filters.availability === "out_of_stock") {
            return drug.pivot.stock === 0;
          }
          return true;
        });
      }

      return results;
    });

    // الدوال المساعدة
    const toggleFilters = () => {
      showFilters.value = !showFilters.value;
    };

    const getAvailabilityClass = (availability) => {
      switch (availability) {
        case 1:
          return "available";
        case "low_stock":
          return "low-stock";
        case 0:
          return "out-of-stock";
        default:
          return "";
      }
    };

    const getAvailabilityText = (availability) => {
      switch (availability) {
        case 1:
          return "متوفر";
        case "low_stock":
          return "كمية محدودة";
        case 0:
          return "غير متوفر";
        default:
          return availability;
      }
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
      drugSearchTerm,
      showFilters,
      filters,
      searchResults,
      searchPerformed,
      filteredDrugs,
      toggleFilters,
      getAvailabilityClass,
      getAvailabilityText,
      loadCities,
      loadHealthcareCenters,
      // searchDrugs // لم نعد نحتاجها بشكل علني
    };
  },
};
</script>

<style scoped>
.drug-search-container {
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

.drugs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.drug-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  background: white;
}

.drug-card h4 {
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

.drug-details {
  margin-top: 10px;
}

.drug-details p {
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

.drug-card.low-stock {
  border-left: 4px solid orange;
}

.drug-card.out-of-stock {
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

  .drugs-grid {
    grid-template-columns: 1fr;
  }
}
</style>
