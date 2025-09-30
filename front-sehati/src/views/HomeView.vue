<template>
  <div class="home">
    <!-- Hero Start -->
    <div class="container-fluid pb-5 bg-primary hero-header">
      <div class="container py-5">
        <div class="row g-5 align-items-center mb-5">
          <div class="col-lg-6">
            <h1
              class="display-1 mb-4 animated animate__animated animate__slideInLeft"
            >
              صحتك <span class="text-primary">أولويتنا</span>
            </h1>
            <h5
              class="d-inline-block border border-2 border-white py-3 px-5 mb-0 animate__animated animate__slideInLeft"
            >
              منصة رقمية لخدمات التطعيم والأدوية والأطباء
            </h5>
          </div>
          <div class="col-lg-6">
            <Carousel
              v-bind="carouselConfig"
              :items-to-show="1"
              :wrap-around="true"
              :autoplay="3000"
            >
              <Slide v-for="(img, i) in images" :key="i">
                <img class="img-fluid w-100" :src="img.src" :alt="img.alt" />
              </Slide>
            </Carousel>
          </div>
        </div>
        <div class="row g-5" data-aos="fade-in" data-aos-delay="300">
          <div class="col-md-6 col-lg-3">
            <div class="d-flex align-items-center">
              <div
                class="flex-shrink-0 btn-square border border-2 border-white me-3"
              >
                <i class="fa fa-syringe text-primary"></i>
              </div>
              <h5 class="lh-base mb-0">حجز التطعيمات</h5>
            </div>
          </div>
          <div class="col-md-6 col-lg-3">
            <div class="d-flex align-items-center">
              <div
                class="flex-shrink-0 btn-square border border-2 border-white me-3"
              >
                <i class="fa fa-pills text-primary"></i>
              </div>
              <h5 class="lh-base mb-0">الاستعلام عن الأدوية</h5>
            </div>
          </div>
          <div class="col-md-6 col-lg-3">
            <div class="d-flex align-items-center">
              <div
                class="flex-shrink-0 btn-square border border-2 border-white me-3"
              >
                <i class="fa fa-user-md text-primary"></i>
              </div>
              <h5 class="lh-base mb-0">جداول الأطباء</h5>
            </div>
          </div>
          <div class="col-md-6 col-lg-3">
            <div class="d-flex align-items-center">
              <div
                class="flex-shrink-0 btn-square border border-2 border-white me-3"
              >
                <i class="fa fa-heartbeat text-primary"></i>
              </div>
              <h5 class="lh-base mb-0">خدمات صحية شاملة</h5>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Hero End -->

    <!-- About Start -->
    <div class="container-fluid py-5">
      <div class="container py-5">
        <div class="row g-5">
          <div class="col-lg-6">
            <div class="row" data-aos="fade-in" data-aos-delay="100">
              <div class="col-6 about-images">
                <img
                  class="img-fluid h-100"
                  height="200"
                  src="@/assets/img/ChatGPT Image Sep 26, 2025, 06_11_53 PM.png"
                  alt=""
                />
              </div>
              <div class="col-6">
                <img
                  class="img-fluid h-75"
                  src="@/assets/img/about.jpg"
                  alt=""
                />
                <div
                  class="h-25 d-flex align-items-center text-center bg-primary px-4"
                >
                  <h4 class="text-white lh-base mb-0">
                    معاً لتحسين النظام الصحي
                  </h4>
                </div>
              </div>
            </div>
          </div>

          <div class="col-lg-6" data-aos="fade-in" data-aos-delay="300">
            <h1 class="mb-5">
              <span class="text-uppercase text-primary bg-light px-2">عن</span>
              منصتنا
            </h1>
            <p class="mb-4">
              منصة صحتي وُجدت لتسهيل الخدمات الصحية: من حجز التطعيمات للأطفال،
              إلى الاستعلام عن توفر الأدوية، وصولاً لعرض جداول حضور الأطباء.
            </p>
            <p class="mb-5">
              هدفنا هو تقليل الزحام، رفع كفاءة توزيع الأدوية، وتحسين تجربة
              المريض.
            </p>
            <div class="row g-3">
              <div class="col-sm-6">
                <h6 class="mb-3">
                  <i class="fa fa-check text-primary me-2"></i>سهولة الاستخدام
                </h6>
                <h6 class="mb-0">
                  <i class="fa fa-check text-primary me-2"></i>بيانات محدثة
                  يومياً
                </h6>
              </div>
              <div class="col-sm-6">
                <h6 class="mb-3">
                  <i class="fa fa-check text-primary me-2"></i>خدمة مجانية
                </h6>
                <h6 class="mb-0">
                  <i class="fa fa-check text-primary me-2"></i>موثوقة وآمنة
                </h6>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- About End -->

    <!-- Articles Start -->
    <div class="row mx-4">
      <h2 class="text-primary">احدث مقالتنا</h2>
      <Carousel :items-to-show="3" :wrap-around="true" :autoplay="3000">
        <Slide v-for="(article, index) in articles" :key="index">
          <div class="">
            <div class="service-item">
              <div class="overflow-hidden">
                <img
                  class="img-fluid"
                  :src="article.image"
                  :alt="article.title"
                />
              </div>
              <div
                class="p-4 text-center border border-5 border-light border-top-0"
              >
                <h4 class="mb-3">{{ article.title }}</h4>
                <p>{{ article.description }}</p>
                <a class="fw-medium" href="">
                  Read More<i class="fa fa-arrow-right ms-2"></i>
                </a>
              </div>
            </div>
          </div>
        </Slide>
        <template #addons>
          <Navigation />
          <Pagination />
        </template>
      </Carousel>
    </div>
    <!-- Articles End -->

    <!-- Features Start -->
    <div class="container-fluid py-5">
      <div class="container py-5">
        <div class="text-center" data-aos="fade-in" data-aos-delay="100">
          <h1 class="mb-5">
            لماذا تختار
            <span class="text-uppercase text-primary bg-light px-2"
              >منصتنا</span
            >
          </h1>
        </div>
        <div class="row g-5 align-items-center text-center">
          <div class="col-md-6 col-lg-4">
            <i class="fa fa-syringe fa-5x text-primary mb-4"></i>
            <h4>حجز تطعيمات سريع</h4>
            <p class="mb-0">بخطوات بسيطة، يمكنك حجز ميعاد لطفلك بسهولة.</p>
          </div>
          <div class="col-md-6 col-lg-4">
            <i class="fa fa-pills fa-5x text-primary mb-4"></i>
            <h4>استعلام عن الأدوية</h4>
            <p class="mb-0">
              اعرف الدواء متاح فين قبل ما تروح الصيدلية أو المستشفى.
            </p>
          </div>
          <div class="col-md-6 col-lg-4">
            <i class="fa fa-user-md fa-5x text-primary mb-4"></i>
            <h4>جداول الأطباء</h4>
            <p class="mb-0">شاهد مواعيد الأطباء لتوفير وقتك وتقليل الانتظار.</p>
          </div>
        </div>
      </div>
    </div>
    <!-- Features End -->
  </div>
