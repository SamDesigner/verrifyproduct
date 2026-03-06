
interface VerificationStatusProps {
    property:string
}
const VerificationStatus = ({ property }:VerificationStatusProps) => {
    return (
        <div>
            <p
                className={`${property === "VERIFIED"
                    ? "bg-green-900 text-white"
                    : "bg-yellow-500 text-black"
                    }  rounded-full w-fit py-1 px-3`}
            >
                {property}
            </p>
        </div>
    )
}

export default VerificationStatus