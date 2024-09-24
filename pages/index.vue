<template>
  <section class="header-section">
    <!-- Logo Section with Lift Mate Title -->
    <div class="logo-title">
      <!-- <img src="/images/logo.png" alt="Logo" class="logo" />
      <h1>Lift Mate</h1> -->
    </div>

    <!-- Car Brand Logos -->
    <div class="car-brands">
      <img v-for="(logo, index) in carBrandLogos" :key="index" :src="logo.src" :alt="logo.alt" class="car-logo" />
    </div>

    <!-- Fleet Cars Section -->
    <div class="fleet-section">
      <h2>Our Fleet SUVs</h2>
      <div class="fleet-cards">
        <div v-for="(car, index) in fleetCars" :key="index" class="fleet-card">
          <h3>{{ car.name }}</h3>
          <img :src="car.image" :alt="car.name" class="fleet-car" />
          <div class="fleet-info">
            <div class="info-left">
              <p>
                <img src="/images/seat-icon.png" alt="Seats" class="icon seat-icon" />
                <span>{{ car.seats }} </span> |
                <img src="/images/gear-icon.png" alt="Manual" class="icon gear-icon" />
                <span>{{ car.gear }}</span>
              </p>
            </div>
            <div class="info-right">
              <p class="price">{{ car.price }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Calendar Section -->
      <div class="calendar-section">
        <button class="open-models-btn">Open All Models</button>
        <h3>Select Date</h3>
        <input type="date" v-model="selectedDate" class="calendar-input" />
        <p class="selected-date">Selected Date: {{ selectedDate }}</p>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "HomePage",
  data() {
    return {
      selectedDate: '', // Stores the selected date from the calendar
      carBrandLogos: [
        { src: '/images/tesla-logo.png', alt: 'Tesla' },
        { src: '/images/mercedes-logo.png', alt: 'Mercedes' },
        { src: '/images/audi-logo.png', alt: 'Audi' },
        { src: '/images/honda-logo.png', alt: 'Honda' },
        { src: '/images/lexus-logo.png', alt: 'Lexus' },
      ],
      fleetCars: [
        { name: 'Range Rover Sport', image: '/images/range-rover.png', seats: 5, gear: 'Manual', price: '$480/day' },
        { name: 'Cadillac Escalade', image: '/images/cadillac.png', seats: 5, gear: 'Manual', price: '$480/day' },
        { name: 'Jeep Grand Cherokee', image: '/images/jeep.png', seats: 6, gear: 'Manual', price: '$480/day' },
        { name: 'BMW M4 Convertible', image: '/images/bmw.png', seats: 5, gear: 'Manual', price: '$480/day' },
      ],
    };
  },
};
</script>

<style scoped>
.header-section {
  text-align: center;
}

.logo-title {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}

.logo {
  width: 40px;
  height: auto;
  margin-right: 10px;
}

.car-brands {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 40px; /* Space between logos */
  background-color: rgb(42, 41, 41);
  padding: 5px;
  border-radius: 5px;
}

.car-logo {
  width: 40px;
  height: auto;
}
.car-logo:hover {
  transform: scale(1.5); /* Zoom effect */
}

.car-brands img {
  filter: brightness(0) invert(0.75); /* Ensures logos are white */
}

/* Fleet section styles */
.fleet-section {
  margin-top: 40px;
}

.fleet-section h2 {
  font-size: 2rem;
  margin-bottom: 20px;
}

.fleet-cards {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.fleet-card {
  background-color: #f9f9f9;
  border-radius: 10px;
  padding: 15px;
  width: 250px;
  text-align: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease; /* Add transition for smooth animation */
}

.fleet-card:hover {
  transform: scale(1.1) translateY(-10px); /* Zoom and slide up */
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2); /* Enhanced shadow on hover */
}

.fleet-car {
  width: 100%;
  height: auto;
  border-radius: 10px;
}

.fleet-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
}

.info-left {
  text-align: left;
}

.info-right {
  text-align: right;
}

.fleet-info h3 {
  font-size: 1.2rem;
  margin-bottom: 10px;
}

.fleet-info p {
  margin: 5px 0;
  color: #000000;
  font-size: 0.9rem; /* Smaller font size */
}

.icon {
  width: 16px; /* Adjust size of icons */
  margin-right: 5px;
  vertical-align: middle; /* Align icon with text */
  filter: invert(0.75) brightness(0.9); /* Default icon color */
}

.seat-icon {
  filter: invert(0.75) brightness(0.9); /* Match color of the button */
}

.gear-icon {
  filter: invert(0.75) brightness(0.9); /* Match color of the button */
}

.price {
  font-weight: bold;
  color: #000000;
  font-size: 0.9rem; /* Smaller font size for price */
}

.open-models-btn {
  background-color: #186561;
  color: rgb(255, 255, 255);
  font-weight: bold;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  margin-top: 20px;
  cursor: pointer;
}

.open-models-btn:hover {
  background-color: #083c38;
}

/* Calendar section styles */
.calendar-section {
  margin-top: 20px;
}

.calendar-section h3 {
  font-size: 1.5rem;
  margin-bottom: 10px;
}

.calendar-input {
  padding: 8px 12px;
  font-size: 1rem;
  border-radius: 8px;
  border: 1px solid #ccc;
  outline: none;
  transition: box-shadow 0.3s ease;
}

.calendar-input:focus {
  box-shadow: 0 0 10px rgba(0, 123, 255, 0.5); /* Attractive shadow effect */
}

.selected-date {
  margin-top: 10px;
  font-size: 1rem;
  color: #333;
}
</style>
