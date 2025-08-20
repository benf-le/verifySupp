import Image from "next/image";
import {resourceLimits} from "node:worker_threads";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {Carousel} from "@/components/carousel";

export default async function Home() {

  const data = await fetch(process.env.BACKEND_URL + `/products`);
  const products = await data.json()

    // console.log(products)

  return (

      <div>
        <section className="rounded bg-neutral-100 py-8 sm:py-12">
            <div className="mx-auto grid grid-cols-1 items-center justify-items-center gap-8 px-8 sm:px-16 md:grid-cols-2">
                <div className="max-w-md space-y-4"  >
                    <h2 className='text-3xl font-bold tracking-tight md:text-4xl'>welcome</h2>
                    <p className="text-neutral-600">discover</p>

                    <Button
                        asChild
                        variant="default"
                        className="inline-flex items-center round-full px-6 py-3 bg-black text-white"
                    >
                        <Link href='/products'
                              className="inline-flex items-center round-full px-6 py-3">
                            Browse All Products
                        </Link>
                    </Button>
                </div>
                <Image
                    alt='welcome'
                    src={products[0].imageUrl}
                    className='rounded'
                    width={450}
                    height={450}
                />

                <section className='py-8'>
                    <Carousel products ={products}/>
                </section>
            </div>


        </section>
      </div>
  );
}
