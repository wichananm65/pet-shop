import * as React from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    type CarouselApi,
} from "@/components/ui/carousel"
import useBanner from "@/hooks/banner/useBanner"

const CarouselSpacing = () => {
    const { banners } = useBanner(10)

    const fallback = [
        "/banner/04a429f3667447618ad41d1ddc3941295098953b.jpg",
        "/banner/3a2c4a01b382255d010fdce9b9c5942f82297af9.jpg",
        "/banner/8b1361654080c673a9ff07dd0f7ea6d51422c8b1 (1).jpg",
    ]

    const images = banners && banners.length > 0 ? banners.map((b) => b.bannerImg ?? "") : fallback

    const [api, setApi] = React.useState<CarouselApi | null>(null)
    const [selected, setSelected] = React.useState(0)

    React.useEffect(() => {
        if (!api) return
        const onSelect = () => setSelected(api.selectedScrollSnap())
        onSelect()
        api.on("select", onSelect)
        api.on("reInit", onSelect)
        return () => {
            api.off("select", onSelect)
            api.off("reInit", onSelect)
        }
    }, [api])

    const goTo = (index: number) => {
        api?.scrollTo(index)
    }

    return (
        <div className="flex flex-col justify-center items-center">
            <Carousel className="w-full" opts={{ loop: true }} setApi={setApi}>
                <CarouselContent className="">
                    {images.map((src, index) => (
                        <CarouselItem key={index} className="basis-1/2">
                            <div className="p-1">
                                <Card className="border-0 shadow-none">
                                    <div className="flex justify-center items-center">
                                        <CardContent className="p-0 w-full">
                                            <Image
                                                src={src}
                                                alt={`Banner ${index + 1}`}
                                                width={800}
                                                height={384}
                                                className="w-full h-44 sm:h-56 md:h-96 object-cover rounded-md"
                                                priority={index === 0}
                                            />
                                        </CardContent>
                                    </div>

                                </Card>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>

            <div className="flex justify-center items-center space-x-3">
                {images.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => goTo(i)}
                        aria-label={`Go to slide ${i + 1}`}
                        aria-current={selected === i ? "true" : undefined}
                        className={`transition-all duration-200 ease-in-out focus:outline-none ${selected === i ? 'w-8 h-3 rounded-full bg-orange-600' : 'w-3 h-3 rounded-full bg-orange-100 hover:bg-gray-400'}`}
                    />
                ))}
            </div>
        </div>
    )
}
export default CarouselSpacing