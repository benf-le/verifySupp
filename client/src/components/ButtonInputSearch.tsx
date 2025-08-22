import {AiOutlineSearch} from "react-icons/ai";

// @ts-ignore
const ButtonInputSearch = (props) => {
    const {placeholder} =props

return(
    <div className="join w-full">
        <input
            type="text"
            placeholder={placeholder}
            className="input input-bordered w-full join-item"
        />

        <div className="indicator">
            <button className="btn join-item"><AiOutlineSearch/></button>
        </div>
    </div>
)
  
}

export default ButtonInputSearch