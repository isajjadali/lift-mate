<template>
    <v-container>
      <v-row>
    <v-col cols="12" class="d-flex justify-center align-center">
      <h2>Questions? Get in Touch</h2>
    </v-col>
  </v-row>
  
      <v-row class="py-10 my-10 container">
        
        <!-- Form Section -->
  
        <v-col cols="12" md="8" class="pa-0">
          <v-row class="ma-2 pa-0">
  
            <!-- Name field -->
  
            <v-col cols="12" sm="6" class="py-0 my-0 pa-3">
              <v-text-field
                v-model="name"
                label="Name"
                required
                variant="solo"
                rounded="lg"
              ></v-text-field>
            </v-col>
  
            <!-- Email field -->
  
            <v-col cols="12" sm="6" class="py-0 my-0 pa-3">
              <v-text-field
                v-model="email"
                label="Email"
                required  
                variant="solo"
                rounded="lg"
              ></v-text-field>
            </v-col>
  
            <!-- Subject field -->
  
            <v-col cols="12" class="py-0 my-0 pa-3">
              <v-text-field
                v-model="subject"
                label="Subject"
                required
                variant="solo"
                rounded="lg"
              ></v-text-field>
            </v-col>
  
            <!-- Message field -->
  
            <v-col cols="12" class="py-0 my-0 pa-3">
              <v-textarea
                v-model="message"
                label="How can we help you?"
                required
                variant="solo"
                rounded="lg"
              ></v-textarea>
            </v-col>
  
            <!-- Submit button -->
  
            <v-col cols="12" class="py-0 my-0 pa-3">
              <v-btn @click="sendMessage" color="black" rounded="lg">Send Message</v-btn>
            </v-col>
          </v-row>
        </v-col>
  
        <!-- Contact Information Section -->
         
        <v-col cols="12" md="4" class="contact-card">
          <v-row style="height: 100%;">
            <v-col cols="12" style="margin-left: 20px;">
              <h3>Address</h3>
              <p>Gari Shahu<br>Lahore, Pakistan</p>
            </v-col>
  
            <v-col cols="12" style="margin-left: 20px;">
              <h3>Phone</h3>
              <p>03094501187</p>
            </v-col>
  
            <v-col cols="12" style="margin-left: 20px;">
              <h3>Hours</h3>
              <p>Mon-Fri: 8am - 5pm</p>
            </v-col>
  
            <v-col cols="12" class="text-center">
              <div class="text-center social-section d-flex justify-start">
                <a href="https://www.facebook.com/share/jR4XuurGdGZEfJsE/?mibextid=LQQJ4d" target="_blank" rel="noopener noreferrer" style="text-decoration: none;">
                  <v-icon style="font-size: 2rem; margin-left: 10px; color: white;">mdi-facebook</v-icon>
                </a>
                <span style="margin-left: 10px;" class="pa-1">Facebook</span>
              </div>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script>
  import emailjs from 'emailjs-com';
  
  export default {
    name: 'ContactForm',
    data() {
      return {
        name: '',
        email: '',
        subject: '',
        message: '',
      };
    },
    methods: {
      sendMessage() {
        if (!this.name || !this.email || !this.subject || !this.message) {
          alert('Please fill out all fields before sending the message.');
          return;
        }
  
        const serviceID = 'service_v86kosz'; 
        const templateID = 'template_gnsl7zs';  
        const userID = 'XevxtJzKnbspld8oC';  
        const templateParams = {
          from_name: this.name,
          from_email: this.email,
          subject: this.subject,
          message: this.message,
        };
  
        emailjs
          .send(serviceID, templateID, templateParams, userID)
          .then(
            (response) => {
              alert('Message sent successfully!');
              this.name = '';
              this.email = '';
              this.subject = '';
              this.message = '';
            },
            (error) => {
              console.error('Error sending email:', error);
              alert('Error sending message.');
            }
          );
      },
    },
  };
  </script>
  
  <style scoped>
  .contact-card {
    background-color: #326c80;
    color: white;
    border-radius: 12px;
    padding: 10px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    min-height: 410px;  
    max-width: 400px;   
    margin: center;      
  }
  
  .container {
    background-color: #e0f7fa;
    border-radius: 20px;
    padding: 20px;
  }
  
  .social-section {
    margin-top: auto;
    margin-bottom: auto;
  }
  </style>