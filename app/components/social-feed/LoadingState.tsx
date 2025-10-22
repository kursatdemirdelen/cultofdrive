export default function LoadingState() {
  return (
    <section className="px-6 py-20 text-center text-white bg-black">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-white rounded-full border-t-transparent animate-spin" />
        <p>Loading posts...</p>
      </div>
    </section>
  );
}
