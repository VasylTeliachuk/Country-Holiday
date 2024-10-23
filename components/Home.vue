<template lang="pug">
.d-flex.countries
  .d-flex.flex-column.countries__search-wrap
    v-text-field.countries__search.pt-10.mb-8(label="Search country" variant="outlined" hide-details type="search" v-model="searchCountry" clearable)
    span.countries__info.mb-3 Countries List:
    v-list.countries__list
      router-link.countries__link(to="/" v-if="filteredCountries.length > 0")
        v-list-item(v-for="country in filteredCountries" :key="country.name")
          v-list-item-title {{ country.name }}
      v-list-item(v-else)
        v-list-item-title No matches found
  .d-flex.flex-column.countries__widget  
    span.countries__info.mb-3 Countries Widget:
    v-list.countries__widget-list.pb-3
      v-list-item.countries__widget-item.d-flex.flex-column.ml-5.mt-3.pt-5(v-for="(country, index) in selectedCountries" :key="country.name")
        v-list-item-title.countries__widget-item-info.pt-4 Country: &nbsp {{ country.name }}
        v-list-item-title.countries__widget-item-info.pt-4 Holiday: &nbsp {{ holidays[index] }}
        v-list-item-title.countries__widget-item-info.pt-4 Date: &nbsp {{ dates[index] }}
        
</template>

<script setup>
import { ref, onMounted, computed } from "vue"

const countries = ref([])
const searchCountry = ref("")

const selectedCountries = ref([])
const holidays = ref([])
const dates = ref([])

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
      holiday: "Error fetching holiday information",
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
  gap: 100px;
  &__search-wrap {
    max-width: 350px;
    width: 100%;
  }

  &__search {
    max-width: 350px;
  }

  &__info {
    font-size: 24px;
  }

  &__list {
    max-width: 350px;
    padding: 0px;
  }

  &__link {
    text-decoration: none;
  }

  &__widget {
    padding-top: 108px;
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
  }

  &__widget-item {
    justify-content: center;
    align-items: flex-start;
    border-left: 1px solid #ffffff;
  }
  &__widget-item-info {
    align-self: flex-start;
  }
}
</style>