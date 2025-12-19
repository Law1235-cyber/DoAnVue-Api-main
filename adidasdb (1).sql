-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th10 24, 2025 lúc 01:11 AM
-- Phiên bản máy phục vụ: 10.4.32-MariaDB
-- Phiên bản PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `adidasdb`
--
CREATE DATABASE IF NOT EXISTS `adidasdb` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `adidasdb`;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `cart`
--

DROP TABLE IF EXISTS `cart`;
CREATE TABLE `cart` (
  `id` varchar(50) NOT NULL,
  `user_id` varchar(50) NOT NULL,
  `total` decimal(10,2) DEFAULT 0.00,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `cart`
--

INSERT INTO `cart` (`id`, `user_id`, `total`, `created_at`) VALUES
('6bd5ad10', '26de9f53', 0.00, '2025-11-23 05:41:20'),
('a757', '1bf4', 110.00, '2025-11-06 01:39:21');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `cart_items`
--

DROP TABLE IF EXISTS `cart_items`;
CREATE TABLE `cart_items` (
  `id` bigint(20) NOT NULL,
  `cart_id` varchar(50) DEFAULT NULL,
  `product_id` varchar(50) DEFAULT NULL,
  `product_name` varchar(255) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `price` decimal(38,2) DEFAULT NULL,
  `color_name` varchar(255) DEFAULT NULL,
  `size_value` varchar(255) DEFAULT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `cart_items`
--

INSERT INTO `cart_items` (`id`, `cart_id`, `product_id`, `product_name`, `image`, `price`, `color_name`, `size_value`, `quantity`) VALUES
(1, 'a757', '3', 'Handball Spezial Shoes', 'https://assets.adidas.com/images/e_trim/c_lpad,w_iw,h_ih/b_rgb:EAEEEF/w_180,f_auto,q_auto,fl_lossy,c_fill,g_auto/344abe967fab43f2883580d7f65d48de_9366/Handball_Spezial_Shoes_Blue_IF9532_00_plp_standard.jpg', 110.00, 'Blue (1)', '8', 1);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `collections`
--

DROP TABLE IF EXISTS `collections`;
CREATE TABLE `collections` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` varchar(500) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `video` varchar(255) DEFAULT NULL,
  `link` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `collections`
--

INSERT INTO `collections` (`id`, `name`, `description`, `image`, `video`, `link`, `created_at`) VALUES
('1', 'STAY LEEK', 'Low-profile shoes from adidas are all about comfort and style. Browse the whole collection of classic lifestyle sneakers that go with everything in your closet.', 'https://brand.assets.adidas.com/image/upload/f_auto,q_auto:best,fl_lossy/if_w_gt_800,w_800/orig_ss25_lowprofile_tokyo_tcc_can_d_b32cee98a2.jpg', NULL, '#', '2025-11-06 01:39:21'),
('2', 'adizero Running Shoes', 'Light, breathable adidas adizero running shoes propel you to the finish line whether you\'re training for a marathon or just going on your daily jog.', NULL, 'https://brand.assets.adidas.com/video/upload/f_auto:video,q_auto/if_w_gt_800,w_800/global_adizero_running_ss25_sustain_evo_sl_hp_navigation_card_teaser_1_d_8265648508.mp4', '#', '2025-11-06 01:39:21'),
('3', 'College Clothes & Shoes', 'Rep your favorite team in collegiate clothes and shoes from adidas. From official team jerseys to ball caps to socks, show your school spirit in athletic style.', 'https://brand.assets.adidas.com/image/upload/f_auto,q_auto:best,fl_lossy/if_w_gt_800,w_800/ncaa_ss25_marchmadnessreactive_elite8_texastech_crd_d_bc3cf86546.jpg', NULL, '#', '2025-11-06 01:39:21'),
('4', 'Festival Clothes & Shoes', 'Kick off the season with trending festival clothes and shoes to dial in your look. Shop fun skirts, classic sneakers, comfy tees and waist packs.', 'https://brand.assets.adidas.com/image/upload/f_auto,q_auto:best,fl_lossy/if_w_gt_800,w_800/hc_ss25_springbreakfestival_day_tcc_1_head_to_toe_mw_d_bfc1917384.jpg', NULL, '#', '2025-11-06 01:39:21');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `favorites`
--

DROP TABLE IF EXISTS `favorites`;
CREATE TABLE `favorites` (
  `id` bigint(20) NOT NULL,
  `user_id` varchar(50) NOT NULL,
  `product_id` varchar(50) NOT NULL,
  `added_date` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `favorites`
--

INSERT INTO `favorites` (`id`, `user_id`, `product_id`, `added_date`) VALUES
(1, '1', '2', '2025-11-06 01:39:21'),
(2, '1', '3', '2025-11-06 01:39:21');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `orders`
--

DROP TABLE IF EXISTS `orders`;
CREATE TABLE `orders` (
  `id` varchar(50) NOT NULL,
  `customer_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone_number` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `notes` varchar(255) DEFAULT NULL,
  `order_value` decimal(38,2) DEFAULT NULL,
  `order_date` timestamp NULL DEFAULT current_timestamp(),
  `user_id` varchar(50) DEFAULT NULL,
  `payment_method` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `orders`
--

INSERT INTO `orders` (`id`, `customer_name`, `email`, `phone_number`, `address`, `notes`, `order_value`, `order_date`, `user_id`, `payment_method`, `status`) VALUES
('476b', 'haha', 'haha@gmail.com', '000000000000000000000000', 'q', 'DA', 90.00, '2025-11-06 01:39:21', NULL, NULL, NULL),
('6d2f', 'haha', 'haha@gmail.com', '16', 'dg', 'eg', 90.00, '2025-11-06 01:39:21', NULL, NULL, NULL),
('b0d5', 'John Doe', 'john.doe@example.com', '0123456789', '123 Main St, District 1, Ho Chi Minh City', 'Please deliver in the afternoon', 1500000.00, '2025-11-06 01:39:21', NULL, NULL, NULL),
('ORD-0102e560', 'hai', 'dhai85159@gmail.com', 'q', 'q', 'q', 5000.00, '2025-11-23 09:09:28', '26de9f53', 'QR_CODE', 'PENDING'),
('ORD-054e51ae', 'hai', 'dhai85159@gmail.com', 'z', 'z', 'z', 110.00, '2025-11-23 06:28:23', '26de9f53', 'QR_CODE', 'PENDING'),
('ORD-084b93b6', 'hai', 'dhai85159@gmail.com', 'q', 'q', 'q', 5000.00, '2025-11-23 08:52:57', '26de9f53', 'QR_CODE', 'PENDING'),
('ORD-0c6d99e9', 'hai', 'dhai85159@gmail.com', 'd', 'd', 'd', 5000.00, '2025-11-23 07:10:55', '26de9f53', 'QR_CODE', 'PAID'),
('ORD-102bcf64', 'hai', 'dhai85159@gmail.com', '0867447893', '111 hẽm 331 đâ go vâp hô chi minh', 'giao nhanh cẩn thận dùng tôi', 110000.00, '2025-11-23 06:39:11', '26de9f53', 'QR_CODE', 'PENDING'),
('ORD-189d2d8d', 'hai', 'dhai85159@gmail.com', 'g', 'g', 'g', 5000.00, '2025-11-23 09:16:23', '26de9f53', 'QR_CODE', 'PENDING'),
('ORD-1b057fe9', 'hai', 'dhai85159@gmail.com', 'o', 'o', 'o', 5000.00, '2025-11-23 07:02:21', '26de9f53', 'QR_CODE', 'PENDING'),
('ORD-1d304ad3', 'hai', 'dhai85159@gmail.com', 'q', 'q', 'q', 5000.00, '2025-11-23 08:05:48', '26de9f53', 'QR_CODE', 'PENDING'),
('ORD-3f977806', 'hai', 'dhai85159@gmail.com', 's', 's', 's', 110000.00, '2025-11-23 06:34:27', '26de9f53', 'QR_CODE', 'PENDING'),
('ORD-434530e8', 'hai', 'dhai85159@gmail.com', 'g', 'g', 'g', 5000.00, '2025-11-23 09:21:04', '26de9f53', 'QR_CODE', 'PENDING'),
('ORD-4920e833', 'hai', 'dhai85159@gmail.com', '0867447893', 'GO Gò Vấp – 792 Nguyễn Kiệm, Tp HCM', 'ghi chú cần nhập', 5000.00, '2025-11-23 06:41:56', '26de9f53', 'QR_CODE', 'PENDING'),
('ORD-4eb9b2d7', 'hai', 'dhai85159@gmail.com', 's', 's', 's', 220.00, '2025-11-23 05:58:58', '26de9f53', 'QR_CODE', 'PENDING'),
('ORD-66d01802', 'hai', 'dhai85159@gmail.com', 's', 's', 's', 220.00, '2025-11-23 06:25:44', '26de9f53', 'QR_CODE', 'PAID'),
('ORD-7e4496d8', 'hai', 'dhai85159@gmail.com', 'q', 'q', 'q', 5000.00, '2025-11-23 07:46:54', '26de9f53', 'QR_CODE', 'PENDING'),
('ORD-89b2e6d8', 'hai', 'dhai85159@gmail.com', 'a', 'a', 'a', 5000.00, '2025-11-23 06:49:27', '26de9f53', 'QR_CODE', 'PENDING'),
('ORD-8c116ed7', 'hai', 'dhai85159@gmail.com', 'y', 'y', 'y', 5000.00, '2025-11-23 09:49:31', '26de9f53', 'QR_CODE', 'PENDING'),
('ORD-8d0127c9', 'hai', 'dhai85159@gmail.com', 'y', 'y', 'y', 5000.00, '2025-11-23 09:50:48', '26de9f53', 'QR_CODE', 'PAID'),
('ORD-9cad6a20', 'hai', 'dhai85159@gmail.com', 'a', 'a', 'a', 5000.00, '2025-11-24 00:08:52', '26de9f53', 'COD', 'PENDING'),
('ORD-a05a3e8c', 'hai', 'dhai85159@gmail.com', '0867447893', 'GO Gò Vấp – 792 Nguyễn Kiệm, Tp HCM', 'ghi chú cần nhập', 5000.00, '2025-11-23 06:44:57', '26de9f53', 'QR_CODE', 'PENDING'),
('ORD-a19397a9', 'hai', 'dhai85159@gmail.com', 'o', 'o', 'o', 5000.00, '2025-11-23 07:08:50', '26de9f53', 'QR_CODE', 'PAID'),
('ORD-a60047a7', 'hai', 'dhai85159@gmail.com', 'a', 'a', 'a', 90000.00, '2025-11-23 07:24:22', '26de9f53', 'QR_CODE', 'PAID'),
('ORD-ac65ec53', 'hai', 'dhai85159@gmail.com', 'd', 'd', 'd', 220.00, '2025-11-23 05:41:50', '26de9f53', 'QR_CODE', 'PENDING'),
('ORD-e5ef3530', 'hai', 'dhai85159@gmail.com', 'y', 'y', 'y', 5000.00, '2025-11-23 09:25:30', '26de9f53', 'QR_CODE', 'PENDING'),
('ORD-e84265a7', 'hai', 'dhai85159@gmail.com', 'y', 'y', 'y', 5000.00, '2025-11-23 09:46:21', '26de9f53', 'QR_CODE', 'PENDING'),
('ORD-f024e642', 'hai', 'dhai85159@gmail.com', 'y', 'y', 'y', 5000.00, '2025-11-23 09:42:29', '26de9f53', 'QR_CODE', 'PENDING');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `order_items`
--

DROP TABLE IF EXISTS `order_items`;
CREATE TABLE `order_items` (
  `id` bigint(20) NOT NULL,
  `order_id` varchar(50) DEFAULT NULL,
  `product_name` varchar(255) NOT NULL,
  `quantity` int(11) NOT NULL,
  `price` decimal(38,2) DEFAULT NULL,
  `product_id` varchar(50) DEFAULT NULL,
  `color_name` varchar(255) DEFAULT NULL,
  `size_value` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `product_name`, `quantity`, `price`, `product_id`, `color_name`, `size_value`) VALUES
(1, 'b0d5', 'Adidas Sneakers', 1, 1500000.00, '1', NULL, NULL),
(2, '6d2f', 'TOKYO SHOES', 1, 90.00, '2', NULL, NULL),
(3, '476b', 'TOKYO SHOES', 1, 90.00, '2', NULL, NULL),
(4, 'ORD-ac65ec53', 'Sản phẩm 1', 1, 110.00, '1', 'Black', '8'),
(5, 'ORD-ac65ec53', 'Sản phẩm 1', 1, 110.00, '1', 'White', '8'),
(6, 'ORD-4eb9b2d7', 'Sản phẩm 1', 1, 110.00, '1', 'Black', '8'),
(7, 'ORD-4eb9b2d7', 'Sản phẩm 1', 1, 110.00, '1', 'White', '8'),
(8, 'ORD-66d01802', 'Sản phẩm 1', 1, 110.00, '1', 'Black', '8'),
(9, 'ORD-66d01802', 'Sản phẩm 1', 1, 110.00, '1', 'White', '8'),
(10, 'ORD-054e51ae', 'Sản phẩm 1', 1, 110.00, '1', 'Black', '7'),
(11, 'ORD-3f977806', 'Sản phẩm 1', 1, 110000.00, '1', 'Black', '8.5'),
(12, 'ORD-102bcf64', 'Sản phẩm 1', 1, 110000.00, '1', 'Black', '8.5'),
(13, 'ORD-4920e833', 'Sản phẩm 1', 1, 5000.00, '1', 'White', '10'),
(14, 'ORD-a05a3e8c', 'Sản phẩm 1', 1, 5000.00, '1', 'White', '10'),
(15, 'ORD-89b2e6d8', 'Sản phẩm 1', 1, 5000.00, '1', 'White', '10'),
(16, 'ORD-1b057fe9', 'Sản phẩm 1', 1, 5000.00, '1', 'White', '10'),
(17, 'ORD-a19397a9', 'Sản phẩm 1', 1, 5000.00, '1', 'White', '10'),
(18, 'ORD-0c6d99e9', 'Sản phẩm 1', 1, 5000.00, '1', 'White', '5'),
(19, 'ORD-a60047a7', 'Sản phẩm 2', 1, 90000.00, '2', 'Pink', '5.5'),
(20, 'ORD-7e4496d8', 'Sản phẩm 1', 1, 5000.00, '1', 'White', '8.5'),
(21, 'ORD-1d304ad3', 'Sản phẩm 1', 1, 5000.00, '1', 'White', '8.5'),
(22, 'ORD-084b93b6', 'Sản phẩm 1', 1, 5000.00, '1', 'White', '8.5'),
(23, 'ORD-0102e560', 'Sản phẩm 1', 1, 5000.00, '1', 'White', '8.5'),
(24, 'ORD-189d2d8d', 'Sản phẩm 1', 1, 5000.00, '1', 'White', '6'),
(25, 'ORD-434530e8', 'Sản phẩm 1', 1, 5000.00, '1', 'White', '6'),
(26, 'ORD-e5ef3530', 'Sản phẩm 1', 1, 5000.00, '1', 'White', '6'),
(27, 'ORD-f024e642', 'Sản phẩm 1', 1, 5000.00, '1', 'White', '6'),
(28, 'ORD-e84265a7', 'Sản phẩm 1', 1, 5000.00, '1', 'White', '6'),
(29, 'ORD-8c116ed7', 'Sản phẩm 1', 1, 5000.00, '1', 'White', '6'),
(30, 'ORD-8d0127c9', 'Sản phẩm 1', 1, 5000.00, '1', 'White', '6'),
(31, 'ORD-9cad6a20', 'Sản phẩm 1', 1, 5000.00, '1', 'Black', '5');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `posts`
--

DROP TABLE IF EXISTS `posts`;
CREATE TABLE `posts` (
  `id` varchar(50) NOT NULL,
  `brand` varchar(100) NOT NULL,
  `day` varchar(100) DEFAULT NULL,
  `time` varchar(100) DEFAULT NULL,
  `title` varchar(500) NOT NULL,
  `description` text DEFAULT NULL,
  `content` longtext DEFAULT NULL,
  `image` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `posts`
--

INSERT INTO `posts` (`id`, `brand`, `day`, `time`, `title`, `description`, `content`, `image`, `created_at`) VALUES
('1', 'ADIDAS', 'January 2024', '5 minute read', 'How to buy football studs: Fit, features, field surface', 'From indoor football boots to studs for turf or grass, adidas football footwear is for every player. Get the facts on how to buy football studs that match your game.', 'Football may seem like a simple game, but with so many types of football studs to choose from, finding the right footwear can be more intimidating than facing a swift penalty kick. To find the perfect pair of studs for you, check out this guide to choose the right football boots. When it comes to footwear for the beautiful game, football studs for turf are only one of many types of football boots. Pick the right shoes for your surface of play for the perfect balance of traction, stability and speed. \nIf blazing isn\'t fast enough for you, choose X Speedportal boots made for speed. The X Speedportal comes with brand new high-speed stability system featuring carbon heel lock, a newly designed carbon propulsion system and an optimised stud configuration that brings multidimensional speed to any position.  PREDATOR boots-adidas-predator If you\'re the type of player who refuses to miss anything on the pitch, you need adidas Predator boots. These are the boots that give you the power to deliver the perfect strike, complete control over ball spin and placement, and a soft, comfortable touch. This Predator model is specifically designed to help you achieve your goals. With a range of cutting-edge technologies, these boots will give you the precision you need to hit the top bins every time.  COPA Copa-boots The adidas Copa football boots provide pure comfort and a perfect touch, free from distractions. Taking inspiration from the rich history of the Copa line, these boots are lightweight and designed to enhance your ability to create plays with a soft, seamless blend of Fusionskin leather and an adaptive textile collar. Seamless uppers featuring Fusionskin technology give you next-to-skin ball control for the trickiest manoeuvres. ', 'https://brand.assets.adidas.com/image/upload/f_auto,q_auto:best,fl_lossy/choose_football_boots_d_143_1018564_e182ba63fe.jpg', '2025-11-06 01:39:21'),
('2', 'ADIDAS', 'January 2024', '3 minute read', 'ADIDAS STAN SMITH ÔM CHÂN NHƯ THẾ NÀO? KÍCH CỠ STAN SMITH PHÙ HỢP VỚI TẤT CẢ MỌI NGƯỜI', 'Đôi giày sneaker thoải mái này hướng tới phong cách đơn giản mà hiệu quả cho tất cả mọi người — nhưng adidas Stan Smith vừa vặn với chân như thế nào? Tìm hiểu qua hướng dẫn chọn kích cỡ adidas Stan Smith chính thức của chúng tôi.', 'Stan Smith: Lịch sử ra đờiLà một tay vợt vô địch thế giới, Stan Smith đã ghi tên mình vào lịch sử bộ môn tennis khi giành được 2 danh hiệu Grand Slam đơn và 5 chiếc cúp Grand Slam đôi. Được biết đến với hình ảnh điềm tĩnh, cá tính và lạnh lùng trên sân, rõ ràng đôi giày mang tên của ông cũng có những phẩm chất tương tự.Kiểu dáng chuyên dành cho sân tennis vào thập niên 1970 đã được chuyển hóa thành đôi giày sneaker hiện đại phù hợp để đi thường ngày. Với phong cách tinh tế và các chi tiết mới mẻ, đôi giày adidas Stan Smith đã len lỏi vào trái tim của nhiều thế hệ, mang đến cho mọi outfit casual hay thanh lịch sự kết hợp hoàn hảo nhất.Việc tìm ra đôi giày Stan Smith ưng ý là do bạn tự quyết định, còn để tìm kiếm kích cỡ hoàn hảo thì hãy để chúng tôi giúp bạn một tay. Đọc tiếp để tìm hiểu thêm về các kích cỡ của adidas Stan Smith ôm chân như thế nào. \nFrom natural grass to indoor: Football boots for every field. \nWhen it comes to footwear for the beautiful game, football studs for turf are only one of many types of football boots. Pick the right shoes for your surface of play for the perfect balance of traction, stability and speed. ', 'https://brand.assets.adidas.com/image/upload/f_auto,q_auto:best,fl_lossy/stan_smith_size_guide_masthead_d_221_1029792_fb9934d368.jpg', '2025-11-06 01:39:21'),
('3', 'ADIDAS', 'May 2024', '5 minute read', 'Chạy biến tốc cho người mới bắt đầu: Bắt đầu từ đâu', 'Với người mới bắt đầu, chạy biến tốc có thể là một cách tuyệt vời để thúc đẩy động lực và tăng cường tập luyện. Nhận lời khuyên từ các chuyên gia, cùng với kế hoạch chạy biến tốc.', 'Chạy biến tốc là gì? Có lợi ích gì? Bạn đang muốn thúc đẩy buổi chạy hơn nữa? Với chạy biến tốc, người chạy ở mọi cấp độ sẽ có được 0,5 giờ chạy với động lực mới mẻ và một số lợi ích về thể hình khác. \"Chạy biến tốc\" mô tả việc cố tình thay đổi tốc độ chạy, kết hợp xen kẽ các đoạn chạy ngắn cường độ cao với những khoảng thời gian chủ động nghỉ hồi sức. Là huấn luyện viên của Golden Coast Track Club, Terrence Mahon và Jen Rhines đều thích thêm các đoạn chạy ngắn vào thói quen của họ.\"Tập luyện biến tốc thực sự là cách tốt nhất để rèn luyện hình thể, trái ngược với cách chạy dễ dàng mỗi ngày\", Mahon, người đã huấn luyện nhiều vận động viên đạt danh hiệu quốc gia và thi đấu thế giới từ thể thức 800 m đến marathon. Là huấn luyện viên cho một số vận động viên chạy đường dài hàng đầu hành tinh, Mahon đã chứng kiến các đoạn chạy nhanh giúp nâng cao thể hình của người chạy và vận động viên ở mọi cấp độ, từ người mới đến dân chuyên. Ông nói đó là vì các đoạn chạy nhanh tạo ra \"đỉnh và đáy trong quá trình điều tiết nhịp tim cũng như nỗ lực tổng thể\". Những đoạn chạy cự ly ngắn bùng nổ với cường độ cao này \"kích hoạt các cơ chế trong cơ thể giúp đốt cháy mỡ, tạo cơ bắp và cải thiện hệ thống tim mạch — được giới huấn luyện gọi là đạt tới Vo2 cực đại— nhanh hơn so với khi chạy 30 phút với nhịp tim vừa phải\". Jennifer \"Jen\" Rhines là vận động viên chạy đường dài đã 15 lần đồng hành cùng Tuyển Mỹ và thi đấu ở các hạng mục điền kinh, chạy băng đồng và chạy đường trường. Là một vận động viên chạy bộ gắn bó cả đời với đường chạy to cầu, Rhines rất thích các bài chạy biến tốc để nhanh chóng đạt được cú hích thể hình và duy trì động lực. \"Đối với tôi, chạy biến tốc khiến chạy bộ trở nên thú vị hơn. Bạn có thể theo dõi tiến độ và xem tốc độ trung bình của mình được cải thiện, điều mà tôi nghĩ bất cứ ai cũng cảm thấy háo hức\", cô chia sẻ.', 'https://brand.assets.adidas.com/image/upload/f_auto,q_auto:best,fl_lossy/1877641_seo_interval_running_for_beginners_masthead_d_221_692012_4cdf7461ea.jpg', '2025-11-06 01:39:21');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `products`
--

DROP TABLE IF EXISTS `products`;
CREATE TABLE `products` (
  `id` varchar(50) NOT NULL,
  `name` varchar(255) NOT NULL,
  `price` double DEFAULT NULL,
  `featured` tinyint(1) DEFAULT 0,
  `category` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `hover_image` varchar(255) DEFAULT NULL,
  `link` varchar(255) DEFAULT NULL,
  `rating` varchar(255) DEFAULT NULL,
  `promoCodes` text DEFAULT NULL,
  `paymentOptions` text DEFAULT NULL,
  `shipping` varchar(255) DEFAULT NULL,
  `returnsExchanges` text DEFAULT NULL,
  `sizingNote` text DEFAULT NULL,
  `description` varchar(1000) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `payment_options` varchar(1000) DEFAULT NULL,
  `promo_codes` varchar(1000) DEFAULT NULL,
  `returns_exchanges` varchar(1000) DEFAULT NULL,
  `sizing_note` varchar(1000) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `products`
--

INSERT INTO `products` (`id`, `name`, `price`, `featured`, `category`, `image`, `hover_image`, `link`, `rating`, `promoCodes`, `paymentOptions`, `shipping`, `returnsExchanges`, `sizingNote`, `description`, `created_at`, `payment_options`, `promo_codes`, `returns_exchanges`, `sizing_note`) VALUES
('1', 'SAMBA SHOES', 5000, 1, 'Giày thời trang', 'https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/51fa97b24eb5404b809c29a39a87fca4_9366/Sambae_Shoes_White_JI1349_01_standard.jpg', 'https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/a78262c770cd4f328ce7f2b14654bc59_9366/Sambae_Shoes_White_JI1349_02_standard_hover.jpg', 'samba.html', '6 out of 6 stars', 'Use code DEAL for an extra 30% off. Exclusions apply.', '4 interest-free payments available with Klarna. Learn More', 'Free shipping with Adiclun', '30 days returns and exchanges', 'True to size. We recommend ordering your usual size.', 'Premium quality shoes with comfortable fit and modern design. Perfect for everyday wear and light athletic activities.', '2025-11-06 01:39:21', NULL, NULL, NULL, NULL),
('10', 'TOKYO SHOES copy1', 90000, 1, 'Giày thể thao', 'https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/c3ed7e0662f747718a5a16fe34932d60_9366/Tokyo_Shoes_Green_JI3298_01_00_standard.jpg', 'https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/6e88efe72a8e4f20a05e8e58563d98b5_9366/Tokyo_Shoes_Green_JI3298_02_standard_hover.jpg', 'tokyo.html', '6 out of 6 stars', 'Use code DEAL for an extra 30% off. Exclusions apply.', '4 interest-free payments available with Klarna. Learn More', 'Free shipping with Adiclun', '30 days returns and exchanges', 'True to size. We recommend ordering your usual size.', 'Premium quality shoes with comfortable fit and modern design. Perfect for everyday wear and light athletic activities.', '2025-11-06 01:39:21', NULL, NULL, NULL, NULL),
('11', 'Handball Spezial Shoes copy1', 110000, 1, 'Giày thời trang', 'https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/6218f8cc55984cfe92d1a96d0110ac7e_9366/Handball_Spezial_Shoes_Black_DB3021_01_00_standard.jpg', 'https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/96c5eb48a9074ee9889aa96d0110ca89_9366/Handball_Spezial_Shoes_Black_DB3021_02_standard_hover.jpg', 'handball.html', '6 out of 6 stars', 'Use code DEAL for an extra 30% off. Exclusions apply.', '4 interest-free payments available with Klarna. Learn More', 'Free shipping with Adiclun', '30 days returns and exchanges', 'True to size. We recommend ordering your usual size.', 'Premium quality shoes with comfortable fit and modern design. Perfect for everyday wear and light athletic activities.', '2025-11-06 01:39:21', NULL, NULL, NULL, NULL),
('12', 'Samba OG Shoes copy1', 100000, 1, 'Giày thời trang', 'https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/4c70105150234ac4b948a8bf01187e0c_9366/Samba_OG_Shoes_Black_B75807_01_standard.jpg', 'https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/309a0c8f53dd45d3a3bea8bf0118aa6b_9366/Samba_OG_Shoes_Black_B75807_02_standard.jpg', 'real.html', '6 out of 6 stars', 'Use code DEAL for an extra 30% off. Exclusions apply.', '4 interest-free payments available with Klarna. Learn More', 'Free shipping with Adiclun', '30 days returns and exchanges', 'True to size. We recommend ordering your usual size.', 'Premium quality shoes with comfortable fit and modern design. Perfect for everyday wear and light athletic activities.', '2025-11-06 01:39:21', NULL, NULL, NULL, NULL),
('13', 'SAMBA SHOES copy2', 110000, 1, 'Giày thời trang', 'https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/51fa97b24eb5404b809c29a39a87fca4_9366/Sambae_Shoes_White_JI1349_01_standard.jpg', 'https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/a78262c770cd4f328ce7f2b14654bc59_9366/Sambae_Shoes_White_JI1349_02_standard_hover.jpg', 'samba.html', '6 out of 6 stars', 'Use code DEAL for an extra 30% off. Exclusions apply.', '4 interest-free payments available with Klarna. Learn More', 'Free shipping with Adiclun', '30 days returns and exchanges', 'True to size. We recommend ordering your usual size.', 'Premium quality shoes with comfortable fit and modern design. Perfect for everyday wear and light athletic activities.', '2025-11-06 01:39:21', NULL, NULL, NULL, NULL),
('14', 'TOKYO SHOES copy2', 90000, 1, 'Giày thể thao', 'https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/c3ed7e0662f747718a5a16fe34932d60_9366/Tokyo_Shoes_Green_JI3298_01_00_standard.jpg', 'https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/6e88efe72a8e4f20a05e8e58563d98b5_9366/Tokyo_Shoes_Green_JI3298_02_standard_hover.jpg', 'tokyo.html', '6 out of 6 stars', 'Use code DEAL for an extra 30% off. Exclusions apply.', '4 interest-free payments available with Klarna. Learn More', 'Free shipping with Adiclun', '30 days returns and exchanges', 'True to size. We recommend ordering your usual size.', 'Premium quality shoes with comfortable fit and modern design. Perfect for everyday wear and light athletic activities.', '2025-11-06 01:39:21', NULL, NULL, NULL, NULL),
('15', 'Handball Spezial Shoes copy2', 110000, 1, 'Giày thời trang', 'https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/6218f8cc55984cfe92d1a96d0110ac7e_9366/Handball_Spezial_Shoes_Black_DB3021_01_00_standard.jpg', 'https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/96c5eb48a9074ee9889aa96d0110ca89_9366/Handball_Spezial_Shoes_Black_DB3021_02_standard_hover.jpg', 'handball.html', '6 out of 6 stars', 'Use code DEAL for an extra 30% off. Exclusions apply.', '4 interest-free payments available with Klarna. Learn More', 'Free shipping with Adiclun', '30 days returns and exchanges', 'True to size. We recommend ordering your usual size.', 'Premium quality shoes with comfortable fit and modern design. Perfect for everyday wear and light athletic activities.', '2025-11-06 01:39:21', NULL, NULL, NULL, NULL),
('16', 'Samba OG Shoes copy2', 100000, 1, 'Giày thời trang', 'https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/4c70105150234ac4b948a8bf01187e0c_9366/Samba_OG_Shoes_Black_B75807_01_standard.jpg', 'https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/309a0c8f53dd45d3a3bea8bf0118aa6b_9366/Samba_OG_Shoes_Black_B75807_02_standard.jpg', 'real.html', '6 out of 6 stars', 'Use code DEAL for an extra 30% off. Exclusions apply.', '4 interest-free payments available with Klarna. Learn More', 'Free shipping with Adiclun', '30 days returns and exchanges', 'True to size. We recommend ordering your usual size.', 'Premium quality shoes with comfortable fit and modern design. Perfect for everyday wear and light athletic activities.', '2025-11-06 01:39:21', NULL, NULL, NULL, NULL),
('1755139903141', 'test', 10000000, 0, NULL, 'https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/c4a02015f9724a4a9391fdbded3d1b3e_9366/Arsenal_25-26_Third_Jersey_White_JI9556_21_model.jpg', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-11-06 01:39:21', NULL, NULL, NULL, NULL),
('2', 'TOKYO SHOES', 90000, 1, 'Giày thể thao', 'https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/c3ed7e0662f747718a5a16fe34932d60_9366/Tokyo_Shoes_Green_JI3298_01_00_standard.jpg', 'https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/6e88efe72a8e4f20a05e8e58563d98b5_9366/Tokyo_Shoes_Green_JI3298_02_standard_hover.jpg', 'tokyo.html', '6 out of 6 stars', 'Use code DEAL for an extra 30% off. Exclusions apply.', '4 interest-free payments available with Klarna. Learn More', 'Free shipping with Adiclun', '30 days returns and exchanges', 'True to size. We recommend ordering your usual size.', 'Premium quality shoes with comfortable fit and modern design. Perfect for everyday wear and light athletic activities.', '2025-11-06 01:39:21', NULL, NULL, NULL, NULL),
('3', 'Handball Spezial Shoes', 110000, 1, 'Giày thời trang', 'https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/6218f8cc55984cfe92d1a96d0110ac7e_9366/Handball_Spezial_Shoes_Black_DB3021_01_00_standard.jpg', 'https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/96c5eb48a9074ee9889aa96d0110ca89_9366/Handball_Spezial_Shoes_Black_DB3021_02_standard_hover.jpg', 'handball.html', '6 out of 6 stars', 'Use code DEAL for an extra 30% off. Exclusions apply.', '4 interest-free payments available with Klarna. Learn More', 'Free shipping with Adiclun', '30 days returns and exchanges', 'True to size. We recommend ordering your usual size.', 'Premium quality shoes with comfortable fit and modern design. Perfect for everyday wear and light athletic activities.', '2025-11-06 01:39:21', NULL, NULL, NULL, NULL),
('4', 'Samba OG Shoes', 100000, 1, 'Giày thời trang', 'https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/4c70105150234ac4b948a8bf01187e0c_9366/Samba_OG_Shoes_Black_B75807_01_standard.jpg', 'https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/309a0c8f53dd45d3a3bea8bf0118aa6b_9366/Samba_OG_Shoes_Black_B75807_02_standard.jpg', 'real.html', '6 out of 6 stars', 'Use code DEAL for an extra 30% off. Exclusions apply.', '4 interest-free payments available with Klarna. Learn More', 'Free shipping with Adiclun', '30 days returns and exchanges', 'True to size. We recommend ordering your usual size.', 'Premium quality shoes with comfortable fit and modern design. Perfect for everyday wear and light athletic activities.', '2025-11-06 01:39:21', NULL, NULL, NULL, NULL),
('5', 'SAMBA SHOES copy', 110000, 1, 'Giày thời trang', 'https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/51fa97b24eb5404b809c29a39a87fca4_9366/Sambae_Shoes_White_JI1349_01_standard.jpg', 'https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/a78262c770cd4f328ce7f2b14654bc59_9366/Sambae_Shoes_White_JI1349_02_standard_hover.jpg', 'samba.html', '6 out of 6 stars', 'Use code DEAL for an extra 30% off. Exclusions apply.', '4 interest-free payments available with Klarna. Learn More', 'Free shipping with Adiclun', '30 days returns and exchanges', 'True to size. We recommend ordering your usual size.', 'Premium quality shoes with comfortable fit and modern design. Perfect for everyday wear and light athletic activities.', '2025-11-06 01:39:21', NULL, NULL, NULL, NULL),
('6', 'TOKYO SHOES copy', 90000, 1, 'Giày thể thao', 'https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/c3ed7e0662f747718a5a16fe34932d60_9366/Tokyo_Shoes_Green_JI3298_01_00_standard.jpg', 'https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/6e88efe72a8e4f20a05e8e58563d98b5_9366/Tokyo_Shoes_Green_JI3298_02_standard_hover.jpg', 'tokyo.html', '6 out of 6 stars', 'Use code DEAL for an extra 30% off. Exclusions apply.', '4 interest-free payments available with Klarna. Learn More', 'Free shipping with Adiclun', '30 days returns and exchanges', 'True to size. We recommend ordering your usual size.', 'Premium quality shoes with comfortable fit and modern design. Perfect for everyday wear and light athletic activities.', '2025-11-06 01:39:21', NULL, NULL, NULL, NULL),
('7', 'Handball Spezial Shoes copy', 110000, 1, 'Giày thời trang', 'https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/6218f8cc55984cfe92d1a96d0110ac7e_9366/Handball_Spezial_Shoes_Black_DB3021_01_00_standard.jpg', 'https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/96c5eb48a9074ee9889aa96d0110ca89_9366/Handball_Spezial_Shoes_Black_DB3021_02_standard_hover.jpg', 'handball.html', '6 out of 6 stars', 'Use code DEAL for an extra 30% off. Exclusions apply.', '4 interest-free payments available with Klarna. Learn More', 'Free shipping with Adiclun', '30 days returns and exchanges', 'True to size. We recommend ordering your usual size.', 'Premium quality shoes with comfortable fit and modern design. Perfect for everyday wear and light athletic activities.', '2025-11-06 01:39:21', NULL, NULL, NULL, NULL),
('8', 'Samba OG Shoes copy', 100000, 1, 'Giày thời trang', 'https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/4c70105150234ac4b948a8bf01187e0c_9366/Samba_OG_Shoes_Black_B75807_01_standard.jpg', 'https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/309a0c8f53dd45d3a3bea8bf0118aa6b_9366/Samba_OG_Shoes_Black_B75807_02_standard.jpg', 'real.html', '6 out of 6 stars', 'Use code DEAL for an extra 30% off. Exclusions apply.', '4 interest-free payments available with Klarna. Learn More', 'Free shipping with Adiclun', '30 days returns and exchanges', 'True to size. We recommend ordering your usual size.', 'Premium quality shoes with comfortable fit and modern design. Perfect for everyday wear and light athletic activities.', '2025-11-06 01:39:21', NULL, NULL, NULL, NULL),
('9', 'SAMBA SHOES copy1', 110000, 1, 'Giày thời trang', 'https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/51fa97b24eb5404b809c29a39a87fca4_9366/Sambae_Shoes_White_JI1349_01_standard.jpg', 'https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/a78262c770cd4f328ce7f2b14654bc59_9366/Sambae_Shoes_White_JI1349_02_standard_hover.jpg', 'samba.html', '6 out of 6 stars', 'Use code DEAL for an extra 30% off. Exclusions apply.', '4 interest-free payments available with Klarna. Learn More', 'Free shipping with Adiclun', '30 days returns and exchanges', 'True to size. We recommend ordering your usual size.', 'Premium quality shoes with comfortable fit and modern design. Perfect for everyday wear and light athletic activities.', '2025-11-06 01:39:21', NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `product_colors`
--

DROP TABLE IF EXISTS `product_colors`;
CREATE TABLE `product_colors` (
  `id` bigint(20) NOT NULL,
  `product_id` varchar(50) DEFAULT NULL,
  `color_name` varchar(255) NOT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `color` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `product_colors`
--

INSERT INTO `product_colors` (`id`, `product_id`, `color_name`, `image_url`, `color`) VALUES
(1, '2', 'Green', 'https://assets.adidas.com/images/e_trim/c_lpad,w_iw,h_ih/b_rgb:EAEEEF/w_180,f_auto,q_auto,fl_lossy,c_fill,g_auto/7688baf3a97248a683442af91bb13e7c_9366/Tokyo_Shoes_Green_JI3298_00_plp_standard.jpg', NULL),
(2, '2', 'White', 'https://assets.adidas.com/images/e_trim/c_lpad,w_iw,h_ih/b_rgb:EAEEEF/w_180,f_auto,q_auto,fl_lossy,c_fill,g_auto/896566add8984f2f918aa613a988d724_9366/Tokyo_Shoes_White_JI0182_00_plp_standard.jpg', NULL),
(3, '2', 'Pink', 'https://assets.adidas.com/images/e_trim/c_lpad,w_iw,h_ih/b_rgb:EAEEEF/w_180,f_auto,q_auto,fl_lossy,c_fill,g_auto/4c720aea49204399a00eb3fb30a96a25_9366/Tokyo_Shoes_Pink_JI3297_00_plp_standard.jpg', NULL),
(4, '3', 'Black', 'https://assets.adidas.com/images/e_trim/c_lpad,w_iw,h_ih/b_rgb:EAEEEF/w_180,f_auto,q_auto,fl_lossy,c_fill,g_auto/6181237298a44c5fb07da96d0111461c_9366/Handball_Spezial_Shoes_Black_DB3021_00_plp_standard.jpg', NULL),
(5, '3', 'Grey', 'https://assets.adidas.com/images/e_trim/c_lpad,w_iw,h_ih/b_rgb:EAEEEF/w_180,f_auto,q_auto,fl_lossy,c_fill,g_auto/f6cad9d44a794cd7b2f843209e5647ef_9366/Handball_Spezial_Shoes_Grey_IF7086_00_plp_standard.jpg', NULL),
(6, '3', 'Yellow', 'https://assets.adidas.com/images/e_trim/c_lpad,w_iw,h_ih/b_rgb:EAEEEF/w_180,f_auto,q_auto,fl_lossy,c_fill,g_auto/56fcc33a770b4f44bf24e56332b66d6d_9366/Handball_Spezial_Shoes_Yellow_IF7088_00_plp_standard.jpg', NULL),
(7, '1', 'White', 'https://assets.adidas.com/images/e_trim/c_lpad,w_iw,h_ih/b_rgb:EAEEEF/w_180,f_auto,q_auto,fl_lossy,c_fill,g_auto/51fa97b24eb5404b809c29a39a87fca4_9366/Sambae_Shoes_White_JI1349_01_standard.jpg', NULL),
(8, '1', 'Black', 'https://assets.adidas.com/images/e_trim/c_lpad,w_iw,h_ih/b_rgb:EAEEEF/w_180,f_auto,q_auto,fl_lossy,c_fill,g_auto/4c70105150234ac4b948a8bf01187e0c_9366/Samba_OG_Shoes_Black_B75807_01_standard.jpg', NULL),
(9, '1', 'Green', 'https://assets.adidas.com/images/e_trim/c_lpad,w_iw,h_ih/b_rgb:EAEEEF/w_180,f_auto,q_auto,fl_lossy,c_fill,g_auto/dad0d4c4a7b84c0a8d5e3c1f8e4a8b2c_9366/Samba_OG_Shoes_Green_B75808_01_standard.jpg', NULL),
(10, '5', 'White', 'https://assets.adidas.com/images/e_trim/c_lpad,w_iw,h_ih/b_rgb:EAEEEF/w_180,f_auto,q_auto,fl_lossy,c_fill,g_auto/51fa97b24eb5404b809c29a39a87fca4_9366/Sambae_Shoes_White_JI1349_01_standard.jpg', NULL),
(11, '5', 'Black', 'https://assets.adidas.com/images/e_trim/c_lpad,w_iw,h_ih/b_rgb:EAEEEF/w_180,f_auto,q_auto,fl_lossy,c_fill,g_auto/4c70105150234ac4b948a8bf01187e0c_9366/Samba_OG_Shoes_Black_B75807_01_standard.jpg', NULL),
(12, '5', 'Green', 'https://assets.adidas.com/images/e_trim/c_lpad,w_iw,h_ih/b_rgb:EAEEEF/w_180,f_auto,q_auto,fl_lossy,c_fill,g_auto/dad0d4c4a7b84c0a8d5e3c1f8e4a8b2c_9366/Samba_OG_Shoes_Green_B75808_01_standard.jpg', NULL),
(13, '9', 'White', 'https://assets.adidas.com/images/e_trim/c_lpad,w_iw,h_ih/b_rgb:EAEEEF/w_180,f_auto,q_auto,fl_lossy,c_fill,g_auto/51fa97b24eb5404b809c29a39a87fca4_9366/Sambae_Shoes_White_JI1349_01_standard.jpg', NULL),
(14, '9', 'Black', 'https://assets.adidas.com/images/e_trim/c_lpad,w_iw,h_ih/b_rgb:EAEEEF/w_180,f_auto,q_auto,fl_lossy,c_fill,g_auto/4c70105150234ac4b948a8bf01187e0c_9366/Samba_OG_Shoes_Black_B75807_01_standard.jpg', NULL),
(15, '9', 'Green', 'https://assets.adidas.com/images/e_trim/c_lpad,w_iw,h_ih/b_rgb:EAEEEF/w_180,f_auto,q_auto,fl_lossy,c_fill,g_auto/dad0d4c4a7b84c0a8d5e3c1f8e4a8b2c_9366/Samba_OG_Shoes_Green_B75808_01_standard.jpg', NULL),
(16, '13', 'White', 'https://assets.adidas.com/images/e_trim/c_lpad,w_iw,h_ih/b_rgb:EAEEEF/w_180,f_auto,q_auto,fl_lossy,c_fill,g_auto/51fa97b24eb5404b809c29a39a87fca4_9366/Sambae_Shoes_White_JI1349_01_standard.jpg', NULL),
(17, '13', 'Black', 'https://assets.adidas.com/images/e_trim/c_lpad,w_iw,h_ih/b_rgb:EAEEEF/w_180,f_auto,q_auto,fl_lossy,c_fill,g_auto/4c70105150234ac4b948a8bf01187e0c_9366/Samba_OG_Shoes_Black_B75807_01_standard.jpg', NULL),
(18, '13', 'Green', 'https://assets.adidas.com/images/e_trim/c_lpad,w_iw,h_ih/b_rgb:EAEEEF/w_180,f_auto,q_auto,fl_lossy,c_fill,g_auto/dad0d4c4a7b84c0a8d5e3c1f8e4a8b2c_9366/Samba_OG_Shoes_Green_B75808_01_standard.jpg', NULL),
(19, '2', 'Green', 'https://assets.adidas.com/images/e_trim/c_lpad,w_iw,h_ih/b_rgb:EAEEEF/w_180,f_auto,q_auto,fl_lossy,c_fill,g_auto/7688baf3a97248a683442af91bb13e7c_9366/Tokyo_Shoes_Green_JI3298_00_plp_standard.jpg', NULL),
(20, '2', 'White', 'https://assets.adidas.com/images/e_trim/c_lpad,w_iw,h_ih/b_rgb:EAEEEF/w_180,f_auto,q_auto,fl_lossy,c_fill,g_auto/896566add8984f2f918aa613a988d724_9366/Tokyo_Shoes_White_JI0182_00_plp_standard.jpg', NULL),
(21, '2', 'Pink', 'https://assets.adidas.com/images/e_trim/c_lpad,w_iw,h_ih/b_rgb:EAEEEF/w_180,f_auto,q_auto,fl_lossy,c_fill,g_auto/4c720aea49204399a00eb3fb30a96a25_9366/Tokyo_Shoes_Pink_JI3297_00_plp_standard.jpg', NULL),
(22, '6', 'Green', 'https://assets.adidas.com/images/e_trim/c_lpad,w_iw,h_ih/b_rgb:EAEEEF/w_180,f_auto,q_auto,fl_lossy,c_fill,g_auto/7688baf3a97248a683442af91bb13e7c_9366/Tokyo_Shoes_Green_JI3298_00_plp_standard.jpg', NULL),
(23, '6', 'White', 'https://assets.adidas.com/images/e_trim/c_lpad,w_iw,h_ih/b_rgb:EAEEEF/w_180,f_auto,q_auto,fl_lossy,c_fill,g_auto/896566add8984f2f918aa613a988d724_9366/Tokyo_Shoes_White_JI0182_00_plp_standard.jpg', NULL),
(24, '6', 'Pink', 'https://assets.adidas.com/images/e_trim/c_lpad,w_iw,h_ih/b_rgb:EAEEEF/w_180,f_auto,q_auto,fl_lossy,c_fill,g_auto/4c720aea49204399a00eb3fb30a96a25_9366/Tokyo_Shoes_Pink_JI3297_00_plp_standard.jpg', NULL),
(25, '10', 'Green', 'https://assets.adidas.com/images/e_trim/c_lpad,w_iw,h_ih/b_rgb:EAEEEF/w_180,f_auto,q_auto,fl_lossy,c_fill,g_auto/7688baf3a97248a683442af91bb13e7c_9366/Tokyo_Shoes_Green_JI3298_00_plp_standard.jpg', NULL),
(26, '10', 'White', 'https://assets.adidas.com/images/e_trim/c_lpad,w_iw,h_ih/b_rgb:EAEEEF/w_180,f_auto,q_auto,fl_lossy,c_fill,g_auto/896566add8984f2f918aa613a988d724_9366/Tokyo_Shoes_White_JI0182_00_plp_standard.jpg', NULL),
(27, '10', 'Pink', 'https://assets.adidas.com/images/e_trim/c_lpad,w_iw,h_ih/b_rgb:EAEEEF/w_180,f_auto,q_auto,fl_lossy,c_fill,g_auto/4c720aea49204399a00eb3fb30a96a25_9366/Tokyo_Shoes_Pink_JI3297_00_plp_standard.jpg', NULL),
(28, '14', 'Green', 'https://assets.adidas.com/images/e_trim/c_lpad,w_iw,h_ih/b_rgb:EAEEEF/w_180,f_auto,q_auto,fl_lossy,c_fill,g_auto/7688baf3a97248a683442af91bb13e7c_9366/Tokyo_Shoes_Green_JI3298_00_plp_standard.jpg', NULL),
(29, '14', 'White', 'https://assets.adidas.com/images/e_trim/c_lpad,w_iw,h_ih/b_rgb:EAEEEF/w_180,f_auto,q_auto,fl_lossy,c_fill,g_auto/896566add8984f2f918aa613a988d724_9366/Tokyo_Shoes_White_JI0182_00_plp_standard.jpg', NULL),
(30, '14', 'Pink', 'https://assets.adidas.com/images/e_trim/c_lpad,w_iw,h_ih/b_rgb:EAEEEF/w_180,f_auto,q_auto,fl_lossy,c_fill,g_auto/4c720aea49204399a00eb3fb30a96a25_9366/Tokyo_Shoes_Pink_JI3297_00_plp_standard.jpg', NULL),
(31, '3', 'Black', 'https://assets.adidas.com/images/e_trim/c_lpad,w_iw,h_ih/b_rgb:EAEEEF/w_180,f_auto,q_auto,fl_lossy,c_fill,g_auto/6181237298a44c5fb07da96d0111461c_9366/Handball_Spezial_Shoes_Black_DB3021_00_plp_standard.jpg', NULL),
(32, '3', 'Grey', 'https://assets.adidas.com/images/e_trim/c_lpad,w_iw,h_ih/b_rgb:EAEEEF/w_180,f_auto,q_auto,fl_lossy,c_fill,g_auto/f6cad9d44a794cd7b2f843209e5647ef_9366/Handball_Spezial_Shoes_Grey_IF7086_00_plp_standard.jpg', NULL),
(33, '3', 'Yellow', 'https://assets.adidas.com/images/e_trim/c_lpad,w_iw,h_ih/b_rgb:EAEEEF/w_180,f_auto,q_auto,fl_lossy,c_fill,g_auto/56fcc33a770b4f44bf24e56332b66d6d_9366/Handball_Spezial_Shoes_Yellow_IF7088_00_plp_standard.jpg', NULL),
(34, '3', 'Blue', 'https://assets.adidas.com/images/e_trim/c_lpad,w_iw,h_ih/b_rgb:EAEEEF/w_180,f_auto,q_auto,fl_lossy,c_fill,g_auto/344abe967fab43f2883580d7f65d48de_9366/Handball_Spezial_Shoes_Blue_IF9532_00_plp_standard.jpg', NULL),
(35, '7', 'Black', 'https://assets.adidas.com/images/e_trim/c_lpad,w_iw,h_ih/b_rgb:EAEEEF/w_180,f_auto,q_auto,fl_lossy,c_fill,g_auto/6181237298a44c5fb07da96d0111461c_9366/Handball_Spezial_Shoes_Black_DB3021_00_plp_standard.jpg', NULL),
(36, '7', 'Grey', 'https://assets.adidas.com/images/e_trim/c_lpad,w_iw,h_ih/b_rgb:EAEEEF/w_180,f_auto,q_auto,fl_lossy,c_fill,g_auto/f6cad9d44a794cd7b2f843209e5647ef_9366/Handball_Spezial_Shoes_Grey_IF7086_00_plp_standard.jpg', NULL),
(37, '7', 'Yellow', 'https://assets.adidas.com/images/e_trim/c_lpad,w_iw,h_ih/b_rgb:EAEEEF/w_180,f_auto,q_auto,fl_lossy,c_fill,g_auto/56fcc33a770b4f44bf24e56332b66d6d_9366/Handball_Spezial_Shoes_Yellow_IF7088_00_plp_standard.jpg', NULL),
(38, '7', 'Blue', 'https://assets.adidas.com/images/e_trim/c_lpad,w_iw,h_ih/b_rgb:EAEEEF/w_180,f_auto,q_auto,fl_lossy,c_fill,g_auto/344abe967fab43f2883580d7f65d48de_9366/Handball_Spezial_Shoes_Blue_IF9532_00_plp_standard.jpg', NULL),
(39, '11', 'Black', 'https://assets.adidas.com/images/e_trim/c_lpad,w_iw,h_ih/b_rgb:EAEEEF/w_180,f_auto,q_auto,fl_lossy,c_fill,g_auto/6181237298a44c5fb07da96d0111461c_9366/Handball_Spezial_Shoes_Black_DB3021_00_plp_standard.jpg', NULL),
(40, '11', 'Grey', 'https://assets.adidas.com/images/e_trim/c_lpad,w_iw,h_ih/b_rgb:EAEEEF/w_180,f_auto,q_auto,fl_lossy,c_fill,g_auto/f6cad9d44a794cd7b2f843209e5647ef_9366/Handball_Spezial_Shoes_Grey_IF7086_00_plp_standard.jpg', NULL),
(41, '11', 'Yellow', 'https://assets.adidas.com/images/e_trim/c_lpad,w_iw,h_ih/b_rgb:EAEEEF/w_180,f_auto,q_auto,fl_lossy,c_fill,g_auto/56fcc33a770b4f44bf24e56332b66d6d_9366/Handball_Spezial_Shoes_Yellow_IF7088_00_plp_standard.jpg', NULL),
(42, '11', 'Blue', 'https://assets.adidas.com/images/e_trim/c_lpad,w_iw,h_ih/b_rgb:EAEEEF/w_180,f_auto,q_auto,fl_lossy,c_fill,g_auto/344abe967fab43f2883580d7f65d48de_9366/Handball_Spezial_Shoes_Blue_IF9532_00_plp_standard.jpg', NULL),
(43, '15', 'Black', 'https://assets.adidas.com/images/e_trim/c_lpad,w_iw,h_ih/b_rgb:EAEEEF/w_180,f_auto,q_auto,fl_lossy,c_fill,g_auto/6181237298a44c5fb07da96d0111461c_9366/Handball_Spezial_Shoes_Black_DB3021_00_plp_standard.jpg', NULL),
(44, '15', 'Grey', 'https://assets.adidas.com/images/e_trim/c_lpad,w_iw,h_ih/b_rgb:EAEEEF/w_180,f_auto,q_auto,fl_lossy,c_fill,g_auto/f6cad9d44a794cd7b2f843209e5647ef_9366/Handball_Spezial_Shoes_Grey_IF7086_00_plp_standard.jpg', NULL),
(45, '15', 'Yellow', 'https://assets.adidas.com/images/e_trim/c_lpad,w_iw,h_ih/b_rgb:EAEEEF/w_180,f_auto,q_auto,fl_lossy,c_fill,g_auto/56fcc33a770b4f44bf24e56332b66d6d_9366/Handball_Spezial_Shoes_Yellow_IF7088_00_plp_standard.jpg', NULL),
(46, '15', 'Blue', 'https://assets.adidas.com/images/e_trim/c_lpad,w_iw,h_ih/b_rgb:EAEEEF/w_180,f_auto,q_auto,fl_lossy,c_fill,g_auto/344abe967fab43f2883580d7f65d48de_9366/Handball_Spezial_Shoes_Blue_IF9532_00_plp_standard.jpg', NULL),
(47, '4', 'Black', 'https://assets.adidas.com/images/e_trim/c_lpad,w_iw,h_ih/b_rgb:EAEEEF/w_180,f_auto,q_auto,fl_lossy,c_fill,g_auto/4c70105150234ac4b948a8bf01187e0c_9366/Samba_OG_Shoes_Black_B75807_01_standard.jpg', NULL),
(48, '4', 'White', 'https://assets.adidas.com/images/e_trim/c_lpad,w_iw,h_ih/b_rgb:EAEEEF/w_180,f_auto,q_auto,fl_lossy,c_fill,g_auto/51fa97b24eb5404b809c29a39a87fca4_9366/Sambae_Shoes_White_JI1349_01_standard.jpg', NULL),
(49, '4', 'Green', 'https://assets.adidas.com/images/e_trim/c_lpad,w_iw,h_ih/b_rgb:EAEEEF/w_180,f_auto,q_auto,fl_lossy,c_fill,g_auto/dad0d4c4a7b84c0a8d5e3c1f8e4a8b2c_9366/Samba_OG_Shoes_Green_B75808_01_standard.jpg', NULL),
(50, '8', 'Black', 'https://assets.adidas.com/images/e_trim/c_lpad,w_iw,h_ih/b_rgb:EAEEEF/w_180,f_auto,q_auto,fl_lossy,c_fill,g_auto/4c70105150234ac4b948a8bf01187e0c_9366/Samba_OG_Shoes_Black_B75807_01_standard.jpg', NULL),
(51, '8', 'White', 'https://assets.adidas.com/images/e_trim/c_lpad,w_iw,h_ih/b_rgb:EAEEEF/w_180,f_auto,q_auto,fl_lossy,c_fill,g_auto/51fa97b24eb5404b809c29a39a87fca4_9366/Sambae_Shoes_White_JI1349_01_standard.jpg', NULL),
(52, '8', 'Green', 'https://assets.adidas.com/images/e_trim/c_lpad,w_iw,h_ih/b_rgb:EAEEEF/w_180,f_auto,q_auto,fl_lossy,c_fill,g_auto/dad0d4c4a7b84c0a8d5e3c1f8e4a8b2c_9366/Samba_OG_Shoes_Green_B75808_01_standard.jpg', NULL),
(53, '12', 'Black', 'https://assets.adidas.com/images/e_trim/c_lpad,w_iw,h_ih/b_rgb:EAEEEF/w_180,f_auto,q_auto,fl_lossy,c_fill,g_auto/4c70105150234ac4b948a8bf01187e0c_9366/Samba_OG_Shoes_Black_B75807_01_standard.jpg', NULL),
(54, '12', 'White', 'https://assets.adidas.com/images/e_trim/c_lpad,w_iw,h_ih/b_rgb:EAEEEF/w_180,f_auto,q_auto,fl_lossy,c_fill,g_auto/51fa97b24eb5404b809c29a39a87fca4_9366/Sambae_Shoes_White_JI1349_01_standard.jpg', NULL),
(55, '12', 'Green', 'https://assets.adidas.com/images/e_trim/c_lpad,w_iw,h_ih/b_rgb:EAEEEF/w_180,f_auto,q_auto,fl_lossy,c_fill,g_auto/dad0d4c4a7b84c0a8d5e3c1f8e4a8b2c_9366/Samba_OG_Shoes_Green_B75808_01_standard.jpg', NULL),
(56, '16', 'Black', 'https://assets.adidas.com/images/e_trim/c_lpad,w_iw,h_ih/b_rgb:EAEEEF/w_180,f_auto,q_auto,fl_lossy,c_fill,g_auto/4c70105150234ac4b948a8bf01187e0c_9366/Samba_OG_Shoes_Black_B75807_01_standard.jpg', NULL),
(57, '16', 'White', 'https://assets.adidas.com/images/e_trim/c_lpad,w_iw,h_ih/b_rgb:EAEEEF/w_180,f_auto,q_auto,fl_lossy,c_fill,g_auto/51fa97b24eb5404b809c29a39a87fca4_9366/Sambae_Shoes_White_JI1349_01_standard.jpg', NULL),
(58, '16', 'Green', 'https://assets.adidas.com/images/e_trim/c_lpad,w_iw,h_ih/b_rgb:EAEEEF/w_180,f_auto,q_auto,fl_lossy,c_fill,g_auto/dad0d4c4a7b84c0a8d5e3c1f8e4a8b2c_9366/Samba_OG_Shoes_Green_B75808_01_standard.jpg', NULL),
(59, '2', 'Yellow', 'https://assets.adidas.com/images/e_trim/c_lpad,w_iw,h_ih/b_rgb:EAEEEF/w_180,f_auto,q_auto,fl_lossy,c_fill,g_auto/0dbb588b9a5e4f92967917f426c1688f_9366/Tokyo_Shoes_Yellow_JI3299_00_plp_standard.jpg', NULL),
(60, '2', 'Off White', 'https://assets.adidas.com/images/e_trim/c_lpad,w_iw,h_ih/b_rgb:EAEEEF/w_180,f_auto,q_auto,fl_lossy,c_fill,g_auto/ce3372d5ec1f46e78692ca1372cb42b7_9366/Tokyo_Shoes_White_JI3300_00_plp_standard.jpg', NULL),
(61, '2', 'Cream', 'https://assets.adidas.com/images/e_trim/c_lpad,w_iw,h_ih/b_rgb:EAEEEF/w_180,f_auto,q_auto,fl_lossy,c_fill,g_auto/0da0718ac2e04ada9d413aed0e925610_9366/Tokyo_Shoes_White_JP9704_00_plp_standard.jpg', NULL),
(62, '2', 'Light Grey', 'https://assets.adidas.com/images/e_trim/c_lpad,w_iw,h_ih/b_rgb:EAEEEF/w_180,f_auto,q_auto,fl_lossy,c_fill,g_auto/765824af54da427ea5983a2f3022421d_9366/Tokyo_Shoes_White_JP9705_00_plp_standard.jpg', NULL),
(63, '3', 'Blue (1)', 'https://assets.adidas.com/images/e_trim/c_lpad,w_iw,h_ih/b_rgb:EAEEEF/w_180,f_auto,q_auto,fl_lossy,c_fill,g_auto/344abe967fab43f2883580d7f65d48de_9366/Handball_Spezial_Shoes_Blue_IF9532_00_plp_standard.jpg', NULL),
(64, '3', 'Green (1)', 'https://assets.adidas.com/images/e_trim/c_lpad,w_iw,h_ih/b_rgb:EAEEEF/w_180,f_auto,q_auto,fl_lossy,c_fill,g_auto/22dc71520e47450c9593d105d4fccac0_9366/Handball_Spezial_Shoes_Green_JH5438_00_plp_standard.jpg', NULL),
(65, '3', 'Blue (2)', 'https://assets.adidas.com/images/e_trim/c_lpad,w_iw,h_ih/b_rgb:EAEEEF/w_180,f_auto,q_auto,fl_lossy,c_fill,g_auto/6483e5af55c4488ba2c1232754962a65_9366/Handball_Spezial_Shoes_Blue_JH5437_00_plp_standard.jpg', NULL),
(66, '3', 'Brown', 'https://assets.adidas.com/images/e_trim/c_lpad,w_iw,h_ih/b_rgb:EAEEEF/w_180,f_auto,q_auto,fl_lossy,c_fill,g_auto/9c5ed896022b4b9c97d80447754678a0_9366/Handball_Spezial_Shoes_Brown_JH5435_00_plp_standard.jpg', NULL),
(67, '3', 'Green (2)', 'https://assets.adidas.com/images/e_trim/c_lpad,w_iw,h_ih/b_rgb:EAEEEF/w_180,f_auto,q_auto,fl_lossy,c_fill,g_auto/0f8317e5d94441ae805eda67b3f6ac6b_9366/Handball_Spezial_Shoes_Green_IG6192_00_plp_standard.jpg', NULL),
(68, '3', 'Blue (3)', 'https://assets.adidas.com/images/e_trim/c_lpad,w_iw,h_ih/b_rgb:EAEEEF/w_180,f_auto,q_auto,fl_lossy,c_fill,g_auto/c7e877a1841c47559465a96d010f344a_9366/Handball_Spezial_Shoes_Blue_BD7633_00_plp_standard.jpg', NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `product_images`
--

DROP TABLE IF EXISTS `product_images`;
CREATE TABLE `product_images` (
  `id` bigint(20) NOT NULL,
  `product_id` varchar(50) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `image_order` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `product_images`
--

INSERT INTO `product_images` (`id`, `product_id`, `image_url`, `image_order`) VALUES
(1, '1', 'https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/51fa97b24eb5404b809c29a39a87fca4_9366/Sambae_Shoes_White_JI1349_01_standard.jpg', 0),
(2, '1', 'https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/a78262c770cd4f328ce7f2b14654bc59_9366/Sambae_Shoes_White_JI1349_02_standard_hover.jpg', 1),
(3, '1', 'https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/a164d2894c4f4adc9b31b6feaf151ed4_9366/Sambae_Shoes_White_JI1349_03_standard.jpg', 2),
(4, '2', 'https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/c3ed7e0662f747718a5a16fe34932d60_9366/Tokyo_Shoes_Green_JI3298_01_00_standard.jpg', 0),
(5, '2', 'https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/6e88efe72a8e4f20a05e8e58563d98b5_9366/Tokyo_Shoes_Green_JI3298_02_standard_hover.jpg', 1),
(6, '2', 'https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/cd8113797337463990cbb07cba3d3980_9366/Tokyo_Shoes_Green_JI3298_03_standard.jpg', 2),
(7, '3', 'https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/6218f8cc55984cfe92d1a96d0110ac7e_9366/Handball_Spezial_Shoes_Black_DB3021_01_00_standard.jpg', 0),
(8, '3', 'https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/96c5eb48a9074ee9889aa96d0110ca89_9366/Handball_Spezial_Shoes_Black_DB3021_02_standard_hover.jpg', 1),
(9, '1755139903141', 'https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/c4a02015f9724a4a9391fdbded3d1b3e_9366/Arsenal_25-26_Third_Jersey_White_JI9556_21_model.jpg', 0),
(10, '4', 'https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/4c70105150234ac4b948a8bf01187e0c_9366/Samba_OG_Shoes_Black_B75807_01_standard.jpg', 0),
(11, '4', 'https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/309a0c8f53dd45d3a3bea8bf0118aa6b_9366/Samba_OG_Shoes_Black_B75807_02_standard.jpg', 1),
(12, '4', 'https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/8a8b8c8d9e0f1a2b3c4d5e6f7a8b9c0d_9366/Samba_OG_Shoes_Black_B75807_03_standard.jpg', 2),
(13, '5', 'https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/51fa97b24eb5404b809c29a39a87fca4_9366/Sambae_Shoes_White_JI1349_01_standard.jpg', 0),
(14, '5', 'https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/a78262c770cd4f328ce7f2b14654bc59_9366/Sambae_Shoes_White_JI1349_02_standard_hover.jpg', 1),
(15, '5', 'https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/a164d2894c4f4adc9b31b6feaf151ed4_9366/Sambae_Shoes_White_JI1349_03_standard.jpg', 2),
(16, '3', 'https://assets.adidas.com/images/e_trim/c_lpad,w_iw,h_ih/b_rgb:EAEEEF/w_180,f_auto,q_auto,fl_lossy,c_fill,g_auto/6181237298a44c5fb07da96d0111461c_9366/Handball_Spezial_Shoes_Black_DB3021_00_plp_standard.jpg', 2),
(17, '4', 'https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/9d87bb33ae164cc38058a8bd00ef61d6_9366/Samba_OG_Shoes_Black_B75807_010_hover_standard.jpg', 1);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `product_sizes`
--

DROP TABLE IF EXISTS `product_sizes`;
CREATE TABLE `product_sizes` (
  `id` bigint(20) NOT NULL,
  `product_id` varchar(50) DEFAULT NULL,
  `size_value` varchar(255) NOT NULL,
  `size` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `product_sizes`
--

INSERT INTO `product_sizes` (`id`, `product_id`, `size_value`, `size`) VALUES
(1, '1', '5', NULL),
(2, '1', '5.5', NULL),
(3, '1', '6', NULL),
(4, '1', '6.5', NULL),
(5, '1', '7', NULL),
(6, '1', '7.5', NULL),
(7, '1', '8', NULL),
(8, '1', '8.5', NULL),
(9, '1', '9', NULL),
(10, '1', '9.5', NULL),
(11, '1', '10', NULL),
(12, '1', '10.5', NULL),
(13, '1', '11', NULL),
(14, '2', '5', NULL),
(15, '2', '5.5', NULL),
(16, '2', '6', NULL),
(17, '2', '6.5', NULL),
(18, '2', '7', NULL),
(19, '2', '7.5', NULL),
(20, '2', '8', NULL),
(21, '2', '8.5', NULL),
(22, '2', '9', NULL),
(23, '2', '9.5', NULL),
(24, '2', '10', NULL),
(25, '2', '10.5', NULL),
(26, '2', '11', NULL),
(27, '3', '5', NULL),
(28, '3', '5.5', NULL),
(29, '3', '6', NULL),
(30, '3', '6.5', NULL),
(31, '3', '7', NULL),
(32, '3', '7.5', NULL),
(33, '3', '8', NULL),
(34, '3', '8.5', NULL),
(35, '3', '9', NULL),
(36, '3', '9.5', NULL),
(37, '3', '10', NULL),
(38, '3', '10.5', NULL),
(39, '3', '11', NULL),
(40, '1', '5', NULL),
(41, '1', '5.5', NULL),
(42, '1', '6', NULL),
(43, '1', '6.5', NULL),
(44, '1', '7', NULL),
(45, '1', '7.5', NULL),
(46, '1', '8', NULL),
(47, '1', '8.5', NULL),
(48, '1', '9', NULL),
(49, '1', '9.5', NULL),
(50, '1', '10', NULL),
(51, '1', '10.5', NULL),
(52, '1', '11', NULL),
(53, '2', '5', NULL),
(54, '2', '5.5', NULL),
(55, '2', '6', NULL),
(56, '2', '6.5', NULL),
(57, '2', '7', NULL),
(58, '2', '7.5', NULL),
(59, '2', '8', NULL),
(60, '2', '8.5', NULL),
(61, '2', '9', NULL),
(62, '2', '9.5', NULL),
(63, '2', '10', NULL),
(64, '2', '10.5', NULL),
(65, '2', '11', NULL),
(66, '3', '5', NULL),
(67, '3', '5.5', NULL),
(68, '3', '6', NULL),
(69, '3', '6.5', NULL),
(70, '3', '7', NULL),
(71, '3', '7.5', NULL),
(72, '3', '8', NULL),
(73, '3', '8.5', NULL),
(74, '3', '9', NULL),
(75, '3', '9.5', NULL),
(76, '3', '10', NULL),
(77, '3', '10.5', NULL),
(78, '3', '11', NULL),
(79, '4', '5', NULL),
(80, '4', '5.5', NULL),
(81, '4', '6', NULL),
(82, '4', '6.5', NULL),
(83, '4', '7', NULL),
(84, '4', '7.5', NULL),
(85, '4', '8', NULL),
(86, '4', '8.5', NULL),
(87, '4', '9', NULL),
(88, '4', '9.5', NULL),
(89, '4', '10', NULL),
(90, '4', '10.5', NULL),
(91, '4', '11', NULL),
(92, '5', '5', NULL),
(93, '5', '5.5', NULL),
(94, '5', '6', NULL),
(95, '5', '6.5', NULL),
(96, '5', '7', NULL),
(97, '5', '7.5', NULL),
(98, '5', '8', NULL),
(99, '5', '8.5', NULL),
(100, '5', '9', NULL),
(101, '5', '9.5', NULL),
(102, '5', '10', NULL),
(103, '5', '10.5', NULL),
(104, '5', '11', NULL),
(105, '6', '5', NULL),
(106, '6', '5.5', NULL),
(107, '6', '6', NULL),
(108, '6', '6.5', NULL),
(109, '6', '7', NULL),
(110, '6', '7.5', NULL),
(111, '6', '8', NULL),
(112, '6', '8.5', NULL),
(113, '6', '9', NULL),
(114, '6', '9.5', NULL),
(115, '6', '10', NULL),
(116, '6', '10.5', NULL),
(117, '6', '11', NULL),
(118, '7', '5', NULL),
(119, '7', '5.5', NULL),
(120, '7', '6', NULL),
(121, '7', '6.5', NULL),
(122, '7', '7', NULL),
(123, '7', '7.5', NULL),
(124, '7', '8', NULL),
(125, '7', '8.5', NULL),
(126, '7', '9', NULL),
(127, '7', '9.5', NULL),
(128, '7', '10', NULL),
(129, '7', '10.5', NULL),
(130, '7', '11', NULL),
(131, '8', '5', NULL),
(132, '8', '5.5', NULL),
(133, '8', '6', NULL),
(134, '8', '6.5', NULL),
(135, '8', '7', NULL),
(136, '8', '7.5', NULL),
(137, '8', '8', NULL),
(138, '8', '8.5', NULL),
(139, '8', '9', NULL),
(140, '8', '9.5', NULL),
(141, '8', '10', NULL),
(142, '8', '10.5', NULL),
(143, '8', '11', NULL),
(144, '9', '5', NULL),
(145, '9', '5.5', NULL),
(146, '9', '6', NULL),
(147, '9', '6.5', NULL),
(148, '9', '7', NULL),
(149, '9', '7.5', NULL),
(150, '9', '8', NULL),
(151, '9', '8.5', NULL),
(152, '9', '9', NULL),
(153, '9', '9.5', NULL),
(154, '9', '10', NULL),
(155, '9', '10.5', NULL),
(156, '9', '11', NULL),
(157, '10', '5', NULL),
(158, '10', '5.5', NULL),
(159, '10', '6', NULL),
(160, '10', '6.5', NULL),
(161, '10', '7', NULL),
(162, '10', '7.5', NULL),
(163, '10', '8', NULL),
(164, '10', '8.5', NULL),
(165, '10', '9', NULL),
(166, '10', '9.5', NULL),
(167, '10', '10', NULL),
(168, '10', '10.5', NULL),
(169, '10', '11', NULL),
(170, '11', '5', NULL),
(171, '11', '5.5', NULL),
(172, '11', '6', NULL),
(173, '11', '6.5', NULL),
(174, '11', '7', NULL),
(175, '11', '7.5', NULL),
(176, '11', '8', NULL),
(177, '11', '8.5', NULL),
(178, '11', '9', NULL),
(179, '11', '9.5', NULL),
(180, '11', '10', NULL),
(181, '11', '10.5', NULL),
(182, '11', '11', NULL),
(183, '12', '5', NULL),
(184, '12', '5.5', NULL),
(185, '12', '6', NULL),
(186, '12', '6.5', NULL),
(187, '12', '7', NULL),
(188, '12', '7.5', NULL),
(189, '12', '8', NULL),
(190, '12', '8.5', NULL),
(191, '12', '9', NULL),
(192, '12', '9.5', NULL),
(193, '12', '10', NULL),
(194, '12', '10.5', NULL),
(195, '12', '11', NULL),
(196, '13', '5', NULL),
(197, '13', '5.5', NULL),
(198, '13', '6', NULL),
(199, '13', '6.5', NULL),
(200, '13', '7', NULL),
(201, '13', '7.5', NULL),
(202, '13', '8', NULL),
(203, '13', '8.5', NULL),
(204, '13', '9', NULL),
(205, '13', '9.5', NULL),
(206, '13', '10', NULL),
(207, '13', '10.5', NULL),
(208, '13', '11', NULL),
(209, '14', '5', NULL),
(210, '14', '5.5', NULL),
(211, '14', '6', NULL),
(212, '14', '6.5', NULL),
(213, '14', '7', NULL),
(214, '14', '7.5', NULL),
(215, '14', '8', NULL),
(216, '14', '8.5', NULL),
(217, '14', '9', NULL),
(218, '14', '9.5', NULL),
(219, '14', '10', NULL),
(220, '14', '10.5', NULL),
(221, '14', '11', NULL),
(222, '15', '5', NULL),
(223, '15', '5.5', NULL),
(224, '15', '6', NULL),
(225, '15', '6.5', NULL),
(226, '15', '7', NULL),
(227, '15', '7.5', NULL),
(228, '15', '8', NULL),
(229, '15', '8.5', NULL),
(230, '15', '9', NULL),
(231, '15', '9.5', NULL),
(232, '15', '10', NULL),
(233, '15', '10.5', NULL),
(234, '15', '11', NULL),
(235, '16', '5', NULL),
(236, '16', '5.5', NULL),
(237, '16', '6', NULL),
(238, '16', '6.5', NULL),
(239, '16', '7', NULL),
(240, '16', '7.5', NULL),
(241, '16', '8', NULL),
(242, '16', '8.5', NULL),
(243, '16', '9', NULL),
(244, '16', '9.5', NULL),
(245, '16', '10', NULL),
(246, '16', '10.5', NULL),
(247, '16', '11', NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `product_videos`
--

DROP TABLE IF EXISTS `product_videos`;
CREATE TABLE `product_videos` (
  `id` bigint(20) NOT NULL,
  `product_id` varchar(50) NOT NULL,
  `video_url` varchar(255) NOT NULL,
  `video_order` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `product_videos`
--

INSERT INTO `product_videos` (`id`, `product_id`, `video_url`, `video_order`) VALUES
(1, '1', 'https://assets.adidas.com/videos/ar_1,w_720,c_fill,q_auto,f_auto/4dd31525f4d44acdbb538cec01f2b962_d98c/Sambae_Shoes_White_JI1349_video.mp4', 0),
(2, '2', 'https://assets.adidas.com/videos/ar_1,w_720,c_fill,q_auto,f_auto/dfe737c8c8c046549c716a19ad83c306_d98c/Tokyo_Shoes_Green_JI3298_video.mp4', 0),
(3, '3', 'https://assets.adidas.com/videos/ar_1,w_720,c_fill,q_auto,f_auto/b8ef6fedcf9d416d9daf33f43a5275ec_d98c/Handball_Spezial_Shoes_Black_DB3021_video.mp4', 0),
(4, '3', 'https://assets.adidas.com/videos/ar_1,w_720,c_fill,q_auto,f_auto/de084c67b860496fb36a21e0587e3d6c_d98c/Handball_Spezial_Shoes_Black_DB3021_video.mp4', 1),
(5, '4', 'https://assets.adidas.com/videos/ar_1,w_720,c_fill,q_auto,f_auto/fc345191b38f4de4bb11a8ab01067edc_d98c/Samba_OG_Shoes_Black_B75807_video.mp4', 0),
(6, '4', 'https://assets.adidas.com/videos/ar_1,w_720,c_fill,q_auto,f_auto/fc345191b38f4de4bb11a8ab01067edc_d98c/Samba_OG_Shoes_Black_B75807_video.mp4', 1);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` varchar(50) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `is_admin` tinyint(1) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `account_locked_until` datetime(6) DEFAULT NULL,
  `email_verification_expires` datetime(6) DEFAULT NULL,
  `email_verification_token` varchar(255) DEFAULT NULL,
  `email_verified` bit(1) DEFAULT NULL,
  `is_2fa_enabled` bit(1) DEFAULT NULL,
  `last_login` datetime(6) DEFAULT NULL,
  `login_attempts` int(11) DEFAULT NULL,
  `password_changed_at` datetime(6) DEFAULT NULL,
  `password_reset_expires` datetime(6) DEFAULT NULL,
  `password_reset_token` varchar(255) DEFAULT NULL,
  `two_factor_secret` varchar(255) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `is_admin`, `created_at`, `account_locked_until`, `email_verification_expires`, `email_verification_token`, `email_verified`, `is_2fa_enabled`, `last_login`, `login_attempts`, `password_changed_at`, `password_reset_expires`, `password_reset_token`, `two_factor_secret`, `updated_at`) VALUES
('1', 'Admin User', 'k336655@gmail.com', 'k336655', 1, '2025-11-06 01:39:21', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('1621', 'chi', 'chi@gmail.com', 'chi123', 0, '2025-11-06 01:39:21', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('1ac8', 'Dung', 'Dung123@gg.cc', '123', 0, '2025-11-06 01:39:21', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('1bf4', 'test', 't@gmail.com', 't123', 0, '2025-11-06 01:39:21', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('26de9f53', 'hai', 'dhai85159@gmail.com', 'hai112005@', 0, '2025-11-23 05:39:33', NULL, '2025-11-24 12:39:33.000000', '96ffc4e7-c406-40bb-aeab-28b0cce86be5', b'1', b'0', '2025-11-23 12:41:17.000000', 0, NULL, NULL, NULL, NULL, '2025-11-23 12:41:17.000000'),
('4927', 'q', 'q@q.q', 'q', 0, '2025-11-06 01:39:21', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('4c32', 'r', 'r@r.r', 'r', 0, '2025-11-06 01:39:21', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('66f2', 'k', 'k11@gmail.com', 'k11', 0, '2025-11-06 01:39:21', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('7b8f', 'test', 'test@gmail.com', 'test123', 0, '2025-11-06 01:39:21', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('a470', 'Dun', 'Dung@h.h', '123', 0, '2025-11-06 01:39:21', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('be00', 'eee', 'eee@e.e', 'eee', 0, '2025-11-06 01:39:21', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('bfab', 'k', 'k123@gmail.com', 'k123', 0, '2025-11-06 01:39:21', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('c2b5', 'khoa', 'khoa@gmail.com', 'khoa123', 0, '2025-11-06 01:39:21', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('cd28', 'hhh', 'hhh@gmail.com', 'hhh123', 0, '2025-11-06 01:39:21', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('da5e', 'ee', 'ee@e.e', 'ee', 0, '2025-11-06 01:39:21', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('dc45', 'll', 'll@gmail.com', 'll123', 0, '2025-11-06 01:39:21', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('e1a3', 'lala', 'lala123@gmail.com', 'lala123', 0, '2025-11-06 01:39:21', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `vouchers`
--

DROP TABLE IF EXISTS `vouchers`;
CREATE TABLE `vouchers` (
  `id` bigint(20) NOT NULL,
  `active` bit(1) DEFAULT NULL,
  `code` varchar(50) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `discount_type` varchar(20) NOT NULL,
  `discount_value` double NOT NULL,
  `end_date` datetime(6) DEFAULT NULL,
  `max_discount` double DEFAULT NULL,
  `min_order_value` double DEFAULT NULL,
  `start_date` datetime(6) DEFAULT NULL,
  `usage_limit` int(11) DEFAULT NULL,
  `used_count` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `cart`
--
ALTER TABLE `cart`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Chỉ mục cho bảng `cart_items`
--
ALTER TABLE `cart_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `cart_id` (`cart_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Chỉ mục cho bảng `collections`
--
ALTER TABLE `collections`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `favorites`
--
ALTER TABLE `favorites`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_user_product` (`user_id`,`product_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Chỉ mục cho bảng `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_orders_email` (`email`),
  ADD KEY `idx_orders_user_id` (`user_id`);

--
-- Chỉ mục cho bảng `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Chỉ mục cho bảng `posts`
--
ALTER TABLE `posts`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_products_category` (`category`),
  ADD KEY `idx_products_featured` (`featured`),
  ADD KEY `idx_products_price` (`price`);

--
-- Chỉ mục cho bảng `product_colors`
--
ALTER TABLE `product_colors`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_product_colors_product_id` (`product_id`);

--
-- Chỉ mục cho bảng `product_images`
--
ALTER TABLE `product_images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_product_images_product_id` (`product_id`);

--
-- Chỉ mục cho bảng `product_sizes`
--
ALTER TABLE `product_sizes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_product_sizes_product_id` (`product_id`);

--
-- Chỉ mục cho bảng `product_videos`
--
ALTER TABLE `product_videos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_product_videos_product_id` (`product_id`);

--
-- Chỉ mục cho bảng `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_users_email` (`email`);

--
-- Chỉ mục cho bảng `vouchers`
--
ALTER TABLE `vouchers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UK30ftp2biebbvpik8e49wlmady` (`code`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `cart_items`
--
ALTER TABLE `cart_items`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT cho bảng `favorites`
--
ALTER TABLE `favorites`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT cho bảng `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT cho bảng `product_colors`
--
ALTER TABLE `product_colors`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=69;

--
-- AUTO_INCREMENT cho bảng `product_images`
--
ALTER TABLE `product_images`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT cho bảng `product_sizes`
--
ALTER TABLE `product_sizes`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=248;

--
-- AUTO_INCREMENT cho bảng `product_videos`
--
ALTER TABLE `product_videos`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT cho bảng `vouchers`
--
ALTER TABLE `vouchers`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `cart`
--
ALTER TABLE `cart`
  ADD CONSTRAINT `cart_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Các ràng buộc cho bảng `cart_items`
--
ALTER TABLE `cart_items`
  ADD CONSTRAINT `cart_items_ibfk_1` FOREIGN KEY (`cart_id`) REFERENCES `cart` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `cart_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);

--
-- Các ràng buộc cho bảng `favorites`
--
ALTER TABLE `favorites`
  ADD CONSTRAINT `favorites_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `favorites_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);

--
-- Các ràng buộc cho bảng `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Các ràng buộc cho bảng `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);

--
-- Các ràng buộc cho bảng `product_colors`
--
ALTER TABLE `product_colors`
  ADD CONSTRAINT `product_colors_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `product_images`
--
ALTER TABLE `product_images`
  ADD CONSTRAINT `product_images_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `product_sizes`
--
ALTER TABLE `product_sizes`
  ADD CONSTRAINT `product_sizes_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `product_videos`
--
ALTER TABLE `product_videos`
  ADD CONSTRAINT `product_videos_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
