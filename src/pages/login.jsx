import React from 'react'
import Layout from '../components/layout/layout'
import UserProfile from '../components/user-profile/user-profile'

export default function LoginPage() {
  return (
    <Layout>
      <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <UserProfile />
      </div>
    </Layout>
  )
}
