import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';
import ProductDetails from './ProductDetails';

const retrieveProducts = async ({ queryKey }) => {
	const response = await axios.get(`http://localhost:3000/${queryKey[0]}`);
	return response.data;
};

const ProductList = () => {
	const [selectedProductId, setSelectedProductId] = useState(null);
	const {
		data: products,
		error,
		isLoading,
	} = useQuery({
		queryKey: ['products'],
		queryFn: retrieveProducts,
	});

	if (isLoading) return <div>Loading...</div>;
	if (error) return <div>Error: {error.message}</div>;
	return (
		<div className='flex'>
			<div className='flex flex-col justify-center items-center w-3/5'>
				<h2 className='text-3xl my-2'>Product List</h2>
				<ul className='flex flex-wrap justify-center items-center'>
					{products &&
						products.map((product) => (
							<li
								key={product.id}
								className='flex flex-col items-center m-2 border rounded-sm'
							>
								<img
									className='object-cover h-64 w-96 rounded-sm'
									src={product.thumbnail}
									alt={product.title}
								/>
								<p className='text-xl my-3'>{product.title}</p>
								<button
									className='px-4 py-2 bg-blue-500 text-white rounded-sm hover:bg-blue-600 transition-colors'
									onClick={() => setSelectedProductId(product.id)}
								>
									Show details
								</button>
							</li>
						))}
				</ul>
			</div>
			{selectedProductId && (
				<ProductDetails
					id={selectedProductId}
					onClose={() => setSelectedProductId(null)}
				/>
			)}
		</div>
	);
};

export default ProductList;
