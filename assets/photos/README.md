# 📸 Thay ảnh thật vào đây

Hiện thư mục đang dùng **ảnh placeholder (.svg)**. Để dùng ảnh thật của Linh Nhi,
chỉ cần copy ảnh vào thư mục này với **đúng tên file dưới đây** (giữ nguyên tên,
ghi đè file cũ). Không cần sửa code.

| Tên file cần đặt | Dùng ở đâu | Ảnh bạn đã gửi |
|---|---|---|
| `portrait.svg` *(hoặc đổi đường dẫn sang .jpg)* | Màn reveal hologram (Cảnh 2) | Ảnh chân dung rõ mặt (ảnh bên cành berry hoặc ảnh áo măng-tô hoa anh đào) |
| `mem-concert.svg` | Gallery + mưa ảnh | Ảnh ở concert cầm lightstick |
| `mem-work.svg` | Gallery + mưa ảnh | Ảnh ở văn phòng KPR Bright Bell (Hàn Quốc) |
| `mem-snow.svg` | Gallery + mưa ảnh | Ảnh ở Ngọc Long Tuyết Sơn 4506m |
| `mem-sakura.svg` | Gallery + mưa ảnh | Ảnh đường hoa anh đào Hàn Quốc |
| `mem-berry.svg` | Gallery + mưa ảnh | Ảnh chân dung cành berry đỏ |

## Cách 1 — giữ nguyên tên (khuyên dùng)
Đổi tên ảnh thật của bạn thành ví dụ `portrait.jpg`, rồi mở
`assets/js/config.js` sửa đuôi `.svg` → `.jpg` ở dòng tương ứng.

## Cách 2 — đặt đường dẫn bất kỳ
Mở `assets/js/config.js`, sửa trực tiếp `anhChanDung` và mảng `danhSachAnh`
trỏ tới file ảnh của bạn (jpg/png/webp đều được).

> Mẹo: ảnh **dọc hoặc vuông**, mặt rõ nét sẽ đẹp nhất cho bố cục dọc 9:16.
