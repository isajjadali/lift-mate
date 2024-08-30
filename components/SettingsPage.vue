<template>
  <nuxt-layout>
    <v-container
      fluid
      :class="$vuetify.display.smAndDown ? '' : 'px-12'"
    >
      <v-row>
        <v-col
          cols="12"
          sm="4"
          md="3"
          lg="2"
          xl="2"
        >
          <v-card class="mx-auto">
            <v-card-title class="justify-center text-center">
              <div>Settings</div>
            </v-card-title>
            <v-card-text>
              <v-list dense v-for="(item, i) in listItems" :key="i">
                <!-- <template v-if="(item.children || []).length">
                  <v-list-subheader class="text-capitalize">
                    <div class="text-capitalize">
                      {{item.title}}
                    </div>
                  </v-list-subheader>
                  <v-list-item
                    v-for="childItem, j in item.children"
                    :key="j"
                    :to="childItem.path"
                    link
                  >
                    <v-list-item-title>
                      {{ childItem.title }}
                    </v-list-item-title>
                    <v-icon small v-if="childItem.icon">
                      {{ childItem.icon }}
                    </v-icon>
                </v-list-item>
                </template> -->
                <v-list-group
                  v-if="(item.children || []).length"
                  :key="i"
                  :value="true"
                >
                  <template #activator="{ props }">
                    <v-list-item v-bind="props">
                      <div class="text-capitalize">
                        {{ item.title }}
                      </div>
                    </v-list-item>
                  </template>
                  <v-list-item
                    v-for="(childItem, j) in item.children"
                    :key="j"
                    :to="childItem.path"
                    link
                  >
                    <v-list-item-title class="text-capitalize">
                      {{ childItem.title }}
                    </v-list-item-title>
                    <v-icon small v-if="childItem.icon">
                      {{ childItem.icon }}
                    </v-icon>
                  </v-list-item>
                </v-list-group>
                <v-list-item
                  v-else
                  :to="item.path"
                  link
                >
                  <v-list-item-title class="text-capitalize">
                    {{ item.title }}
                  </v-list-item-title>
                  <v-icon  v-if="item.icon" small>
                    {{ item.icon }}
                  </v-icon>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col
          cols="12"
          sm="8"
          md="9"
          lg="10"
          xl="10"
        >
          <nuxt-page :page-key="route => route.fullPath" />
        </v-col>
      </v-row>
    </v-container>
  </nuxt-layout>
</template>
<script>
import { RoutesConfig } from '@/enums';
import { PERMISSIONS } from '@/enums';
export default {
    name: 'SettingsPage',
    components: {},
    data() {
        return {
            RoutesConfig,
        };
    },
    computed: {
        listItems() {
            const items = [
                {
                    title: 'Admin',
                    icon: '',
                    children: [
                        {
                            title: 'Roles',
                            path: RoutesConfig.settings.children.roles.path,
                            permission: PERMISSIONS.rolesView,
                        },
                        {
                            title: 'Permissions',
                            path: RoutesConfig.settings.children.permissions.path,
                            permission: PERMISSIONS.permissionsView,
                        },
                        {
                            title: 'Users',
                            path: RoutesConfig.settings.children.usersWithRoles.path,
                            permission: PERMISSIONS.userRolesView,
                        },
                    ],
                },
                {
                    title: 'Configurations',
                    path: RoutesConfig.settings.children.configurations.path,
                    permission: PERMISSIONS.configurationsView,
                    icon: '',
                },
            ];

            items.forEach((item) =>
                this.setSettingsPath(item.children ? item.children : item)
            );
            let list = items.map((item) => {
                if (item.children) {
                    let children = item.children.filter((i) =>
                        i.permission ? this.hasPermission(i.permission) : true
                    );
                    return {
                        ...item,
                        children,
                    };
                }
                if (item.permission)
                    if (this.hasPermission(item.permission)) {
                        return item;
                    }
            });
            list = list.filter((li) => (li.children ? li.children.length : true));
            return list;
        },
    },
    methods: {
        setSettingsPath(items = []) {
            if (!Array.isArray(items)) {
                items = [items];
            }
            items.forEach((item) => {
                if (item.path) {
                    item.path = `/settings/${item.path}`;
                }
            });
        },
    },
};
</script>
<style scoped>
.routerLink {
  text-decoration: none;
}
</style>
