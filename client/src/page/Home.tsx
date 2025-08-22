
import BannerHome from "../components/BannerHome";
import {ProductsCardSale} from "../components/ProductsCardSale";

const Home = () => {


    return (
        <div>

            <BannerHome/>
            <div>
                <h1 className="py-10 pl-48 text-2xl font-semibold">
                    Get more for less with Petstock
                </h1>
                <ProductsCardSale />
            </div>


        </div>
    )
}
export default Home
