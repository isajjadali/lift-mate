<template>
  <v-skeleton-loader
    class="pa-5"
    :type="getLoaderTemplate()"
  />
</template>

<script>
export default {
    name: 'CustomLoading',
    props: {
        type: {
            type: String,
            default: 'staticPage',
        },
    },
    methods: {
        getLoaderTemplate() {
            let template = '';
            switch (this.type) {
            case 'staticPage':
                template = `article, ${Array(4)
                    .fill('list-item-three-line')
                    .join(', ')}`;
                break;
            case 'sidebar':
                template = 'article, list-item-three-line, list-item-three-line';
                break;
            case 'profileSidebar':
                template = 'avatar, list-item-three-line, list-item-three-line';
                break;
            case 'profileInfo':
                template =
                        'heading, list-item-three-line, list-item-three-line, list-item-three-line, list-item-three-line, actions';
                break;
            case 'createReservation':
                template =
                        'actions, list-item-three-line, image,  image, list-item-three-line, list-item-three-line, list-item-three-line, actions';
                break;
            case 'createReservationRightSideBar':
                template = 'image, list-item-three-line, list-item-three-line';
                break;
            case 'updateReservation':
                template = 'list-item-three-line,list-item-three-line,list-item-three-line,list-item-three-line,actions';
                break;
            case 'ck-editor':
                template = 'article, article, image, image, image';
                break;
            case 'image':
                template = 'image, image';
                break;
            case 'reservationDetailPage':
                template = 'actions,list-item-three-line,list-item-three-line,list-item-three-line';
                break;
            case 'reservationDetailPageDataTable':
                template = 'heading,table-row-divider@4';
                break;
            case 'reservationDetailPageRightSideBar':
                template = 'list-item-three-line,image,list-item-three-line';
                break;

            }
            return template;
        },
    },
};
</script>
