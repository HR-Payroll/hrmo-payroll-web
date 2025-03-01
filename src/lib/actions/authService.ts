"use server";

const API_URL = "http://127.0.0.1:5000";

export const login = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const result = await fetch(new URL("/auth/login", API_URL), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  console.log(result);
};
