<template>
  <div class="ma-9 d-flex justify-center">
    -->
    <div class="my-5" style="width: 85%">
      <v-row justify="center" class="mb-9">
        <v-col cols="12" sm="6">
          <div>
            <h1 class="text-h2 font-weight-medium">Our fleet SUVs</h1>
          </div>
        </v-col>
        <v-col cols="12" sm="6">
          <div>
            <p>
              Our vehicle fleet is designed to provide customers with a wide
              range of options to choose from, with a focus on comfort,
              performance, and reliability.
            </p>
          </div>
        </v-col>
      </v-row>
      <v-row justify="center">
        <v-col
          cols="12"
          sm="3"
          v-for="(car, index) in cars"
          :key="index"
          class="pa-0"
          :class="{ 'd-flex justify-center': smAndDown }"
        >
          <div
            class="card"
            :class="{
              'active-card': index === currentIndex,
            }"
          >
            <div>
              <h2>{{ car.carName }}</h2>
              <v-btn
                class="btn"
                icon="mdi-arrow-right"
                :ripple="true"
                size="x-small"
                rounded="xl"
              >
              </v-btn>
            </div>
            <div class="img">
              <v-img contain :src="car.imgUrl" width="200" height="150" />
            </div>
            <div class="card-content">
              <div class="card-icons">
                <v-icon style="color: #135764">mdi-account</v-icon>
                <span class="font-weight-normal">{{ car.capacity }}</span>
                <v-icon style="margin-left: 15px; color: #135764"
                  >mdi-car-shift-pattern</v-icon
                >
                <span>Manual</span>
              </div>
              <p class="price">
                <span class="font-weight-bold">${{ car.price }}</span
                >/d
              </p>
            </div>
          </div>
        </v-col>
      </v-row>
      <v-row justify="end" class="mt-9">
        <v-col cols="12" sm="8">
          <div class="d-flex justify-center">
            <v-btn
              class="rounded-lg"
              width="150"
              height="37"
              style="font-size: small"
              color="#153448"
            >
              Open All Models
            </v-btn>
          </div>
        </v-col>
        <v-col cols="12" sm="2">
          <div
            class="d-flex justify-end"
            :class="{ 'd-flex justify-center': smAndDown }"
          >
            <v-btn
              class="button-hover"
              density="compact"
              icon="mdi-chevron-left"
              @click="prevSlide"
            ></v-btn>
            <v-btn
              class="button-hover"
              density="compact"
              icon="mdi-chevron-right"
              style="margin-left: 5px"
              @click="nextSlide"
            ></v-btn>
          </div>
        </v-col>
      </v-row>
    </div>
    <!-- <div class="d-flex justify-center">
    <div
      class="ma-9 d-flex flex-column align-center justify-center"
      style="width: 85%"
    >
      <v-row class="text-center" justify="center">
        <v-col cols="12" class="text-h4">
          <h1>Exclusive Offer</h1>
        </v-col>
        <v-col cols="6" class="text-center">
          <p>
            Our vehicle fleet is designed to provide customers with a wide range
            of options to choose from, with a focus on comfort, performance, and
            reliability.
          </p>
        </v-col>
      </v-row>

      <v-row justify="end">
        <v-col cols="">
          <div class="exclusive-card rounded-xl ma-0">
            <div class="float-right">
              <h3 class="ma-9 font-weight-light text-h6 text-center">
                Mercedes Benz GLE <br />for
                <span class="font-weight-bold text-h6">$150</span>
                /day
              </h3>
            </div>
          </div>
        </v-col>
        <v-col cols="">
          <div>
            <div class="exclusive-card2 rounded-xl ma-0"></div>
          </div>
        </v-col>
      </v-row>
    </div>
  </div> -->
  </div>
</template>

<script setup>
import CustomBtn from "~/components/shared/CustomBtn.vue";
import { useDisplay } from "vuetify";
import { ref, computed } from "vue";

