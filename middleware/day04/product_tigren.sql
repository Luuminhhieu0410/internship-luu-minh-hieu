-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 25, 2025 at 11:46 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `product_tigren`
--

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `total_price` float NOT NULL,
  `status` enum('pending','paid','shipped','cancelled') NOT NULL DEFAULT 'pending',
  `created_at` date DEFAULT curdate()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `user_id`, `total_price`, `status`, `created_at`) VALUES
(1, 1, 119.97, 'paid', '2025-04-24'),
(2, 3, 29.99, 'pending', '2025-04-24'),
(3, 1, 79.99, 'shipped', '2025-04-24'),
(4, 21, 409.93, 'paid', '2025-04-25');

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `price` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `quantity`, `price`) VALUES
(1, 1, 1, 2, 29.99),
(2, 1, 2, 1, 59.99),
(3, 2, 1, 1, 29.99),
(4, 3, 3, 1, 79.99),
(5, 4, 1, 3, 29.99),
(6, 4, 3, 4, 79.99);

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `price` float NOT NULL,
  `stock` int(11) NOT NULL,
  `description` text DEFAULT NULL,
  `category` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `name`, `price`, `stock`, `description`, `category`) VALUES
(1, 'Wireless Mouse', 29.99, 100, 'Ergonomic wireless mouse', 'Electronics'),
(2, 'Gaming Keyboard', 59.99, 50, 'RGB mechanical keyboard', 'Electronics'),
(3, 'Running Shoes', 79.99, 30, 'Lightweight running shoes', 'Sportswear'),
(4, 'Wireless Mouse', 29.99, 100, 'Ergonomic wireless mouse', 'Electronics'),
(5, 'Gaming Keyboard', 59.99, 50, 'RGB mechanical keyboard', 'Electronics'),
(6, 'Running Shoes', 79.99, 30, 'Lightweight running shoes', 'Sportswear'),
(7, 'Bluetooth Headphones', 89.99, 60, 'Wireless over-ear headphones with noise cancellation', 'Electronics'),
(8, 'Smartwatch', 199.99, 25, 'Fitness tracker with heart rate monitor', 'Electronics'),
(9, 'USB-C Charger', 19.99, 200, 'Fast-charging 20W USB-C adapter', 'Electronics'),
(10, 'Portable Speaker', 49.99, 80, 'Waterproof Bluetooth speaker', 'Electronics'),
(11, 'Laptop Stand', 34.99, 40, 'Adjustable aluminum laptop stand', 'Electronics'),
(12, 'External Hard Drive', 79.99, 30, '1TB portable external storage', 'Electronics'),
(13, 'Wireless Earbuds', 69.99, 70, 'True wireless earbuds with charging case', 'Electronics'),
(14, 'Gaming Mouse Pad', 14.99, 150, 'Large RGB mouse pad', 'Electronics'),
(15, 'HDMI Cable', 12.99, 100, '4K HDMI cable, 2 meters', 'Electronics'),
(16, 'Smart TV', 399.99, 15, '55-inch 4K UHD smart television', 'Electronics'),
(17, 'Yoga Mat', 24.99, 90, 'Non-slip yoga mat with carrying strap', 'Sportswear'),
(18, 'Sports Water Bottle', 15.99, 120, 'Insulated stainless steel water bottle', 'Sportswear'),
(19, 'Gym Gloves', 19.99, 60, 'Breathable weightlifting gloves', 'Sportswear'),
(20, 'Tennis Racket', 59.99, 20, 'Lightweight carbon fiber tennis racket', 'Sportswear'),
(21, 'Cycling Helmet', 39.99, 35, 'Ventilated helmet with adjustable straps', 'Sportswear'),
(22, 'Soccer Ball', 29.99, 50, 'Size 5 professional soccer ball', 'Sportswear'),
(23, 'Fitness Resistance Bands', 22.99, 80, 'Set of 5 resistance bands with handles', 'Sportswear'),
(24, 'Running Belt', 14.99, 100, 'Adjustable running belt with phone holder', 'Sportswear'),
(25, 'Sports Sunglasses', 34.99, 45, 'Polarized sunglasses for outdoor sports', 'Sportswear'),
(26, 'Jump Rope', 12.99, 110, 'Adjustable speed jump rope', 'Sportswear'),
(27, 'Toaster Oven', 69.99, 25, 'Compact toaster oven with multiple functions', 'Appliances'),
(28, 'Electric Kettle', 39.99, 40, '1.7L stainless steel electric kettle', 'Appliances'),
(29, 'Blender', 89.99, 20, 'High-power blender with multiple speeds', 'Appliances'),
(30, 'Air Fryer', 129.99, 15, '5.8-quart digital air fryer', 'Appliances'),
(31, 'Vacuum Cleaner', 149.99, 10, 'Cordless stick vacuum cleaner', 'Appliances'),
(32, 'Microwave Oven', 99.99, 18, '700W compact microwave oven', 'Appliances'),
(33, 'Coffee Grinder', 29.99, 50, 'Electric burr coffee grinder', 'Appliances'),
(34, 'Hand Mixer', 34.99, 30, '5-speed electric hand mixer', 'Appliances'),
(35, 'Travel Backpack', 49.99, 35, 'Water-resistant backpack with USB charging port', 'Accessories'),
(36, 'Sunglasses', 29.99, 60, 'UV-protective polarized sunglasses', 'Accessories'),
(37, 'Leather Wallet', 24.99, 80, 'Slim RFID-blocking leather wallet', 'Accessories'),
(38, 'Watch', 79.99, 25, 'Stainless steel analog wristwatch', 'Accessories'),
(39, 'Travel Pillow', 19.99, 90, 'Memory foam neck pillow for travel', 'Accessories'),
(40, 'Luggage Set', 129.99, 12, '3-piece hardshell luggage set', 'Accessories'),
(41, 'Tote Bag', 39.99, 40, 'Canvas tote bag with leather handles', 'Accessories'),
(42, 'Graphic T-Shirt', 19.99, 100, 'Cotton t-shirt with printed design', 'Clothing'),
(43, 'Denim Jeans', 49.99, 50, 'Slim-fit blue denim jeans', 'Clothing'),
(44, 'Hoodie', 39.99, 60, 'Cotton-blend pullover hoodie', 'Clothing'),
(45, 'Winter Jacket', 89.99, 20, 'Insulated waterproof winter jacket', 'Clothing'),
(46, 'Sneakers', 69.99, 35, 'Casual leather sneakers', 'Clothing'),
(47, 'Baseball Cap', 24.99, 70, 'Adjustable cotton baseball cap', 'Clothing'),
(48, 'Scarf', 14.99, 85, 'Soft wool scarf for winter', 'Clothing');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `role` enum('user','admin') NOT NULL DEFAULT 'user',
  `created_at` date DEFAULT curdate(),
  `isLock` enum('0','1') DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `created_at`, `isLock`) VALUES
(1, 'John Doe', 'john@example.com', 'pass123', 'user', '2025-04-24', '0'),
(2, 'Jane Smith', 'jane@example.com', 'admin456', 'admin', '2025-04-24', '0'),
(3, 'Bob Wilson', 'bob@example.com', 'secure789', 'user', '2025-04-24', '1'),
(20, 'a', 'a@a.a', '$2b$10$HYKtmNPMGWx38tjLAZSq1.YUsn/5wSvOj.5e64EQzw6lVuGSsmMI.', 'admin', '2025-04-24', '0'),
(21, 'a', 'b@a.a', '$2b$10$fdZwbzsPnmc3Ojj3u0HdqOpIVwFK2kWpsTzJaole6Qk9.ofNqBabm', 'user', '2025-04-24', '0');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=59;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
