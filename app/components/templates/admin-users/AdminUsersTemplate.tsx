"use client"

import { useRouter } from "next/navigation";

import Header from "../../organisms/Header";

const AdminUsersTemplate: React.FC = () => {

    const router = useRouter(); 

    const navigateTo = (path: string) => {
        router.push(path);
    }

    return (
        <>
            <Header admin={true} />
            <div className="p-4 mx-auto max-w-5xl pt-28 mb-14">
                <div className="relative overflow shadow-md sm:rounded-lg">
                    <div className="flex flex-wrap mb-2">
                        <h1 className="text-lg font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                        Administradores
                        </h1>
                    </div>

                    <table className="w-full text-sm text-left text-gray-500 table-auto">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                Nome
                                </th>
                                <th scope="col" className="px-6 py-3">
                                Email
                                </th>
                                <th scope="col" className="px-6 py-3">
                                Ação
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="px-6 py-3">Fulano Admin</td>
                                <td className="px-6 py-3">admin@admin.com</td>
                                <td className="px-6 py-3 gap-4 flex">
                                    <button className="text-blue-500 hover:underline" onClick={() => navigateTo("admin-password") }>
                                        <svg xmlns="http://www.w3.org/2000/svg" height="36px" viewBox="0 -960 960 960" width="36px" fill="black">
                                            <path d="M240-80q-33 0-56.5-23.5T160-160v-400q0-33 23.5-56.5T240-640h40v-80q0-83 58.5-141.5T480-920q83 0 141.5 58.5T680-720v80h40q33 0 56.5 23.5T800-560v400q0 33-23.5 56.5T720-80H240Zm0-80h480v-400H240v400Zm240-120q33 0 56.5-23.5T560-360q0-33-23.5-56.5T480-440q-33 0-56.5 23.5T400-360q0 33 23.5 56.5T480-280ZM360-640h240v-80q0-50-35-85t-85-35q-50 0-85 35t-35 85v80ZM240-160v-400 400Z"/>
                                        </svg>
                                    </button>
                                    <button className="text-red-500 hover:underline">
                                        <svg xmlns="http://www.w3.org/2000/svg" height="36px" viewBox="0 -960 960 960" width="36px" fill="black">
                                            <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/>
                                        </svg>
                                    </button>
                                    
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    
                </div>
                <button className="mt-4 bg-blue-500 text-white py-2 px-4 rounded" onClick={() => navigateTo("admin-register") }>Adicionar administrador</button>
            </div>
        </>
    )
}

export default AdminUsersTemplate;