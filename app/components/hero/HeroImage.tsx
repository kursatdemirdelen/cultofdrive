import Image from "next/image";

export default function HeroImage() {
  return (
    <section className="flex justify-center my-8">
      <div className="relative w-full max-w-[400px] aspect-[4/3]">
        <Image
          src="/images/bmw-e36.png"
          alt="BMW E36 - Classic 90s BMW driving machine"
          fill
          className="object-cover rounded-lg"
          priority
        />
      </div>
    </section>
  );
}
