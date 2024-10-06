<script setup lang="ts">
import { getContactById, updateContact, type Contact } from '@/api/contact';
import { defineContactQuery } from '@/queries/contact';
import { useMutation, useQuery, useQueryCache } from '@pinia/colada';
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router'

const route = useRoute()

const id = ref(Number(route.params.id))
watch(() => route.params.id, (newId) => {
  id.value = Number(newId)
})

const cache = useQueryCache()
const newContactName = ref('')

const { data, refetch } = useQuery({
  key: ['contact', id.value],
  query: () => {
    return getContactById(id.value)
  },
  placeholderData: () => {
    return (cache.getQueryData(['contacts']) as Array<Contact> || undefined)?.find((contact: any) => contact.id === id.value)
  }
})

const { mutate } = useMutation({
  mutation: () => {
    return updateContact({id: id.value, firstName: newContactName.value})
  },
  keys: [['contact', id.value]],
  onMutate: () => {
    const initialData = { ...data.value }
    cache.setQueryData(['contact', id.value], { ...data.value, firstName: newContactName.value })
    return { initialData }
  },
  // @ts-ignore: types return // do an issue
  onError({ initialData }) {
    console.log('onError', initialData);
    
    cache.setQueryData(['contact', id.value], initialData)
  },
})

</script>

<template>
  <div class="about">
    <RouterLink :to="{
      name: 'home'
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
</template>

