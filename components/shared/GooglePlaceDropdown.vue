<template>
  <shared-custom-autocomplete
    id="google-search"
    v-model="inputVal"
    :items="results"
    v-bind="$attrs"
    item-title="description"
    return-object
    @keydown="onSearch"
    @update:modelValue="onSelect"
  />
</template>

<script>
export default {
    name: 'GooglePlaceDropdown',
    metaInfo() {
        return {
            script: [
                // {
                //     src: `https://maps.googleapis.com/maps/api/js?key=${process.env.VUE_APP_GOOGLE_PLACE_API_KEY}&libraries=places`,
                //     async: true,
                //     defer: true,
                //     callback: () => this.initMaps(), // will declare it in methods
                // },
            ],
        };
    },
    props: {
        value: {
            type: [String, Object],
            default: '',
        },
    },
    data() {
        return {
            googleApiService: '',
            results: [],
            predictions: [],
        };
    },
    computed: {
        inputVal: {
            get() {
                return this.value;
            },
            set(val) {
                this.$emit('input', val);
            },
        },
    },
    watch: {
        inputVal(newValue) {
            if (newValue) {
                this.setResults();
            }
        },
    },
    created() {
        if (this.inputVal) {
            this.setResults();
        }
    },
    methods: {
        setResults() {
            if (!Array.isArray(this.inputVal)) {
                this.results = [{ description: this.inputVal }];
            }
        },
        initMaps() {
            this.googleApiService =
        new window.google.maps.places.AutocompleteService();
        },
        setSearchResults(predictions, status) {
            if (status !== window.google.maps.places.PlacesServiceStatus.OK) {
                this.results = [];
                return;
            }
            this.predictions = predictions;
            this.results = predictions.map((prediction) => prediction.description);
        },
        async onSearch(e) {
            if (!this.googleApiService) {
                this.initMaps();
            }
            setTimeout(() => {
                this.googleApiService.getPlacePredictions(
                    {
                        input: e.target.value,
                        types: [],
                        componentRestrictions: { country: 'us' },
                        // types: ['(cities)'],
                    },
                    this.setSearchResults
                );
            }, 0);
        },
        async onSelect(selectedPlace = {}) {
            const placeId = this.predictions.find(
                (p) => p.description === selectedPlace?.description || selectedPlace
            )?.place_id;

            if (placeId) {
                const postalCode = await this.getPlacesPostCodeById(placeId);

                if (
                    !(selectedPlace?.description || selectedPlace).includes(postalCode)
                ) {
                    selectedPlace = `${
                        selectedPlace?.description || selectedPlace
                    }, ${postalCode}`;
                }
            }

            this.inputVal =
        typeof selectedPlace === 'string'
            ? selectedPlace
            : selectedPlace?.description;
            this.$emit('select', selectedPlace);
        },
        async getPlacesPostCodeById(placeId) {
            return new Promise((resolve, reject) => {
                if (!placeId) reject('placeId not provided');

                try {
                    new window.google.maps.places.PlacesService(
                        document.createElement('div')
                    ).getDetails(
                        {
                            placeId,
                            fields: ['address_components'],
                        },
                        (details) => {
                            let postcode = null;
                            details?.address_components?.forEach((entry) => {
                                if (entry.types?.[0] === 'postal_code') {
                                    postcode = entry.long_name;
                                }
                            });
                            return resolve(postcode);
                        }
                    );
                } catch (e) {
                    reject(e);
                }
            });
        },
    },
};
</script>
