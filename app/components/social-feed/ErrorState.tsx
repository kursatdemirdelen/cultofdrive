interface ErrorStateProps {
  message: string;
}

export default function ErrorState({ message }: ErrorStateProps) {
  return (
    <section className="px-6 py-20 text-center text-white bg-black">
      <p className="text-red-400">{message}</p>
    </section>
  );
}
