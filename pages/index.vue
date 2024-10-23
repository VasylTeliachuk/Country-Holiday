<template lang="pug">
.d-flex.countries.px-15
  .d-flex.flex-column.countries__search-wrap
    v-text-field.countries__search.pt-10.mb-16(label="Search country" variant="outlined" hide-details type="search" v-model="searchCountry" clearable)
    span.countries__info.mb-3.pl-3 Countries List:
    v-list.countries__list
      router-link.countries__link( :to="getLink(country.countryCode)" v-for="country in filteredCountries" :key="country.name" v-if="filteredCountries.length > 0")
        v-list-item
          v-list-item-title {{ country.name }}
      v-list-item(v-else)
        v-list-item-title No matches found
  .d-flex.flex-column.countries__widget  
    span.countries__info.mb-3.pl-3 Countries Widget:
    v-list.countries__widget-list.pb-3
      v-list-item.countries__widget-item.d-flex.flex-column.pa-5(v-for="(country, index) in selectedCountries" :key="country.name")
        v-list-item-title.countries__widget-item-info.pb-1 Country: &nbsp {{ country.name }}
        v-list-item-title.countries__widget-item-info.pb-1 Holiday: &nbsp {{ holidays[index] }}
        v-list-item-title.countries__widget-item-info.pb-1 Date: &nbsp {{ dates[index] }}     
</template>

<script setup>
import { ref, onMounted, computed } from "vue"
import { countryRoutes } from '~/routes'

definePageMeta({
  layout: 'default',
})

const countries = ref([])
const searchCountry = ref("")

const selectedCountries = ref([])
const holidays = ref([])
const dates = ref([])

const getLink = (id) => {
  return countryRoutes.countryPath(id)
};

const fetchCountries = async () => {
  try {
    const response = await fetch('https://date.nager.at/api/v3/AvailableCountries')
    const data = await response.json()
    countries.value = data 

    if (countries.value.length >= 4) {
      selectCountries(countries.value.slice(0, 4))
    }
  } catch (error) {
    console.error("Error", error)
  }
}

const fetchHoliday = async (countryCode) => {
  try {
    const today = new Date()
    const year = today.getFullYear()
    const response = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${year}/${countryCode}`)
    const holidays = await response.json()
    const sortedHolidays = holidays.sort((a, b) => new Date(a.date) - new Date(b.date))
    const nextHoliday = sortedHolidays.find(holiday => new Date(holiday.date) >= today)
    
    if (nextHoliday) {
      return {
        holiday: nextHoliday.name || nextHoliday.localName,
        date: nextHoliday.date
      }
    } else {
      return {
        holiday: "No upcoming public holidays this year",
        date: ""
      }
    }
  } catch (error) {
    console.error("Error fetching holidays:", error)
    return {
      holiday: "No upcoming public holidays this year",
      date: ""
    }
  }
}

const selectCountries = async (countriesArray) => {
  selectedCountries.value = countriesArray
  holidays.value = []
  dates.value = []

  for (const country of countriesArray) {
    const result = await fetchHoliday(country.countryCode)
    holidays.value.push(result.holiday)
    dates.value.push(result.date)
  }
}

onMounted(() => {
  fetchCountries()
})

const filteredCountries = computed(() => {
  if (!searchCountry.value) {
    return countries.value
  }
  const setSearchCountry = searchCountry.value.toLowerCase()
  return countries.value.filter(country =>
    country.name.toLowerCase().includes(setSearchCountry)
  )
})
</script>

<style lang="scss">
.countries {
  background-color: #D9D9D9;
  gap: 100px;
  &__search-wrap {
    max-width: 350px;
    width: 100%;
  }

  &__search {
    max-width: 350px;
    max-height: 64px;
  }

  &__info {
    background-color: gray;
    font-size: 24px;
    border-radius: 5px;
  }

  &__list {
    max-width: 350px;
    padding: 0px;
    background-color: gray;
    border-radius: 5px !important;
  }

  &__link {
    text-decoration: none;
    color: black;
  }

  &__widget {
    padding-top: 128px;
    max-width: 500px;
    width: 100%;
  } 

  &__widget-list {
    padding: 0;
    min-width: 400px;
    max-height: 800px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 15px;
    background-color: #D9D9D9;
  }

  &__widget-item {
    justify-content: center;
    align-items: flex-start;
    border-radius: 5px !important;
    background-color: gray;
    

    .v-list-item__content {
      justify-content: center;
      align-self: flex-start !important;
      color: black;
    }
  }
}
</style>