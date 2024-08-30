<template>
  <v-container fluid class="static-page-editor">
    <custom-loader-static-page-editor-loader v-if="isLoading" />
    <v-row v-else>
      <v-col cols="12" sm="4" md="3" lg="3" xl="2">
        <v-card rounded="lg" min-height="268">
          <v-container>
            <h3>Static Pages</h3>
            <shared-custom-btn
              v-if="hasPermission(PERMISSIONS.staticPageEditorCreate)"
              id="add-btn-static-page"
              class="mt-5"
              color="primary"
              block
              @click="isCreateModalOpen = true"
            >
              +Add
            </shared-custom-btn>
            <div class="mt-8">
              <shared-custom-field
                id="static-page-search-field"
                v-model="search"
                placeholder="Search"
                prepend-inner-icon="mdi-magnify"
                clearable
                @keyup="onChange()"
                @click:clear="onClear()"
              />
            </div>
            <v-list nav mandatory density="compact" class="overflow-x-hidden overflow-y-auto">
              <v-list-item
                v-for="(page, i) in filterPages"
                :key="i"
                color="primary"
                @click="() => onPageChange(page, i)"
              >
                <v-list-item-title v-text="page.title" />
                <v-list-item-action>
                  <v-switch
                    v-model="page.isActive"
                    color="primary"
                    inset
                    hide-details
                    @update:modelValue="(e) => onToggleActive(e, page)"
                  />
                </v-list-item-action>
              </v-list-item>
            </v-list>
          </v-container>
        </v-card>
      </v-col>
      <v-col cols="12" sm="8" md="9" lg="9" xl="10">
        <v-card
          rounded="lg"
          :height="`calc(100vh - ${$vuetify.display.xs ? '30' : '90'}px)`"
        >
          <v-form v-model="valid">
            <v-container class="pa-8">
              <v-row>
                <v-col cols="12" sm="6" md="6" lg="6" class="pb-0">
                  <shared-custom-field
                    id="static-page-title-field"
                    v-model="selectedPage.title"
                    label="Title"
                    required
                  />
                </v-col>
                <v-col
                  :class="$vuetify.display.xs ? 'text-center' : 'text-right'"
                  :cols="$vuetify.display.xs ? 12 : 0"
                >
                  <shared-custom-btn
                    id="static-page-preview-btn"
                    class="mr-3 primary"
                    :href="previewUrl"
                    target="_blank"
                  >
                    Preview
                  </shared-custom-btn>
                </v-col>
              </v-row>
              <v-row class="mt-0">
                <v-col>
                  <shared-custom-ck-editor
                    id="ck-editor-for-static-page"
                    v-model="selectedPage.content"
                    class="ckEditor"
                  />
                </v-col>
              </v-row>
              <v-row class="mt-0">
                <v-col class="text-right">
                  <shared-custom-btn
                    id="static-page-update-btn"
                    class="mr-3 primary"
                    :loading="isUpdating"
                    :disabled="shouldDisableUpdateBtn"
                    @click="update(selectedPage.id)"
                  >
                    Update
                  </shared-custom-btn>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
    <create-update-modal
      v-if="isCreateModalOpen"
      :open="isCreateModalOpen"
      :fields-config="fieldsConfig"
      :loading="isRecordAdding"
      title="Page"
      @close="
        () => {
          isCreateModalOpen = false;
          isRecordAdding = false;
        }
      "
      @onSubmit="onSubmit"
    />
  </v-container>
</template>

<script>
import Service from "@/services/index";
import { RoutesConfig, PERMISSIONS } from "@/enums";
import _ from "lodash";

export default {
  name: "StaticPageEditor",
  data: () => ({
    valid: false,
    isLoading: true,
    isUpdating: false,
    selectedPage: {},
    selectedPagePreviousCopy: {},
    service: {},
    search: "",
    pages: [],
    filterPages: [],
    isCreateModalOpen: false,
    isRecordAdding: false,
    fieldsConfig: [
      {
        id: "Title",
        vModel: "title",
        label: "Title",
        sm: 12,
        cols: 12,
        required: true,
      },
    ],
    PERMISSIONS,
  }),
  computed: {
    previewUrl() {
      return `page/${_.kebabCase(this.selectedPage.title)}`;
    },
    shouldDisableUpdateBtn() {
      return (
        !this.valid ||
        !this.selectedPage.content ||
        ["title", "content"].every(
          (key) => this.selectedPage[key] === this.selectedPagePreviousCopy[key]
        )
      );
    },
  },
  async created() {
    this.service = new Service(RoutesConfig.staticPageEditor.path);
    this.isLoading = true;
    await this.fetch();
    this.isLoading = false;
  },
  methods: {
    async onSubmit(payload) {
      this.isRecordAdding = true;
      await this.$store.createPage(payload);
      await this.$store.fetchStaticPages();
      this.fetch();
      this.isRecordAdding = false;
      this.isCreateModalOpen = false;
    },
    async deletePage(id) {
      await this.deletingPage(id);
      await this.$store.getPages();
    },
    async fetch() {
      this.pages = this.getStaticPages();
      this.filterPages = [...this.pages];
      this.selectedPage = this.selectedPage.id
        ? this.selectedPage
        : { ...this.pages[0] };
    },
    getStaticPages() {
      const value = this.$localStorage.getItem("staticPages");
      if (!value) return [];
      return JSON.parse(value);
    },
    async update() {
      this.isUpdating = true;
      const updatedPage = await this.service.update(
        this.selectedPage.id,
        this.selectedPage
      );
      this.$toast.success(
        `${_.startCase(
          this.selectedPage.title
        )} page has been updated successfully!`
      );
      await this.$store.fetchStaticPages();
      await this.$store.getPages();
      this.fetch();
      this.selectedPagePreviousCopy = _.cloneDeep(updatedPage.data);
      this.isUpdating = false;
    },
    onChange() {
      if (!this.search) {
        return (this.filterPages = [...this.pages]);
      }
      this.filterPages = this.pages.filter((page) =>
        page.title.toLowerCase().includes(this.search)
      );
    },
    async onToggleActive(isActive, page) {
      this.selectedPage = page;
      await this.service.update(this.selectedPage.id, this.selectedPage);
      this.$toast.success(
        `${_.startCase(this.selectedPage.title)} page has been ${
          isActive ? "published" : "unpublished"
        } successfully!`
      );
      await this.$store.fetchStaticPages();
      await this.$store.getPages();
      this.fetch();
    },
    onClear() {
      this.search = "";
      this.filterPages = [...this.pages];
    },
    onPageChange(page, index) {
      this.selectedPage = { ...page };
      this.selectedPagePreviousCopy = _.cloneDeep(this.pages[index]);
    },
  },
};
</script>

<style lang="scss">
.static-page-editor {
  padding-left: 5% !important;
  padding-right: 5% !important;

  .ck-content {
    height: calc(100vh - 350px) !important;
    color: black !important;
  }
}
</style>
