import Contact from '../components/Contact'

const page = () => {
    return (
        <div className="felx flex-col text-center max-w-screen-xl m-auto">
            <div className="font-semibold text-2xl mt-10 pl-4 md:text-4xl">
                Contact us
            </div>
            <Contact />
        </div>
    )
}

export default page