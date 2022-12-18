import { ethers } from 'ethers';
import Head from 'next/head'
import { useEffect, useState } from 'react'
import Web3 from 'web3';
import UpdateTodo from '../components/UpdateTodo';
import { abi, contractAddress } from '../constants/noteContract';


export default function Home() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [balance, setBalance] = useState();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [todos, setTodos] = useState([]);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateTodo, setUpdateTodo] = useState();

  const getTodos = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();

      const chainNoteContract = new ethers.Contract(contractAddress, abi, signer)

      await chainNoteContract.returnTodos(accounts[0]).then((e) => {
        setTodos(e);
      });
    } catch (error) {

    }

  };
  getTodos();

  useEffect(() => {
    const web3 = new Web3(Web3.givenProvider)
    web3.eth.getAccounts(function (err, accounts) {
      if (err != null) {
        console.error("An error occurred: " + err)
      }
      else if (accounts.length == 0) {
        setLoggedIn(false);
      }
      else {
        setLoggedIn(true);
        window.ethereum.request({
          method: "eth_requestAccounts"
        }).then(async (ab) => {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          let balance = await provider.getBalance(ab[0]);
          let balanced = ethers.utils.formatEther(balance);
          setAccounts(ab);
          setBalance(balanced)
          getTodos();


        });
      }
    });

  }, []);

  const connectWallet = () => {
    window.ethereum.request({
      method: "eth_requestAccounts"
    }).then(async (ab) => {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      let balance = await provider.getBalance(ab[0]);
      let balanced = ethers.utils.formatEther(balance);
      setAccounts(ab);
      setBalance(balanced)
      setLoggedIn(true);
    });
  }

  const createTodo = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
      const signer = provider.getSigner();
      const chainNoteContract = new ethers.Contract(contractAddress, abi, signer)

      await chainNoteContract.createTodo(title, description).then(() => {
        getTodos();
        // toast.success("Fund Deposited", {
        //   position: "bottom-right",
        //   autoClose: 5000,
        //   hideProgressBar: false,
        //   closeOnClick: true,
        //   pauseOnHover: true,
        //   draggable: true,
        //   progress: undefined,
        // });

      });
    } catch (error) {

    }
  }
  const deleteTodo = async (id) => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
      const signer = provider.getSigner();
      const chainNoteContract = new ethers.Contract(contractAddress, abi, signer)

      await chainNoteContract.markTrue(id).then(() => {
        getTodos();
      });
    } catch (error) {

    }
  }
  return (
    <>
      <Head>
        <title>ChainNote</title>
        <meta name="description" content="ChainNote" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/logo.png" />
      </Head>
      <div>

        <header class="bg-white text-gray-600 body-font">
          <div class="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center justify-between">
            <a class="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
              <img src="/logo.png" width={70} height={50} />
              <span class="ml-3 text-xl">ChainNote</span>
            </a>

            {!loggedIn ? <button onClick={connectWallet} class="inline-flex items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base mt-4 md:mt-0">Connect Wallet
              <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-4 h-4 ml-1" viewBox="0 0 24 24">
                <path d="M5 12h14M12 5l7 7-7 7"></path>
              </svg>
            </button> : <div className={"bg-black text-white p-2 rounded-lg text-center"}>
              <label className={"text-white font-bold hover:cursor-pointer"}>{accounts[0]?.substring(0, 6)}...{accounts[0]?.substring(36, 42)}</label> <label className='text-black'>|</label> <label className='font-bold hover:cursor-pointer'>{parseFloat(balance).toFixed(2)} ETH</label>
            </div>}
          </div>
        </header>


        {loggedIn ? <div>
          <div>
            <div className="container px-5 py-2 mx-auto flex">
              <div className=" bg-white rounded-lg p-8 flex flex-col md:ml-auto w-full mt-10 md:mt-0 relative z-10 shadow-md">
                <h2 className="text-gray-900 text-lg mb-1 font-medium title-font">Create Todo</h2>

                <div className="relative mb-4">
                  <label className="leading-7 text-sm text-gray-600">Title</label>
                  <input type="text" className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" value={title} onChange={(e) => { setTitle(e.target.value) }} />
                </div>
                <div className="relative mt-5">
                  <label className="leading-7 text-sm text-gray-600">Description</label>
                  <input type="text" className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" value={description} onChange={(e) => { setDescription(e.target.value) }} />
                </div>
                <button onClick={createTodo} className="text-white mt-12 bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg">Create Todo</button>
                <p className="text-xs text-gray-500 mt-3">All todos are stored on the Blockchain with a secure ledger.</p>
              </div>
            </div>
            <hr />
            <h2 className="text-gray-900 text-2xl mt-3 mb-4 font-medium title-font  text-center">My Todos</h2>

            {todos.map((todo) => {
              if (todo.status == false) {
                return (
                  <div className="container px-5 py-2 mx-auto flex">
                    <div className=" bg-white rounded-lg p-8 flex flex-col md:ml-auto w-full mt-10 md:mt-0 relative z-10 shadow-md">
                      <h2 className="text-gray-900 text-lg mb-1 font-medium title-font">{todo.id?.toString()}. {todo.title}</h2>
                      <h2 className="text-gray-900 text-lg mb-1 font-medium title-font">{todo.description}</h2>
                      <div>
                        <button onClick={() => { deleteTodo(todo.id) }} className="text-white mt-12 md:mr-4 bg-red-500 border-0 py-2 px-6 focus:outline-none hover:bg-red-600 rounded text-lg">Delete Todo</button>
                        <button onClick={()=>{
                          setUpdateTodo(todo);
                          setShowUpdateModal(true);
                        }} className="text-white mt-12 bg-emerald-500 border-0 py-2 px-6 focus:outline-none hover:bg-emerald-600 rounded text-lg">Update Todo</button>
                      </div>
                    </div>
                  </div>
                )
              }
              else {
                return (
                  <div className="container px-5 py-2 mx-auto flex line-through">
                    <div className=" bg-white rounded-lg p-8 flex flex-col md:ml-auto w-full mt-10 md:mt-0 relative z-10 shadow-md">
                      <h2 className="text-gray-900 text-lg mb-1 font-medium title-font">{todo.id?.toString()}. {todo.title}</h2>
                      <h2 className="text-gray-900 text-lg mb-1 font-medium title-font">{todo.description}</h2>

                    </div>
                  </div>
                )
              }

            })}


          </div>

        </div> : <div>
          <div>
            <div className="container px-5 py-24 mx-auto flex">
              <div className=" bg-white rounded-lg p-8 flex flex-col md:ml-auto w-full mt-10 md:mt-0 relative z-10 shadow-md">
                <h2 className="text-gray-900 text-lg mb-1 font-medium title-font">Create Todo</h2>

                <div className="relative mb-4">
                  <label className="leading-7 text-sm text-gray-600">Title</label>
                  <input type="text" className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                </div>
                <div className="relative mt-5">
                  <label className="leading-7 text-sm text-gray-600">Description</label>
                  <input type="text" className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                </div>
                <button onClick={connectWallet} className="text-white mt-12 bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg">Connect Wallet</button>
                <p className="text-xs text-gray-500 mt-3">All todos are stored on the Blockchain with a secure ledger.</p>
              </div>
            </div>
          </div>


        </div>}
      </div>
      {updateTodo && showUpdateModal ? <UpdateTodo getTodos={getTodos} setShowUpdateModal={setShowUpdateModal} todo={updateTodo}  /> : null}
    </>
  )
}
