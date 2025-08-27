import Header from '../bar/Header'
import Footer from '../bar/Footer'
import LendBorrow from './LendBorrow';

export default function Home() {

  return (
    <div>
      <Header/>
      <div className='pt-16 z-0'>
        <LendBorrow/>
        <Footer />
      </div>
      
    </div>
  )
}
