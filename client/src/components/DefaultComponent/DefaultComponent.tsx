import Header from "../Header";
import Footer from "../Footer";

// @ts-ignore
const DefaultComponent = ({children}) => {
    return (
        <div>
            <Header />
            {children}
            <Footer/>
        </div>
    )
}

export default DefaultComponent