</template>
<script>
import "@/assets/js/main.js";
import "vue3-carousel/carousel.css";
import { Carousel, Slide, Navigation, Pagination } from "vue3-carousel";

export default {
  components: { Carousel, Slide, Navigation, Pagination },
  data() {
    return {
      images: [
        {
          id: 1,
          src: require("@/assets/img/hero-slider-1.jpg"),
          alt: "Slide 1",
        },
        {
          id: 2,
          src: require("@/assets/img/hero-slider-2.jpg"),
          alt: "Slide 2",
        },
        {
          id: 3,
          src: require("@/assets/img/hero-slider-3.jpg"),
          alt: "Slide 3",
        },
      ],
      carouselConfig: {
        dir: "ttb",
        wrapAround: true,
        itemsToShow: 1,
        snapAlign: "center",
        height: "450px",
        gap: 5,
      },
      articles: [
        {
          title: "Wooden Floor",
          image: "img/service-4.jpg",
          description:
            "Stet stet justo dolor sed duo. Ut clita sea sit ipsum diam lorem diam.",
        },
        {
          title: "Wooden Furniture",
          image: "img/service-5.jpg",
          description:
            "Stet stet justo dolor sed duo. Ut clita sea sit ipsum diam lorem diam.",
        },
        {
          title: "Custom Work",
          image: "img/service-6.jpg",
          description:
            "Stet stet justo dolor sed duo. Ut clita sea sit ipsum diam lorem diam.",
        },
      ],
    };
  },
};
</script>

<style src="@/assets/css/style.css"></style>
<style scoped>
.about-images {
  min-height: 350px;
}
</style>
