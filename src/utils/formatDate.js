export const formatDate = (date) => {
  // Periksa apakah `date` adalah Unix timestamp (angka besar, misal 1726678800)
  const isUnixTimestamp =
    typeof date === "number" && date.toString().length === 10;
  // Jika Unix timestamp, ubah dari detik ke milidetik
  const d = new Date(isUnixTimestamp ? date * 1000 : date);
  // Format ke ISO string (YYYY-MM-DD)
  return d.toISOString().split("T")[0];
};