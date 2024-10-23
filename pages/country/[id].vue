<template lang="pug">
.d-flex.country.flex-column
  h2.country__title.mb-3.pl-3 Country Holidays for {{ countryName }}
  .d-flex.flex-column.country__wrap  
    v-list.country__list.pb-3.mb-3
      v-list-item.country__item.d-flex.flex-column.pa-5(v-for="(holiday, index) in holidays" :key="index")
        v-list-item-title.country__item-info.pb-1 Holiday: &nbsp {{ holiday.name }}
        v-list-item-title.country__item-info.pb-1 Holiday Info: &nbsp {{ holiday.localName }}
        v-list-item-title.country__item-info.pb-1 Date: &nbsp {{ holiday.date }}
    .country__year-buttons.d-flex.justify-center
      button.year-button(v-for="year in years" :key="year" @click="selectYear(year)" :class="{ active: selectedYear === year }") {{ year }}    
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useRoute } from 'vue-router'

const holidays = ref([])
const countryName = ref("")
const route = useRoute()
const selectedYear = ref(new Date().getFullYear());
const years = ref([2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030]);

const fetchCountryHolidays = async (countryCode, year) => {
  try {
    const response = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${year}/${countryCode}`)
    const data = await response.json()
    holidays.value = data
  } catch (error) {
    console.error("Error", error)
  }
}

onMounted(() => {
  const countryCode = route.params.id
  countryName.value = countryCode
  fetchCountryHolidays(countryCode, selectedYear.value)
})

const selectYear = (year) => {
  selectedYear.value = year
  const countryCode = route.params.id
  fetchCountryHolidays(countryCode, year)
}

</script>

<style lang="scss">
.country {
  &__title {
    background-color: rgb(19, 99, 105);
    font-size: 24px;
    text-align: center;
  }

  &__list {
    padding: 0;
    min-width: 400px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 15px;
    background-color: #D9D9D9;
  }

  &__item {
    justify-content: center;
    align-items: flex-start;
    border-radius: 5px !important;
    max-width: 600px;
    width: 100%;
    background-color: rgb(19, 99, 105);
    

    .v-list-item__content {
      justify-content: center;
      align-self: flex-start !important;
      color: black;
    }
  }

  &__year-buttons {
    margin-bottom: 20px;
    display: flex;
    flex-wrap: wrap;
    gap: 10px;

    .year-button {
      padding: 5px 10px;
      border: none;
      background-color: gray;
      border-radius: 5px;
      cursor: pointer;

      &:hover {
        background-color: #0b5a57;
      }

      &:focus {
        background-color: #118183;
        font-weight: bold;
      }

      &.active {
        background-color: #118183;
        font-weight: bold;
      }
    }
  }
}
</style>