import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';
import ProductDetails from './ProductDetails';

const retrieveProducts = async ({ queryKey }) => {
	const response = await axios.get(
		`http://localhost:3000/products?_page=${queryKey[1].page}&_per_page=6`
	);
	return response.data;
};

const ProductList = () => {
	const queryClient = useQueryClient();
	const [selectedProductId, setSelectedProductId] = useState(null);
	const [page, setPage] = useState(1);
	const {
		data: products,
		error,
		isLoading,
	} = useQuery({
		queryKey: ['products', { page }],
		queryFn: retrieveProducts,
	});

	const deleteMutation = useMutation({
		mutationFn: (productId) =>
			axios.delete(`http://localhost:3000/products/${productId}`),
		onSuccess: () => {
			queryClient.invalidateQueries(['products']);
		},
	});

	const handleDeleteProduct = (productId) => {
		if (window.confirm('Are you sure you want to delete this product?')) {
			deleteMutation.mutate(productId);
		}
	};

	if (isLoading) return <div>Loading...</div>;
	if (error) return <div>Error: {error.message}</div>;
	return (
		<div className='flex'>
			<div className='flex flex-col justify-center items-center w-3/5'>
				<h2 className='text-3xl my-2'>Product List</h2>
				<ul className='flex flex-wrap justify-center items-center'>
					{products.data &&
						products.data.map((product) => (
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
								<div className='flex gap-2'>
									<button
										className='px-4 py-2 bg-blue-500 text-white rounded-sm hover:bg-blue-600 transition-colors'
										onClick={() => setSelectedProductId(product.id)}
									>
										Show details
									</button>
									<button
										className='px-4 py-2 bg-red-500 text-white rounded-sm hover:bg-red-600 transition-colors'
										onClick={() => handleDeleteProduct(product.id)}
										disabled={deleteMutation.isLoading}
									>
										{deleteMutation.isLoading ? 'Deleting...' : 'Delete'}
									</button>
								</div>
							</li>
						))}
				</ul>
				<div className='flex'>
					{products.prev && (
						<button
							className='p-1 mx-1 bg-gray-100 border cursor-pointer rounded-sm'
							onClick={() => setPage(products.prev)}
						>
							{' '}
							Prev{' '}
						</button>
					)}
					{products.next && (
						<button
							className='p-1 mx-1 bg-gray-100 border cursor-pointer rounded-sm'
							onClick={() => setPage(products.next)}
						>
							{' '}
							Next{' '}
						</button>
					)}
				</div>
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
