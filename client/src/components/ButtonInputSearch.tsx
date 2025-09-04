import {AiOutlineSearch} from "react-icons/ai";
import {useState} from "react";

type Props = {
    placeholder?: string;
    onSearch: (keyword: string) => void;
};

// @ts-ignore
const ButtonInputSearch = ({placeholder, onSearch}:Props) => {

    const[keyword, setKeyword] = useState("");

    const handleSubmit =(e: React.FormEvent)=>{
        e.preventDefault();
        if(keyword.trim()){
            onSearch(keyword);
        }
    }

return(
    <form onSubmit={handleSubmit} className="join w-full">
        <input
            type="text"
            value={keyword}
            placeholder="Search..."
            className="input input-bordered w-full join-item"
            onChange={(e)=>setKeyword(e.target.value)}
        />

        <div className="indicator">
            <button className="btn join-item"><AiOutlineSearch/></button>
        </div>
    </form>
)
  
}

export default ButtonInputSearch