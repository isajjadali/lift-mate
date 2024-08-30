import { Rules } from '@/enums';

export default {
  data() {
    return {
      password: '',
      rules: {
        confirmPassword: [
          v => this.password === v || Rules.confirmPasswordMismatch,
        ],
      },
    };
  },
};
