import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const retrieveProduct = async ({ queryKey }) => {
	const response = await axios.get(
		`http://localhost:3000/${queryKey[0]}/${queryKey[1]}`
	);
	return response.data;
};

const ProductDetails = ({ id, onClose }) => {
	const {
		data: product,
		error,
		isLoading,
	} = useQuery({
		queryKey: ['products', id],
		queryFn: retrieveProduct,
	});

	if (isLoading) return <div>Fetching Product Details...</div>;
	if (error) return <div>An Error Occurred: {error.message}</div>;

	return (
		<div className='w-1/5'>
			<div className='flex justify-between items-center mb-2'>
				<h1 className='text-3xl my-2'>Product Details</h1>
				<button
					onClick={onClose}
					className='px-3 py-1 bg-red-500 text-white rounded-sm hover:bg-red-600 transition-colors text-sm'
				>
					Close
				</button>
			</div>
			<div className='border bg-gray-100 p-1 text-md rounded flex flex-col'>
				<img
					src={product.thumbnail}
					alt={product.title}
					className='object-cover h-24 w-24 border rounded-full m-auto'
				/>
				<p className='font-semibold text-center'>{product.title}</p>
				<p className='text-sm text-gray-600'>{product.description}</p>
				<p className='font-bold'>USD {product.price}</p>
				<p>Rating: {product.rating}/5</p>
			</div>
		</div>
	);
};

export default ProductDetails;
