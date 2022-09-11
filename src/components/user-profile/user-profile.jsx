import React from 'react'
import { view } from '@risingstack/react-easy-state'

import UserStore from '../../stores/user'

import styling from './user-profile.module.scss'
import { useHistory } from 'react-router'


export default view(function UserProfile() {
  const history = useHistory()
  return (
    <form className={styling.container} onSubmit={() => {UserStore.setup = true; history.push('/rooms');}}>
      <p className={styling.title}>Your Profile</p>
      <div className={styling['form-row']}>
        <label>Your Name</label>
        <input type="text" value={UserStore.name} onChange={_ => UserStore.name = _.target.value} required />
      </div>
      <div className={styling['form-row']}>
        <label>Your Email</label>
        <input type="email" value={UserStore.email} onChange={_ => UserStore.email = _.target.value} required />
      </div>
      <div className={styling['form-row']}>
        <label>Your colour</label>
        <input type="color" value={UserStore.colour} onChange={_ => UserStore.colour = _.target.value} />
      </div>
      <button type="submit" className={styling.button} disabled={!UserStore.name || !UserStore.email}>Save Profile</button>
    </form>
  )
})
