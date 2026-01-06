import { useState } from 'react';
import { BsCurrencyBitcoin } from 'react-icons/bs'


const RegistrationForm = ({onBack}:any) => {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [API_Key, setAPI_Key] = useState('');

  const handleUsernameChange = (event:any) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event:any) => {
    setPassword(event.target.value);
  };

  const handleSubmit = (event:any) => {
    event.preventDefault();

    // Perform API registration here
    // You can make a POST request to the API endpoint with the username and password

    // Reset the form fields
    setUsername('');
    setPassword('');
    const apiKey = generateRandomKey(32);
    setAPI_Key(apiKey)
  };


  function generateRandomKey(length:number) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
  

  return (
    <div className='fixed top-1/3 left-1/4 z-40 flex border-2 bg-slate-300 p-5 m-1 w-1/2 rounded mx-auto items-center justify-center'>
      <button 
      onClick={onBack}
      className='absolute bottom-0 right-0 bg-red-600 hover:bg-red-500 text-white p-3 block mx-auto mt-10 rounded text-sm' 
      type="submit">X
      </button>

      {API_Key.length>0&&
      <h2>
        KEY:{API_Key}
      </h2>}
      
      {API_Key.length==0&&
      <div>
        <div className=' w-2/3 p-2'>
          <p className=' flex'>
            BTC address <BsCurrencyBitcoin/>
          </p>

          <input
            className=' p-1 rounded'
            type="text"
            id="username"
            value={username}
            onChange={handleUsernameChange}
          />
        </div>

        <div className=' p-2'>
          <p>Password:</p>
          <input
            type="password"
            id="password"
            value={password}
            onChange={handlePasswordChange}
          />
        </div>
        <button 
        onClick={handleSubmit}
        className=' bg-green-600 text-white p-3 block mx-auto mt-10 rounded' type="submit">Register</button>
      </div>}

    </div>
  );
};

export default RegistrationForm;
