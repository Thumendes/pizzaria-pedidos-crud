import { createApi } from "@/lib/trpc/api";
import Image from "next/image";

export default async function Home() {
  const api = await createApi();
  const data = await api.hello.query({ text: "world" });

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>{data.greeting}</h1>
    </main>
  );
}
