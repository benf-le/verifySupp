import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios"

import { useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";

const ApiContext = createContext({});

export const useApiContext = () => useContext(ApiContext);

export const ApiProvider = ({ children }) => {
	const navigate = useNavigate();
	const [isLoading, setIsLoading] = useState(false);
	const [change, setChange] = useState(false);
	const [user, setUser] = useState(null);


	useEffect(() => {
		const f = async () => getAllBooks()
		f()
		if (!user) {
			const token = localStorage.getItem('token');
			if (!token) {
				navigate("/")
			}
			else {

			}

		}

	}, []);

	const getAllBooks = async () => {
		setIsLoading(true);
		const { data } = await axios.get('http://localhost:7000/showProductsSale', )
		setIsLoading(false);
		return data
	}

	// const getBookById = async (id) => {
	// 	setIsLoading(true);
	// 	const { data } = await axios.get(backend(`books/${id}`),{
	// 		headers: {
	// 			'Authorization': ` Bearer ${localStorage.getItem('token')}`
	// 		}
	// 	})
	// 	setIsLoading(false);
	// 	return data
	// };
	//

	return (
		<ApiContext.Provider value={{ getAllBooks, isLoading, change, setChange, setUser, user }}>
			{children}
		</ApiContext.Provider>
	)
}