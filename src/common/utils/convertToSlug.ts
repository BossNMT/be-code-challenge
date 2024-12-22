export const convertToSlug = (title: string) => {
  // Lấy timestamp hiện tại
  const timestamp = Date.now();

  // Xử lý slug
  const slug = title
    .toLowerCase() // Chuyển tất cả chữ sang chữ thường
    .trim() // Loại bỏ khoảng trắng ở đầu và cuối
    .replace(/[^a-z0-9]+/g, '-') // Thay thế khoảng trắng và ký tự đặc biệt bằng dấu '-'
    .replace(/^-+|-+$/g, ''); // Loại bỏ dấu '-' dư thừa ở đầu hoặc cuối

  // Gắn thêm timestamp vào cuối slug
  return `${slug}-${timestamp}`;
}