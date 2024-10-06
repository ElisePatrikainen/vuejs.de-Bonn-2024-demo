
import { getContactById, type Contact } from "@/api/contact";
import { defineQuery, useQuery, useQueryCache, type UseQueryOptions } from "@pinia/colada";
import { ref, watch } from "vue";
import { useRoute } from "vue-router";

// export const createContactQueryOptions = (id: number) => {
//     // TODO: voir pour le typing
//     // TODO: comprendre comment c'est watché
//     const cache = useQueryCache()
//     const query: UseQueryOptions = {
//         key: ['contact', id],
//         query: () => getContactById(id),
//         placeholderData: () => {
//         return (cache.getQueryData(['contacts']) as Array<Contact> || undefined)?.find((contact: any) => contact.id === id.value)
//         },
//     }
//     return query
// }


export const defineContactQuery = defineQuery(() => {
    const route = useRoute()
    const cache = useQueryCache()
    const id = ref(route.params.id)

    // case where we are on the `/contact` page
    watch(() => route, (_route) => {
        // if (_route.name !== 'contact') {
        //     id.value = undefined
        //     return
        // }
        console.log('watching', _route.params);
        
        id.value = _route.params.id
    })

    // defining the prefetch function
    const prefetch = (_id: number) => {
        console.log('prefetching', _id);
        console.log('prefetching pre', id.value);
        
        id.value = _id
        console.log('prefetching post', id.value);
        
    }

    const query = useQuery({
        key: ['contact', id.value as string],
        query: () => {
            // Hack until `skip` option
            console.log('fetching0', id.value);
            if (!id.value) {
                return Promise.resolve(undefined)
            }
            console.log('fetching', id.value);
            
            return getContactById(id.value)
        },
        placeholderData: () => {
            return (cache.getQueryData(['contacts']) as Array<Contact> || undefined)?.find((contact: any) => contact.id === id.value)
        },
    })

    return {
        ...query,
        prefetch,
        id
    }
})