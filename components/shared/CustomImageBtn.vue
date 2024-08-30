<template>
  <div>
    <shared-custom-btn
      id="custom-auth-btn"
      ref="imageBtn"
      color="primary"
      class="ma-1"
      v-bind="$attrs"
      @click="open = true"
    >
      {{ label }}
    </shared-custom-btn>
    <v-dialog
      v-model="open"
      max-width="800px"
      height="500px"
    >
      <v-card>
        <v-toolbar
          color="primary"
          dark
        >
          <v-toolbar-title>
            {{ item.type }}
          </v-toolbar-title>
          <template v-slot:append>
            <v-btn
              icon
              @click="open = false"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </template>
        </v-toolbar>
        <v-form v-model="open">
          <v-card-text class="py-5">
            <shared-custom-loading
              v-if="loading"
              type="image"
            />
            <div
              class="d-flex align-center justify-center fill-height"
            >
              <v-img
                v-show="!isUploadingImage"
                :src="`${imageUrl}`"
                :max-height="$vuetify.display.xs ? '' : '500px'"
                :max-width="$vuetify.display.xs ? '' : '800px'"
                contain
                @load="loading = false"
                @loadstart="this.loading = true"
                @error="onError"
              />
            </div>
            <!-- <div class="d-flex justify-center align-center">
            </div> -->
            <v-divider v-if="showBtn" />
          </v-card-text>
          <v-card-actions v-if="showBtn">
            <v-container>
              <v-row class="align-center">
                <v-col
                  cols="12"
                  sm="10"
                  class="py-0 px-5"
                >
                  <shared-custom-upload-field
                    ref="customUpload"
                    v-model="file"
                    show-size
                    label="File input"
                    accept=".png,.jpeg,.jpg"
                    @update:modelValue="(e) => (selectedImage = e)"
                  />
                </v-col>
                <v-col
                  cols="12"
                  sm="2"
                  class="mt-1 py-0 px-5 text-center"
                >
                  <shared-custom-btn
                    id="upload"
                    color="primary"
                    variant="elevated"
                    :disabled="!isfilled || loading"
                    @click="onUpload"
                  >
                    Upload
                  </shared-custom-btn>
                </v-col>
              </v-row>
              <!-- <v-row class="text-center">
                <v-col class="text-error">
                  <strong v-if="uploadField">Note: Picture size of car should be 120px * 150px</strong>
                </v-col>
              </v-row> -->
            </v-container>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  export default {
    name: 'CustomAuthBtn',
    props: {
      label: {
        type: String,
        default: 'Submit',
      },
      item: {
        type: Object,
        default: () => {},
      },
      showBtn: {
        type: Boolean,
        default: true,
      },
    },
    data() {
      return {
        open: false,
        file: null,
        selectedImage: null,
        imageUrl: null,
        loading: false,
        isfilled: false,
        isUploadingImage: false,
      };
    },
    watch: {
      async open(newValue) {
        if (newValue) {
          this.loading = true;
          this.imageUrl = this.item.imageUrl;
        } else {
          this.imageUrl = '';
          this.loading = false;
        }
      },
      async selectedImage(newValue) {
        if (newValue) {
          this.isfilled = true;
        } else {
          if (this.selectedImage === null) {
            this.isfilled = false;
          }
        }
      },
    },
    methods: {
      async onUpload() {
        this.loading = true;
        this.isUploadingImage = true;
        this.imageUrl = '';
        const formData = new FormData();
        formData.append('image', this.selectedImage);
        const response = await this.$axios.post(
          `/cars/update-image/${this.item.id}`,
          formData,
          { params: { awsObjectKey: this.item.awsObjectKey } }
        );
        this.$emit('onUpload');
        this.isUploadingImage = false;
        this.file = null;
        this.selectedImage = null;
        this.imageUrl = response.data.imageUrl || response.imageUrl;
        this.isfilled = false;
      },
      onError() {
        this.imageUrl = `${this.$config.public.s3Url}/no-image.jpg`;
      },
    },
  };
</script>
