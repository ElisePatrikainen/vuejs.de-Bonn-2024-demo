<script lang="ts">
import { defineColadaLoader } from 'unplugin-vue-router/data-loaders/pinia-colada'
import { getContactById } from '@/api/contact';

export const useUserData = defineColadaLoader('/users/colada-loader.[id]', {
  async query(to, { signal }) {
    // return await { name : 'test' }
    console.log('to', to);
    
    return getContactById(to.params.id as string, { signal })
  },
  key: (to) => ['contact', to.params.id],
  // Keep the data "fresh" 10 seconds to avoid fetching the same data too often
  staleTime: 10000,
})
</script>

<script setup lang="ts">
import { updateContact, type Contact } from '@/api/contact';
// import { getContactById } from '@/api/contact';
import { useMutation, useQuery, useQueryCache } from '@pinia/colada';
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router'

const route = useRoute()

// const id = ref(Number(route.params.id))
// watch(() => route.params.id, (newId) => {
//   id.value = Number(newId)
// })

const cache = useQueryCache()
const newContactName = ref('')

// const { data, refetch } = useQuery({
//   key: ['contact', id.value],
//   query: () => {
//     return getContactById(id.value)
//   },
//   placeholderData: () => {
//     console.log('placeholderData', cache.getQueryData(['contacts']));
    
//     return (cache.getQueryData(['contacts']) as Array<Contact> || undefined)?.find((contact: any) => contact.id === id.value)
//   }
// })

// const { data } = useUserData()

const { data: contact } = useUserData()

const { mutate } = useMutation({
  mutation: () => {
    return updateContact({id: Number(route.params.id), firstName: newContactName.value})
  },
  keys: [['contact', route.params.id]],
  onMutate: () => {
    const initialData = { ...contact.value }
    cache.setQueryData(['contact', route.params.id], { ...contact.value, firstName: newContactName.value })
    return { initialData }
  },
  // @ts-ignore: types return // do an issue
  onError({ initialData }) {
    console.log('onError', initialData);
    
    cache.setQueryData(['contact', route.params.id], initialData)
  },
})

</script>

<!-- <template>
  <div class="about">
    <RouterLink :to="{
      path: '/'
    }">Home</RouterLink>
    <RouterLink :to="{
      name: 'contact',
      params: { id: Number(route.params.id) + 1 },
    }">Next</RouterLink>
    <h1>This is an about page : {{ data }}</h1>
    <div>TEST : {{ id }}</div>
  </div>
  <input v-model="newContactName" />
  <button @click="mutate">Update</button>
</template> -->

<template>
  <div class="bg-white">
    <div class="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
      <div class="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
        <img :src="contact?.photoURL" class="h-full w-full object-cover object-center sm:rounded-lg" />

        <!-- Product info -->
        <div class="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
          <h1 class="text-3xl font-bold tracking-tight text-gray-900">{{ contact?.firstName }} {{ contact?.lastName }}</h1>

          <div class="mt-3">
            <p class="text-3xl tracking-tight text-gray-900">{{ contact?.bio }} €</p>
          </div>

          <!-- Reviews -->
          <div class="mt-3">
            <h3 class="sr-only">Reviews</h3>
            <div class="flex items-center">
              <div v-if="contact?.rating" class="flex items-center">
                <StarIcon v-for="rating in [0, 1, 2, 3, 4]" :key="rating"
                  :class="[contact?.rating > rating ? 'text-indigo-500' : 'text-gray-300', 'h-5 w-5 flex-shrink-0']"
                  aria-hidden="true" />
              </div>
              <p class="sr-only">{{ contact?.rating }} out of 5 stars</p>
            </div>
          </div>

          <div class="mt-6">
            <h3 class="sr-only">Description</h3>

            <div class="space-y-6 text-base text-gray-700" v-html="contact?.description" />
          </div>

          <div>Availability: {{ contact?.availability }}</div>

          <div class="mt-10 flex">
            <button @click="bookItem"
              class="flex max-w-xs flex-1 items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50 sm:w-full">
              Add to bag
            </button>
            <button type="button"
              class="ml-4 flex items-center justify-center rounded-md px-3 py-3 text-gray-400 hover:bg-gray-100 hover:text-gray-500">
              <HeartIcon class="h-6 w-6 flex-shrink-0" aria-hidden="true" />
              <span class="sr-only">Add to favorites</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
