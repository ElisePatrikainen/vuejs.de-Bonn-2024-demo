<script lang="ts">
import { defineColadaLoader } from 'unplugin-vue-router/data-loaders/pinia-colada'
import { getContactById } from '@/api/contact';

export const useUserData = defineColadaLoader('/users/colada-loader.[id]', {
  key: (to) => ['contact', to.params.id],
  async query(to, { signal }) {
    return getContactById(to.params.id as string, { signal })
  },
  staleTime: 10000,
})
</script>

<script setup lang="ts">
import { updateContact } from '@/api/contact';
import { useQuery, useMutation } from '@pinia/colada';
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router'

const route = useRoute()
const id = ref(route.params.id)
watch(() => route.params.id, (newId) => id.value = newId)

// Use data loader instead
const { data: contact } = useUserData()

// Use mutation instead
// function addFavorite() {
//   updateContact({ id: Number(route.params.id), isFavorite: !contact.value.isFavorite })
// }
const { mutate: addFavorite } = useMutation({
  mutation: () => updateContact({ id: Number(route.params.id), isFavorite: !contact.value.isFavorite }),
  keys: [['contact', id.value]],
})

</script>


<template>
  <div v-if="!isPending">
    <div class="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
      <div class="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
        <img :src="contact?.photoURL" class="h-full w-full object-cover object-center sm:rounded-lg" />

        <!-- Product info -->
        <div class="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
          <h1 class="text-3xl font-bold tracking-tight text-white">{{ contact?.firstName }} {{ contact?.lastName }}
            <span v-if="contact?.isFavorite">❤️</span>
            <span v-else>😐</span>
          </h1>

          <div class="mt-3">
            <p class="text-3xl tracking-tight text-white">{{ contact?.bio }}</p>
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
            <button @click="addFavorite"
              class="flex max-w-xs flex-1 items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50 sm:w-full">
              Add as favorite
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
  <div v-else class="h-screen mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
  <div class="animate-pulse flex space-x-4">
    <div class="flex-1 space-y-6 py-1">
      <div class="h-2 bg-slate-700 rounded"></div>
      <div class="space-y-3">
        <div class="grid grid-cols-3 gap-4">
          <div class="h-2 bg-slate-700 rounded col-span-2"></div>
          <div class="h-2 bg-slate-700 rounded col-span-1"></div>
        </div>
        <div class="h-2 bg-slate-700 rounded"></div>
      </div>
    </div>
  </div>
</div>
</template>
