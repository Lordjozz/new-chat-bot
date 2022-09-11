import {autoEffect, store,} from '@risingstack/react-easy-state'

export const getStoredValue = (key, store) => {
  const ls = localStorage.getItem(store)
  if (!ls) return null
  const parsed = JSON.parse(ls)
  console.log(`%cUser Store - Get Key (${key})`, 'font-weight: 700; color: cyan;', parsed[key])
  return parsed[key]
}

const UserStore = store({
  name: getStoredValue('name', 'user-stores'),
  colour: getStoredValue('colour', 'user-stores'),
  geo: getStoredValue('geo', 'user-stores'),
  location: getStoredValue('location', 'user-stores'),
  email: getStoredValue('email', 'user-stores'),
  setup: getStoredValue('setup', 'user-stores') || false
})

autoEffect(() => localStorage.setItem('user-stores', JSON.stringify(UserStore)))

export default UserStore
