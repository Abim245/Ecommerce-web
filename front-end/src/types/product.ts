export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  quantity: number;
  vendor: {
    _id: string;
    name: string;
    storeName: string;
    location: string;
    phone: string;
    bio: string;
    profilePicture: string;
  };
}