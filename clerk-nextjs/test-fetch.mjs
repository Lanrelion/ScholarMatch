async function main() {
  console.log("Fetching API...");
  try {
    const res = await fetch("http://127.0.0.1:3000/api/scholarships?mockUserId=test_user_ng");
    console.log("Status:", res.status);
    const json = await res.json();
    console.log(JSON.stringify(json, null, 2));
  } catch (e) {
    console.error("Error:", e.message);
  }
}
main();
