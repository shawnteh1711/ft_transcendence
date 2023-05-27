import Image from 'next/image';

const Logo = () => {
    return (
        <div className="flex items-center mt-5 ml-5 w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5">
            <Image className="object-contain" src="/logo.png" alt="Logo" width={400} height={100} />
            {/* <img className="object-contain" src="/logo.png" alt="Logo" /> */}
            <Image className="object-contain" src="/pongmington.png" alt="Logo" width={400} height={100} />
            {/* <img className="object-contain" src="/pongmington.png" alt="Pongminton"/> */}
        </div>
    )
}
export default Logo;