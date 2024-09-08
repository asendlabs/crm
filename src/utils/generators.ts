export function generateEmailVerifyCode() {
  const length: number = 5;
  const characters = "0123456789";
  let code: string = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters[randomIndex];
  }

  return code;
}
