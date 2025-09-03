import {FiMapPin} from "react-icons/fi";
import {Link} from "react-router-dom";
import {BiShoppingBag, BiStoreAlt} from "react-icons/bi";

function OptionNearYou() {


    return (
        <div className="grid gap-4 grid-cols-1  bg-zinc-100 h-60 ">

            <div className="p-3">
                <p className="pet-stock-text-color font-medium py-1">Collection options near you</p>
                <Link to='/findstore' className="py-1 flex flex-row text-cyan-500">
                    <FiMapPin className="mt-1"/>
                    <p className="pl-2">Find a store</p>
                </Link>
                <div className="py-1 flex flex-row ">
                    <BiShoppingBag className="mt-1"/>
                    <p className="pl-2">Click & Collect</p>
                    {/*<div className=''>Unavailable</div>*/}
                </div>
                <div className="py-1 flex flex-row">
                    <BiStoreAlt className="mt-1"/>
                    <p className="pl-2">In Store</p>
                    {/*<div className=''>Unavailable</div>*/}

                </div>

            </div>
        </div>
    );
}

export default OptionNearYou;
