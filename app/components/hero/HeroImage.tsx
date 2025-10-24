import Image from "next/image";

export default function HeroImage() {
  return (
    <section className="mb-6 overflow-hidden rounded-lg">
      <Image
        src="/public/images/bmw-e36.png"
        alt="BMW E36 - Classic 90s BMW driving machine"
        width={1200}
        height={600}
        className="object-cover w-full transition-opacity duration-300 rounded-lg"
        priority
      />
    </section>
  );
}
