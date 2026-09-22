"use client";

/* eslint-disable @next/next/no-img-element */
import { useMemo, useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { useProduct } from "@/features/products/hooks/useProduct";
import { productPaths } from "@/features/products/paths";
import type { Product } from "@/features/products/types/product.types";
import { formatWholePrice } from "@/features/products/utils/product.utils";
import { cn } from "@/lib/utils/cn";
import { ProductImages } from "./ProductImages";

export type ProductDetailsActionsContext = {
  product: Product;
  selectedOptions: Record<string, string>;
};

type ProductDetailsPageProps = {
  productId: string;
  actions?: (context: ProductDetailsActionsContext) => ReactNode;
};

const serif = "font-[family-name:var(--font-instrument-serif)]";

function formatCategory(value: string) {
  return value.replaceAll("-", " ");
}

function OptionChip({
  selected,
  children,
  onClick,
}: {
  selected: boolean;
  children: ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex min-h-12 min-w-0 flex-1 flex-col items-center justify-center rounded border border-solid px-3 py-3 text-[11px] font-semibold uppercase",
        selected
          ? "border-[#1a1a1a] bg-[#1a1a1a] text-white"
          : "border-[#ebe6de] bg-white text-[#1a1a1a]",
      )}
    >
      {children}
    </button>
  );
}

