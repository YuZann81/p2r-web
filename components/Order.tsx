import React, { useState } from "react";
import type { Product } from "@/lib/api/types/product";
import { PixelImage, PixelButton } from "./MerchandiseCard";

type OrderModalProps = {
  product: Product | null;
  onClose: () => void;
};

export default function OrderModal({ product, onClose }: OrderModalProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    jurusan: "",
    className: "",
    phone: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Data Order:", { product, ...formData });
    alert(`Order diproses untuk ${formData.fullName} (${product?.name ?? "Merchandise P2R"})`);
  };

  const productName = product?.name ?? "Official P2R Merchandise";
  const productDesc = product?.description ?? "Merchandise eksklusif edisi resmi Pixel To Reality. Pesan sekarang dan dukung karya pameran Cyber Arcade.";
  const priceDisplay =
    product?.price !== null && product?.price !== undefined
      ? `Price : Rp ${product.price.toLocaleString("id-ID")}`
      : "Price : Info via Admin";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 font-sans">
      <div className="relative w-full max-w-4xl bg-[#6712D1]/80 backdrop-blur-xl border border-white/20 rounded-[2rem] p-8 md:p-10 shadow-2xl">
        <button type="button" onClick={onClose} aria-label="Tutup modal pemesanan" className="absolute top-6 right-8 text-white hover:text-[#F4EA2A] font-bold text-xl font-mono cursor-pointer">
          X
        </button>

        <div className="flex flex-col md:flex-row gap-8 mb-10">
          <div className="w-full md:w-64 flex-shrink-0">
            <PixelImage imageUrl={product?.image_url} altText={`${productName} merchandise`} />
          </div>

          <div className="flex flex-col justify-center text-white">
            <h2 className="text-[#F4EA2A] text-3xl md:text-4xl font-bold mb-4 drop-shadow-md font-pixel">{productName}</h2>
            <p className="text-white/90 text-sm md:text-base leading-relaxed mb-6 font-medium">{productDesc}</p>
            <div>
              <span className="inline-block border border-white/50 text-white px-5 py-2 rounded-full text-sm font-semibold tracking-wide">{priceDisplay}</span>
            </div>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          {[
            { label: "Full Name", name: "fullName", type: "text", placeholder: "Enter your full name" },
            { label: "Jurusan", name: "jurusan", type: "text", placeholder: "Pilih jurusan anda" },
            { label: "Class", name: "className", type: "text", placeholder: "Enter your class" },
            { label: "Number Telp", name: "phone", type: "tel", placeholder: "Enter your number" },
          ].map((field) => (
            <div key={field.name} className="flex flex-col gap-2">
              <label className="text-white text-sm font-bold tracking-wide">{field.label}</label>
              <input
                type={field.type}
                name={field.name}
                value={formData[field.name as keyof typeof formData]}
                onChange={handleChange}
                placeholder={field.placeholder}
                required
                className="w-full bg-transparent border border-white/40 rounded-full px-5 py-3 text-sm text-white outline-none focus:border-white focus:bg-white/5 transition-all placeholder:text-white/50"
              />
            </div>
          ))}

          <div className="mt-4 md:col-span-1 max-w-[220px]">
            <PixelButton type="submit">Order</PixelButton>
          </div>
        </form>
      </div>
    </div>
  );
}
