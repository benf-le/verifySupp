
import BannerHome from "../components/BannerHome";

import {ProductsCardByCollection} from "../components/Product/ProductsCardByCollection.tsx";

const Home = () => {


    return (
        <div>

            <BannerHome/>
            <div>
                <h1 className="py-10 pl-48 text-2xl font-semibold">
                    Get more for less with VerifySupp
                </h1>
                <ProductsCardByCollection />
            </div>


        </div>
    )
}
export default Home