const { smAndUp } = useDisplay();
const { smAndDown } = useDisplay();
const { sm } = useDisplay();
const mobile1 = useDisplay();

console.log(mobile1, "------------------");

const currentIndex = ref(0);
const totalCarsLength = ref(0);

const cars = computed(() => {
  const list = [
    {
      carName: "Range Rover",
      imgUrl:
        "https://the-95-star.s3.amazonaws.com/1000003204-removebg-preview.png",
      capacity: 5,
      price: 480,
    },
    {
      carName: "Range Rover",
      imgUrl:
        "https://the-95-star.s3.amazonaws.com/1000002875-removebg-preview.png",
      capacity: 5,
      price: 480,
    },
    {
      carName: "Range Rover",
      imgUrl:
        "https://the-95-star.s3.amazonaws.com/1000002872-removebg-preview.png",
      capacity: 5,
      price: 480,
    },
    {
      carName: "Range Rover",
      imgUrl:
        "https://the-95-star.s3.amazonaws.com/1000002872-removebg-preview.png",
      capacity: 5,
      price: 480,
    },
  ];
  totalCarsLength.value = list.length;
  return smAndUp.value ? list : [list[currentIndex.value]];
});

const nextSlide = () => {
  // if (currentIndex.value < cars.value.length - 1) {
  //   currentIndex.value++;
  // } else {
  //   currentIndex.value = 0;
  // }
  currentIndex.value = (currentIndex.value + 1) % totalCarsLength.value;
};

const prevSlide = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--;
  }
};
</script>

<style lang="scss" scoped>
@import url("https://fonts.googleapis.com/css2?family=Raleway:wght@400;700&display=swap");

* {
  margin: 0px;
  padding: 0px;
  box-sizing: border-box;
  font-family: "Raleway", sans-serif;
}

body {
  background: #f0f0f0;
}
.class {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.card {
  width: 250px;
  height: 255px;
  background-color: #f0f0f0;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
  margin: 10px;
  transition: background-color 0.5s ease-in-out;
  position: relative;
}

.active-card,
.card:hover {
  // transform: translateX(10px);
  background-color: #c8e6eb;
}

.active-card .btn,
.card:hover .btn {
  opacity: 1;
}

.card h2 {
  float: left;
  margin: 10px;
  font-family: "Raleway";
  margin-bottom: 0;
  font-size: large;
}
.btn {
  opacity: 0;
  float: right;
  margin: 10px;
  width: 20%;
  height: 28px;
}

.card-content {
  font-size: small;
  margin-top: 25px;
  padding-left: 10px;
}
.card-icons {
  display: flex;
  justify-content: center;
  margin-left: 10px;
  float: left;
}
.price {
  display: flex;
  justify-content: flex-end;
  margin-right: 10px;
  float: right;
  font-size: 15px;
}
.img {
  margin-left: 24px;
}
.container {
  display: flex;
  justify-content: space-evenly;
  width: 80%;
  padding: 20px;
}

.left-section {
  flex: 1;
}

.left-section h1 {
  font-size: 4em;
  font-weight: bold;
}

.right-section {
  flex: 1;
  display: flex;
  align-items: center;
}

.right-section p {
  font-size: 0.9em;
  color: #7a7a7a;
  line-height: 1.5em;
}
v-slide-group {
  .v-slide-group__next,
  .v-slide-group__prev {
    display: none !important;
  }
}
.button-hover {
  background-color: #b1aeae;
  color: white;
}

.button-hover:hover {
  background-color: black;
  color: white;
}
.exclusive-card {
  width: 450px;
  height: 340px;
  background-color: #f0f0f0;
  overflow: hidden;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
  margin: 10px;
  transition: background-color 0.5s ease-in-out;
  position: relative;
}
.exclusive-card2 {
  width: 580px;
  height: 340px;
  background-color: #60d8be;
  overflow: hidden;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
  margin: 10px;
  transition: background-color 0.5s ease-in-out;
  position: relative;
}
</style>
