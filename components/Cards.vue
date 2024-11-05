<template>
  <div class="car-card display-flex" :style="{ backgroundColor: car.backgroundColor }">
    <div class="mt-0">
      <v-carousel
        :value="activeSlide" 
        @input="updateSlide" 
        hide-delimiters
        :show-arrows="false"
        height="150px"
        cycle
        :interval="3000"
      >
        <v-carousel-item v-for="(image, index) in car.images" :key="index">
          <v-img :src="image" height="190px" class="car-image mb-16 custom-border-radius"></v-img>
        </v-carousel-item>
      </v-carousel>
    </div>

    <div class="overlay-container">
      <h2 class="mb-4">{{ car.name }}</h2>
      <div class="d-flex">
        <div class="float-left w-100">
          <div class="fonts pb-2 d-flex align-center justify-space-between">
            <span>To Add:</span>
            <span class="ml-4">{{ car.ToAdd }}</span>
          </div>
          <div class="fonts pb-2 d-flex align-center justify-space-between">
            <span>Minimum Rates:</span>
            <span class="ml-4"><AmountValue :amount="car.MinimumRates" /></span>
          </div>
          <div class="fonts pb-2 d-flex align-center justify-space-between">
            <span>No of Cars:</span>
            <span class="ml-4">{{ car.NumberofCars }}</span>
          </div>
        </div>
        <v-divider vertical class="mx-2"></v-divider>
        <div class="float-right w-100">
          <div class="fonts pb-2 d-flex align-center justify-space-between">
            <span>To Multiply:</span>
            <span class="ml-1">{{ car.ToMultiply }}</span>
          </div>
          <div class="fonts pb-2 d-flex align-center justify-space-between">
            <span>No of Bags:</span>
            <span class="ml-1">{{ car.NumberofBags }}</span>
          </div>
          <div class="fonts pb-2 d-flex align-center justify-space-between pb-3">
            <span>No of Passengers:</span>
            <span class="ml-1">{{ car.NumberofPassengers }}</span>
          </div>
        </div>
      </div>
      <div class="d-flex justify-space-between align-center mt-2 pb-0">
        <h4 class="car-price small-font">{{ car.price }}/<span class="letters">day</span></h4>
        <v-btn color="primary white-text" rounded class="fonts ml-3 custom-border radius small-text" small>Rent Now</v-btn>
      </div>
    </div>
  </div>
</template>

<script>
import AmountValue from '../components/shared/AmountValue.vue';

export default {
  name: 'Cards',
  components: {
    AmountValue,
  },
  props: {
    car: {
      type: Object,
      required: true
    },
    activeSlide: {
      type: Number,
      required: true
    }
  },
  methods: {
    updateSlide(newSlide) {
      // Emit the updated slide value to the parent component
      this.$emit('update:activeSlide', newSlide);
    },
    nextSlide() {
      let newSlide = this.activeSlide < this.car.images.length - 1 ? this.activeSlide + 1 : 0;
      this.$emit('update:activeSlide', newSlide);
    },
    startAutoNextSlide() {
      this.stopAutoNextSlide();
      this.autoNextInterval = setInterval(this.nextSlide, 1000);
    },
    stopAutoNextSlide() {
      clearInterval(this.autoNextInterval);
      this.autoNextInterval = null;
    }
  },
  mounted() {
    this.startAutoNextSlide();
  },
  beforeDestroy() {
    this.stopAutoNextSlide();
  }
};
</script>

<style scoped>
.car-card {
  position: relative;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 22px;
  background-color: #b1c1d3;
  transition: box-shadow 0.3s ease;
  max-width: 330px;
  max-height: 600px;
  overflow: hidden;
}

.letters {
  font-size: 11px;
  color: hsl(240 5.2% 33.9%);
}
.fonts {
  font-size: 12px;
}
.d-flex {
  display: flex;
  justify-content: space-between;
  width: 101%;
  margin-bottom: 4px;  
} 
</style>
