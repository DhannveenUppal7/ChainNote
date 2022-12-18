import { ethers } from 'ethers';
import { useState } from 'react'
import { abi, contractAddress } from '../constants/noteContract';

function UpdateTodo({ todo, setShowUpdateModal, getTodos }) {

    const [todoTitle, setTodoTitle] = useState(todo.title);
    const [todoDescription, setTodoDescription] = useState(todo.description);

    const updateExistingTodo = async () => {
        try {
          const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
          const signer = provider.getSigner();
          const chainNoteContract = new ethers.Contract(contractAddress, abi, signer)
    
          await chainNoteContract.updateTodos(todo.id, todoTitle, todoDescription).then(() => {
            getTodos();
            setShowUpdateModal(false);
          });
        } catch (error) {
            console.log(error);
        }
      }

    return (
        <div>
            <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none m-5">
                <div className="relative w-auto my-6 mx-auto max-w-3xl">
                    <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                        <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                            <h3 className="text-3xl font-semibold">
                                Update Todo
                            </h3>
                            <button className="p-1 ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none" onClick={() => setShowUpdateModal(false)}>
                                ×
                            </button>
                        </div>
                        <div className="relative p-6 flex-auto">
                            <div className='my-4 leading-relaxed'>
                                <input type="text" placeholder='Enter Todo Title' className='w-full mt-5 bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out' value={todoTitle} onChange={(e) => { setTodoTitle(e.target.value) }} />
                                <input type="text" placeholder='Enter Todo Description' className='w-full mt-5 bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out' value={todoDescription} onChange={(e) => { setTodoDescription(e.target.value) }} />
                            </div>
                        </div>
                        <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                            <button className="bg-red-500 text-white active:bg-gray-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-5 mb-1 ease-linear transition-all duration-150" type="button" onClick={() => setShowUpdateModal(false)}>
                                Close
                            </button>
                            {todoTitle && todoDescription ? <button className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button" onClick={updateExistingTodo}>
                                Save Changes
                            </button> : <button className="bg-gray-500 text-white active:bg-gray-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button">
                                Save Changes
                            </button>}
                        </div>
                    </div>
                </div>
            </div>
            <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </div>
    )
}

export default UpdateTodo