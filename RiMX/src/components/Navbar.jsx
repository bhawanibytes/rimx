import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <>
    
        <div className='flex justify-between py-3 items-center mx-auto max-w-[70%]'>
            <Link to="/">Home</Link>
            <div className='flex justify-around items-center gap-6'>
                <Link to="/signup" className=''>Sign up</Link>
                <Link to="/login" className='bg-black text-white px-6 py-3 rounded-4xl'>Log in</Link>
            </div>
            
        </div>
    </>
    
  )
}

export default Navbar