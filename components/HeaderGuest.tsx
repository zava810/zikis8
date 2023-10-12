import { AiOutlineMenu, AiOutlinePlus } from "react-icons/ai"
import Link from "next/link"


export default function HeaderGuest() {
    return (
        <div className='flex-row flex bg-gray-700 text-white w-full h-16 items-center justify-between p-2'>
            <AiOutlineMenu className="w-8 h-8" />
            <h2>Ukuhumusha Chat</h2>
            <div className="flex flex-row gap-2">

                <Link href={"/chat"} className="login-button flex items-center justify-center">Login to Save Chats</Link>
            </div>
        </div >
    )
}