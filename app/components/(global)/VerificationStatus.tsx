
interface VerificationStatusProps {
    property: {
        propertyVerificationStatus: string
    }
}
const VerificationStatus = ({ property }:VerificationStatusProps) => {
    return (
        <div>
            <p
                className={`${property.propertyVerificationStatus === "VERIFIED"
                    ? "bg-green-900 text-white"
                    : "bg-yellow-500 text-black"
                    }  rounded-full w-fit py-1 px-3 absolute right-3 top-3`}
            >
                {property.propertyVerificationStatus}
            </p>
        </div>
    )
}

export default VerificationStatus