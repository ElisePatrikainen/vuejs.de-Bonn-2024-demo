import { type Options, mande } from 'mande'

export const contacts = mande('http://localhost:7777/contacts', {})

export interface _UpdateInfo {
  createdAt: string
  updatedAt: string
}

interface ContactInfo {
  id: number
  firstName: string
  lastName: string
  photoURL: string
  isFavorite: boolean
}

interface ContactDetails {
  bio: string
}

export interface Contact extends ContactInfo, _UpdateInfo {}
export interface ContactWithDetails extends ContactInfo, ContactDetails, _UpdateInfo {}

/**
 * Retrieve all the contact list.
 */
export async function getAllContacts(options?: Options<'json'>): Promise<Contact[]> {
  await new Promise(resolve => setTimeout(resolve, 2000))
  return contacts.get<ContactWithDetails[]>('/', options).then(contacts => {
    contacts.forEach(c => {
      // @ts-ignore: we want to remove the bio property
      delete c.bio
    })
    return contacts
  })
}

/**
 * Get the information of a contact by using its id.
 *
 * @param id id of the contact
 */
export async function getContactById(
  id: string | number,
  options?: Options<'json'>,
) {
  // if (Math.random() > 0.75) {
  //   throw new Error('Failed to fetch')
  // }
  await new Promise(resolve => setTimeout(resolve, 2000))
  return contacts.get<Contact>(id, options)
}

/**
 * Create a new contact.
 *
 * @param contact - The contact to create
 * @returns the created contact
 */
export function createContact(
  contact: Omit<ContactInfo, 'photoURL'>,
  options?: Options<'json'>,
) {
  return contacts.post<Contact>(
    '/',
    {
      photoURL: `https://i.pravatar.cc/150?u=${contact.firstName}${contact.lastName}`,
      ...contact,
      registeredAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    options,
  )
}

/**
 * Update a contact.
 *
 * @param contact - The contact to update
 * @returns the updated contact
 */
export async function updateContact(
  contact: Partial<ContactInfo> & { id: number },
  options?: Options<'json'>,
): Promise<Contact> {
  await new Promise(resolve => setTimeout(resolve, 3000))
  // throw new Error('Failed to update')
  return contacts.patch<Contact, 'json'>(`/${contact.id}`, contact, options)
}

// /**
//  * Search the contacts database.
//  *
//  * @param searchText - the text to search for
//  * @param options - search, page, number per page, and other filtering options
//  * @param options.page - the page number to retrieve
//  * @param options.perPage - the number of items to retrieve per page
//  * @param options.filterInfo - any other filtering options
//  * @returns an object with the total of results and an array with at most `perPage` (defaults to 10) elements in it
//  */
// export function searchContacts(
//   searchText: string,
//   {
//     page,
//     perPage,
//     ...filterInfo
//   }: {
//     page?: number
//     perPage?: number | string
//   } & Partial<Contact> = {},
//   options?: Options<'response'>,
// ): Promise<{ total: number, results: Contact[] }> {
//   const query: Record<string, string | null | undefined | number | boolean>
//     = filterInfo as Record<string, string | boolean | number | null>
//   if (searchText) query.q = searchText
//   if (page) query._page = page
//   if (perPage) query._limit = perPage

//   return contacts
//     .get('/', { query, responseAs: 'response', ...options })
//     .then(async (res) => ({
//       total: Number(res.headers.get('x-total-count')) || 0,
//       results: (await res.json()) as Contact[],
//     }))
// }
