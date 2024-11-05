<template>
  <div>
    <h1 class="text-center">Our Popular Car</h1>
    <v-container class="card-container pd-20">
      <v-row class="mt-7">
        <v-col v-for="(car, index) in cars" :key="index" cols="12" sm="6" md="4">
          <Cards
            :car="car"
            :activeSlide="activeSlide[car.name]"
            @update:activeSlide="(newSlide) => handleUpdateSlide(car.name, newSlide)" 
          />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import Cards from '../../components/Cards.vue';

export default {
  name: 'vehicles',
  components: {
    Cards,
  },
  data() {
    return {
      activeSlide: {},
      cars: [
        {
          name: 'Sedan',
          ToAdd: '375',
          ToMultiply: '12',
          MinimumRates: '573',
          NumberofCars: '1',
          NumberofBags: '15',
          NumberofPassengers: '24',
          images: ['/car1.png', '/car2.png', '/car3.png'],
          backgroundColor: '#ede8f5',
          price: '$110.00',
        },
        {
          name: 'Suv',
          ToAdd: '400',
          ToMultiply: '10',
          MinimumRates: '600',
          NumberofCars: '2',
          NumberofBags: '20',
          NumberofPassengers: '30',
          images: ['/car1.png', '/car2.png', '/car3.png'],
          backgroundColor: '#afdde5',
          price: '$120.00',
        },
        {
          name: 'Suv',
          ToAdd: '500',
          ToMultiply: '15',
          MinimumRates: '650',
          NumberofCars: '3',
          NumberofBags: '25',
          NumberofPassengers: '28',
          images: ['/car1.png', '/car2.png', '/car3.png'],
          backgroundColor: '#fbe9d0',
          price: '$140.00',
        },
      ]
    };
  },
  created() {
    this.cars.forEach(car => {
      this.activeSlide[car.name] = 0;
    });
  },
  methods: {
    handleUpdateSlide(carName, newSlide) {
      this.activeSlide[carName] = newSlide; // Update the active slide in the parent
    },
  },
};
</script>
