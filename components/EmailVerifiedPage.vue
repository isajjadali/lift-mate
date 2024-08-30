<template>
  <v-container align="center">
    <v-row v-if="!isTokenVerified">
      <v-col
        cols="12"
        sm="12"
      >
        <v-card
          rounded="lg"
          min-height="268"
          class="d-flex justify-center align-center"
        >
          <h3>Sorry, link has expired!</h3>
        </v-card>
      </v-col>
    </v-row>
    <v-row
      v-else
      justify="center"
    >
      <v-col
        cols="12"
        sm="10"
      >
        <v-card
          rounded="lg"
          min-height="268"
          class="d-flex justify-center align-center"
        >
          <h3>Email verified successfully!</h3>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>


<script>
import UserService from '@/services/user';
import UserMixin from '@/mixins/user-mixin';
import { Messages, RoutesConfig } from '@/enums';

export default {
    name: 'EmailVerifiedPage',
    components: {},
    mixins: [UserMixin],
    data() {
        return {
            isTokenVerified: false,
            token: '',
        };
    },
    created() {
        this.token = this.$route.query.token;
        if (!this.token) {
            return (this.isTokenVerified = false);
        }
        this.verifyTokenInParams();
    },
    methods: {
        async verifyTokenInParams() {
            try {
                await UserService.verifyToken({ token: this.token });
                this.isTokenVerified = true;
                await UserService.verifyEmail({
                    token: this.token,
                });
                this.$toast.success(Messages.success.emailVerifiedSuccessfully);
            } catch (e) {
                this.isTokenVerified = false;
            }
        },
    },
};
</script>
