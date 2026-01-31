export default function HomePage() {
  return (
    <div
      className={
        "w-screen h-screen p-8 flex items-center justify-center bg-neutral-50 text-neutral-950 dark:bg-neutral-950 dark:text-neutral-50"
      }
    >
      <div>
        <h1 className={"text-5xl font-bold"}>GDGoC Yonsei</h1>
        <h2 className={"text-3xl font-semibold"}>Cloudflare Workers</h2>
      </div>
    </div>
  );
}
