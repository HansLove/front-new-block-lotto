import BlockAnimation from "./block/BlockAnimation";


export default function BitcoinMining() {


  return (
    <main className='animation_welcome_1 w-2/3 block mx-auto mt-32 fixed bottom-0'>
      <BlockAnimation/>

      <div className='p-1 m-1'>
        <div className="circle top-circle "></div>
        <div className="circle bottom-circle"></div>

          {/* <button className='rounded text-white text-2xl  mt-24 p-2 bg-sky-500 w-fit ml-72'>
            Mine Block
          </button> */}

      </div>
    </main>
  )
}
