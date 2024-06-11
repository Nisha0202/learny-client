import React from 'react'
import Banner from '../components/Banner'
import StudySessions from '../components/StudySessions'
import DisplayTutor from '../components/DisplayTutor'

export default function Home() {
  return (
    <div className='min-h-screen'>

      <Banner/>
      <div className='my-16'></div>
      <StudySessions/>
      <DisplayTutor/>
    </div>
  )
}
