# Quản lý thư viện lớp học

Dự án có hai phần:

- **Phần A (`part-a`)**: JavaScript thuần. Sách mẫu được tải từ `books.json`. Có tìm kiếm, lọc, yêu thích, xóa, thêm sách và đổi sáng/tối.
- **Phần B (`part-b`)**: React. Có các chức năng tương tự, dùng dữ liệu mẫu trong `src/data/books.js`.

Cả hai phần có 12 sách mẫu và giao diện phù hợp máy tính lẫn điện thoại.

## Chạy Phần A

Mở `part-a/index.html` bằng **Live Server** trong VS Code. Nếu chưa cài, chạy:

```powershell
code --install-extension ritwickdey.LiveServer
```

Không mở file trực tiếp bằng `file://`, vì trình duyệt sẽ chặn tải `books.json`.

## Chạy Phần B

```powershell
cd "D:\Kho lưu trữ code và các bài tập các học phần\Thực hành lập trình web\thuchanh29thang10\part-b"
npm install
npm run dev
```

Mở địa chỉ localhost mà Vite hiển thị. Dùng `npm run build` để tạo bản build.

## Dữ liệu

Phần A dùng `books.json`. Vì chưa có API để ghi dữ liệu, sách thêm/xóa được lưu trong trình duyệt (`localStorage`). Phần B không gọi API; dữ liệu thay đổi chỉ được giữ đến khi tải lại trang.

## Khác nhau giữa hai phần

Phần A dùng JavaScript để tự tạo và cập nhật HTML. Phần B chia giao diện thành các component React và cập nhật khi state thay đổi.

## Phiên bản đã dùng

- Node.js: **22.14.0**
- npm: **9.9.4**
- Vite: **8.3.5**
- React: **19.3.1**
- TypeScript: **không sử dụng**