export function ProductDetailsPage({
  productId,
  actions,
}: ProductDetailsPageProps) {
  const productQuery = useProduct(productId);
  const product = productQuery.data;
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >({});
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVolume, setSelectedVolume] = useState("100 ml");
  const [giftWrapping, setGiftWrapping] = useState(true);
  const [quantity, setQuantity] = useState(1);

  const resolvedOptions = useMemo(() => {
    if (!product) {
      return selectedOptions;
    }

    return Object.fromEntries(
      product.options.map((option) => [
        option.id,
        selectedOptions[option.id] ?? option.values[0],
      ]),
    );
  }, [product, selectedOptions]);

  if (productQuery.isLoading) {
    return (
      <p className="px-4 py-10 text-sm text-[#605a54] sm:px-6 md:px-10 lg:px-20">
        Loading product...
      </p>
    );
  }

  if (!product) {
    return (
      <p className="px-4 py-10 text-sm text-[#605a54] sm:px-6 md:px-10 lg:px-20">
        Product not found.
      </p>
    );
  }

  const galleryImages =
    product.images.length > 0
      ? [0, 1, 2].map((index) => product.images[index % product.images.length])
      : [undefined, undefined, undefined];
  const activeImage = galleryImages[selectedImage] ?? galleryImages[0];

  return (
    <article className="flex w-full flex-col bg-[#faf8f5] text-[#1a1a1a]">
      <nav
        aria-label="Breadcrumb"
        className="flex flex-wrap items-center gap-2 px-4 py-4 sm:px-6 sm:py-6 md:px-10 lg:px-20"
      >
        <span className="flex items-center gap-2">
          <Link
            href={productPaths.list}
            className="text-[12px] font-normal whitespace-nowrap text-[#605a54]"
          >
            Home
          </Link>
          <img src="/icons/chevron-right.svg" alt="" width={10} height={10} />
        </span>
        <span className="flex items-center gap-2">
          <Link
            href={productPaths.list}
            className="text-[12px] font-normal whitespace-nowrap text-[#605a54]"
          >
            Shop
          </Link>
          <img src="/icons/chevron-right.svg" alt="" width={10} height={10} />
        </span>
        <span className="flex items-center gap-2">
          <span className="text-[12px] font-normal whitespace-nowrap text-[#605a54]">
            Fragrances
          </span>
          <img src="/icons/chevron-right.svg" alt="" width={10} height={10} />
        </span>
        <span className="text-[12px] font-semibold whitespace-nowrap text-[#1a1a1a]">
          {product.name}
        </span>
      </nav>

      <section className="grid w-full grid-cols-1 gap-8 px-4 pb-16 sm:px-6 md:px-10 lg:grid-cols-2 lg:gap-12 lg:px-20 lg:pb-20">
        <div className="flex min-w-0 flex-col gap-4">
          <div className="relative min-h-[480px] w-full overflow-hidden rounded bg-[#ebe6de]">
            {activeImage ? (
              <Image
                src={activeImage}
                alt={product.name}
                fill
                className="rounded object-cover"
                sizes="(min-width: 1024px) 40vw, 100vw"
                priority
              />
            ) : null}
          </div>
          <div className="flex w-full gap-4">
            {galleryImages.map((image, index) => (
              <button
                key={`${image ?? "placeholder"}-${index}`}
                type="button"
                aria-label={`View image ${index + 1}`}
                aria-pressed={selectedImage === index}
                onClick={() => setSelectedImage(index)}
                className={cn(
                  "relative min-h-[96px] min-w-0 flex-1 overflow-hidden rounded bg-[#ebe6de]",
                  selectedImage === index
                    ? "ring-1 ring-[#c5a880]"
                    : "ring-1 ring-transparent",
                )}
              >
                {image ? (
                  <Image
                    src={image}
                    alt=""
                    fill
                    className="rounded object-cover"
                    sizes="120px"
                  />
                ) : null}
              </button>
            ))}
          </div>
        </div>

        <div className="flex min-w-0 flex-col gap-6">
          <div className="flex w-full items-start justify-between gap-4">
            <div className="flex min-w-0 flex-col">
              <p className="text-[11px] font-normal uppercase text-[#c5a880]">
                {formatCategory(product.category)}
              </p>
              <h1
                className={`${serif} mt-1 text-[32px] leading-tight text-[#1a1a1a] sm:text-[40px]`}
              >
                {product.name}
              </h1>
              <p className={`${serif} mt-2 text-[24px] text-[#1a1a1a]`}>
                {formatWholePrice(product.price)}
              </p>
            </div>
            <button
              type="button"
              className="flex shrink-0 items-center gap-2 pt-1 text-[11px] font-semibold uppercase whitespace-nowrap text-[#c5a880]"
            >
              <img src="/icons/heart.svg" alt="" width={14} height={14} />
              Add to wishlist
            </button>
          </div>

          {product.options.map((option) => (
            <div key={option.id} className="flex flex-col gap-3">
              <p className="text-[12px] font-bold uppercase text-[#1a1a1a]">
                {option.name}
              </p>
              <div className="flex gap-2">
                {option.values.map((value) => (
                  <OptionChip
                    key={value}
                    selected={
                      (selectedOptions[option.id] ?? option.values[0]) ===
                      value
                    }
                    onClick={() =>
                      setSelectedOptions((current) => ({
                        ...current,
                        [option.id]: value,
                      }))
                    }
                  >
                    {value}
                  </OptionChip>
                ))}
              </div>
            </div>
          ))}

          <div className="flex flex-col gap-3">
            <p className="text-[12px] font-bold uppercase text-[#1a1a1a]">
              Select volume
            </p>
            <div className="flex gap-2">
              <OptionChip
                selected={selectedVolume === "50 ml"}
                onClick={() => setSelectedVolume("50 ml")}
              >
                50 ml
              </OptionChip>
              <OptionChip
                selected={selectedVolume === "100 ml"}
                onClick={() => setSelectedVolume("100 ml")}
              >
                100 ml
              </OptionChip>
            </div>
          </div>

          <div className="flex w-full items-center justify-between gap-4 border-y border-solid border-[#ebe6de] py-5">
            <div className="flex min-w-0 flex-col gap-1">
              <p className="text-[14px] font-medium text-[#1a1a1a]">
                Complimentary signature gift wrapping
              </p>
              <p className="text-[12px] font-normal text-[#605a54]">
                Encased in linen paper box with custom wax seal stamp.
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={giftWrapping}
              aria-label="Gift wrapping"
              onClick={() => setGiftWrapping((current) => !current)}
              className={cn(
                "relative h-6 w-11 shrink-0 rounded-full transition-colors",
                giftWrapping ? "bg-[#c5a880]" : "bg-[#ebe6de]",
              )}
            >
              <span
                className={cn(
                  "absolute top-0.5 size-5 rounded-full bg-white transition-[left]",
                  giftWrapping ? "left-[22px]" : "left-0.5",
                )}
              />
            </button>
          </div>

          <div className="flex w-full items-center gap-4">
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="Decrease quantity"
                className="rounded border border-solid border-[#ebe6de] bg-white p-3"
                onClick={() =>
                  setQuantity((current) => Math.max(1, current - 1))
                }
              >
                <img src="/icons/minus.svg" alt="" width={14} height={14} />
              </button>
              <span className="min-w-8 text-center text-[13px] font-semibold text-[#1a1a1a]">
                {quantity}
              </span>
              <button
                type="button"
                aria-label="Increase quantity"
                className="rounded border border-solid border-[#ebe6de] bg-white p-3"
                onClick={() => setQuantity((current) => current + 1)}
              >
                <img src="/icons/plus.svg" alt="" width={14} height={14} />
              </button>
            </div>
            <div className="flex min-w-0 flex-1 [&_button]:h-12 [&_button]:w-full [&_button]:rounded [&_button]:bg-[#1a1a1a] [&_button]:text-[11px] [&_button]:font-semibold [&_button]:uppercase [&_button]:text-white [&_button]:hover:bg-[#1a1a1a]">
              {actions?.({ product, selectedOptions: resolvedOptions })}
            </div>
          </div>

          <section className="flex flex-col gap-4 pt-4">
            <h2 className={`${serif} text-[28px] text-[#1a1a1a] sm:text-[32px]`}>
              Scent Anatomy
            </h2>
            <p className="text-[14px] leading-relaxed font-normal text-[#605a54]">
              {product.description}
            </p>
            <div className="flex flex-col">
              <div className="flex items-center justify-between gap-4 border-b border-solid border-[#ebe6de] py-3">
                <p className="text-[11px] font-semibold uppercase text-[#c5a880]">
                  Top notes
                </p>
                <p className="text-right text-[13px] font-normal text-[#1a1a1a]">
                  {product.topNotes ?? product.notes}
                </p>
              </div>
              <div className="flex items-center justify-between gap-4 border-b border-solid border-[#ebe6de] py-3">
                <p className="text-[11px] font-semibold uppercase text-[#c5a880]">
                  Heart notes
                </p>
                <p className="text-right text-[13px] font-normal text-[#1a1a1a]">
                  {product.heartNotes ?? product.notes}
                </p>
              </div>
              <div className="flex items-center justify-between gap-4 py-3">
                <p className="text-[11px] font-semibold uppercase text-[#c5a880]">
                  Base notes
                </p>
                <p className="text-right text-[13px] font-normal text-[#1a1a1a]">
                  {product.baseNotes ?? product.notes}
                </p>
              </div>
            </div>
          </section>
        </div>
      </section>

      <section className="flex w-full flex-col items-center gap-8 px-4 py-10 sm:px-6 md:px-10 lg:px-20 lg:pb-[100px]">
        <div className="flex flex-col items-center gap-2">
          <h2
            className={`${serif} text-center text-[32px] text-[#1a1a1a] sm:text-[40px]`}
          >
            Olfactory Companions
          </h2>
          <p className="text-center text-[12px] font-normal uppercase text-[#605a54]">
            Fragrances of synonymous sophistication
          </p>
        </div>
        <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => (
            <article
              key={index}
              className="flex flex-col gap-4 rounded-lg bg-white p-4"
            >
              <ProductImages product={product}/>
             
            
              <div className="flex items-start justify-between gap-3">
                <h3
                  className={`${serif} text-[20px] text-[#1a1a1a] sm:text-[22px]`}
                >
                  {product.name}
                </h3>
                <p className="shrink-0 text-[15px] font-semibold text-[#1a1a1a]">
                  {product.price}
                </p>
              </div>
              <button
                type="button"
                className="flex w-full items-center justify-center rounded border border-solid border-[#ebe6de] py-3 text-[11px] font-semibold uppercase whitespace-nowrap text-[#1a1a1a]"
              >
                Add to cart
              </button>
            </article>
          ))}
        </div>
      </section>
    </article>
  );
}
