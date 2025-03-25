import { useState } from "react";

const SignupForm = () => {
  const [formData, setformData] = useState({
    firstName : "",
    lastName : "",
    number : "",
    country : "+91"
  })

  const handleChanges = (e) => {
    setformData({...formData, [e.target.name] : e.target.value})
    
    // console.log(formData)
  }

  function handleSubmit() {
    // e.preventDefault();
  }
  
  return (
    <div className="bg-black text-gray-700 flex justify-center items-center min-h-[80vh]">
      <form action="submit" method="post" className="bg-white rounded-xl min-w-[20%]">
        <div className="flex flex-col gap-4 my-6 mx-auto max-w-[80%]">
          <label htmlFor="firstName" className="flex flex-col "> First Name: 
            <input type="text" name="firstName" id="firstname" placeholder=" John" onChange={handleChanges} required className="border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 "/>
          </label> 
          <label htmlFor="lastName" className="flex flex-col "> Last Name:
              <input type="text" name="lastName" id="lastName" placeholder=" Deo" onChange={handleChanges} required className="border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 "/>
            </label>
          <label htmlFor="number" className="flex flex-col" > Number:
            <input type="tel" name="number" id="number" placeholder=" 9876543210" onChange={handleChanges} required minLength={10} className="border appearance-none rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 "/>
          </label>
          <button type="submit" className="text-white text-center bg-black rounded-4xl py-2 px-6" onClick={handleSubmit}>Sign Up</button>
        </div>
      </form>
    </div>
  );
};

export default SignupForm;
