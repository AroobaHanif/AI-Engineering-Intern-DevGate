const mongoose = require('mongoose');
require('dotenv').config();
const Product = require('./models/Product');

// 16 Books Data
const books = [
  { 
    name: "Peer-e-Kamil",
    author: "Umera Ahmed",
    genre: "Fiction",
    price: 8.99, 
    description: "A spiritual journey of self-discovery and faith.",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200&h=260&fit=crop", 
    stock: 15
  },
  { 
    name: "Zindagi Gulzar Hai",
    author: "Umera Ahmed", 
    genre: "Romance", 
    price: 7.99,
    description: "A story of class, ambition, and love in Pakistan.",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200&h=260&fit=crop", 
    stock: 20 
  },
  {
    name: "Amar Bail", 
    author: "Umera Ahmed", 
    genre: "Fiction", 
    price: 8.49, 
    description: "A tale of family, sacrifice, and redemption.", 
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200&h=260&fit=crop", 
    stock: 12 
  },
  { 
    name: "Meri Zaat Zarra-e-Benishan", 
    author: "Umera Ahmed", 
    genre: "Fiction", 
    price: 8.99, 
    description: "A powerful story of resilience and self-worth.", 
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200&h=260&fit=crop", 
    stock: 10 
  },
  { 
    name: "Aab-e-Hayat", 
    author: "Umera Ahmed", 
    genre: "Fiction", 
    price: 9.49, 
    description: "A tale exploring love, loss, and spirituality.", 
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200&h=260&fit=crop", 
    stock: 14 
  },
  { 
    name: "Doriyan", 
    author: "Umera Ahmed", 
    genre: "Romance", 
    price: 7.49, 
    description: "A story about the invisible threads that connect us.", 
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200&h=260&fit=crop", 
    stock: 18 
  },
  {
    name: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    genre: "Fiction",
    price: 12.99,
    description: "A story of wealth and love in the Jazz Age.",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200&h=260&fit=crop",
    stock: 15
  },
  {
    name: "To Kill a Mockingbird",
    author: "Harper Lee",
    genre: "Fiction",
    price: 14.99,
    description: "A story of racial injustice and loss of innocence.",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200&h=260&fit=crop",
    stock: 12
  },
  {
    name: "1984",
    author: "George Orwell",
    genre: "Sci-Fi",
    price: 11.99,
    description: "A dystopian novel set in a totalitarian society.",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200&h=260&fit=crop",
    stock: 20
  },
  {
    name: "Pride and Prejudice",
    author: "Jane Austen",
    genre: "Romance",
    price: 9.99,
    description: "The story of Elizabeth Bennet and Mr. Darcy.",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200&h=260&fit=crop",
    stock: 18
  },
  {
    name: "The Hobbit",
    author: "J.R.R. Tolkien",
    genre: "Fantasy",
    price: 15.99,
    description: "Bilbo Baggins' adventure to reclaim the Lonely Mountain.",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200&h=260&fit=crop",
    stock: 10
  },
  {
    name: "The Alchemist",
    author: "Paulo Coelho",
    genre: "Fiction",
    price: 13.99,
    description: "A young shepherd's journey to find his personal legend.",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200&h=260&fit=crop",
    stock: 25
  },
  {
    name: "Dune",
    author: "Frank Herbert",
    genre: "Sci-Fi",
    price: 16.99,
    description: "A sci-fi epic set in a desert planet.",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200&h=260&fit=crop",
    stock: 8
  },
  {
    name: "The Catcher in the Rye",
    author: "J.D. Salinger",
    genre: "Fiction",
    price: 10.99,
    description: "A story about teenage rebellion and alienation.",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200&h=260&fit=crop",
    stock: 14
  },
  {
    name: "The Book Thief",
    author: "Markus Zusak",
    genre: "History",
    price: 12.99,
    description: "A story set in Nazi Germany, narrated by Death.",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200&h=260&fit=crop",
    stock: 9
  },
  {
    name: "The Psychology of Money",
    author: "Morgan Housel",
    genre: "Self-Help",
    price: 18.99,
    description: "Timeless lessons on wealth, greed, and happiness.",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200&h=260&fit=crop",
    stock: 20
  },
  { 
    name: "Harry Potter and the Sorcerer's Stone", 
    author: "J.K. Rowling", 
    genre: "Fantasy", 
    price: 12.99, 
    description: "A young wizard discovers his magical destiny.", 
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200&h=260&fit=crop", 
    stock: 25 
  },
  { 
    name: "Gone Girl", 
    author: "Gillian Flynn", 
    genre: "Mystery & Thriller", 
    price: 11.49, 
    description: "A marriage turns into a chilling mystery.", 
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200&h=260&fit=crop", 
    stock: 16 
  },
  { 
    name: "The Shining", 
    author: "Stephen King", 
    genre: "Horror", 
    price: 10.49, 
    description: "A family isolated in a haunted hotel.", 
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200&h=260&fit=crop", 
    stock: 15 
  },
  { 
    name: "Steve Jobs", 
    author: "Walter Isaacson", 
    genre: "Biography", 
    price: 15.99, 
    description: "The definitive biography of Apple's co-founder.", 
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200&h=260&fit=crop", 
    stock: 12 
  },
  { 
    name: "Milk and Honey", 
    author: "Rupi Kaur", 
    genre: "Poetry", 
    price: 8.99, 
    description: "A collection of poetry on love, loss, and healing.", 
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200&h=260&fit=crop", 
    stock: 20 
  },
  { 
    name: "Charlotte's Web",
    author: "E.B. White", 
    genre: "Children's", 
    price: 7.99, 
    description: "A story of friendship between a pig and a spider.", 
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200&h=260&fit=crop", 
    stock: 25 
  },
];

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('✅ Connected to MongoDB!');
    
    // Delete existing products (optional)
    await Product.deleteMany({});
    console.log('🗑️ Old products removed');
    
    // Insert new books
    const inserted = await Product.insertMany(books);
    console.log(`✅ ${inserted.length} books added successfully!`);
    
    // Show inserted books
    console.log('\n📚 Books Added:');
    inserted.forEach((book, index) => {
      console.log(`${index + 1}. ${book.name} - $${book.price}`);
    });
    
    // Disconnect
    mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  })
  .catch((err) => {
    console.error('❌ Error:', err);
    mongoose.disconnect();
  });