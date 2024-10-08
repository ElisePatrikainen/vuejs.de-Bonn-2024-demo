import { ref } from "vue"
import { defineQuery, useQuery } from '@pinia/colada'
import { getAllContacts } from "@/api/contact"


export const useContactsQuery = defineQuery(() => {
    // Todo
})



























// export const useContactsQuery = defineQuery(() => {
//     const search = ref('')
//     const query = useQuery({
//         key: () => ['contacts', search.value],
//         query: () => {
//             console.log('fetching', search.value);
            
//             return getAllContacts({ query: { q: search.value } })
//         },
//     })
//     return {
//         ...query,
//         search
//     }
// })