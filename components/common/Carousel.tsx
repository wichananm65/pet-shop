import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    type CarouselApi,
} from "@/components/ui/carousel"

const CarouselSpacing = () => {
    const count = 4
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
        <div>
            <Carousel className="w-full" opts={{ loop: true }} setApi={setApi}>
                <CarouselContent className="">
                    {Array.from({ length: count }).map((_, index) => (
                        <CarouselItem key={index} className="basis-1/2">
                            <div className="p-1">
                                <Card>
                                    <div className="flex justify-center items-center">
                                        <CardContent className="flex aspect-square items-center justify-center w-120 h-120">
                                            <span className="text-2xl font-semibold">{index + 1}</span>
                                        </CardContent>
                                    </div>

                                </Card>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>

            <div className="flex justify-center space-x-3 mt-4">
                {Array.from({ length: count }).map((_, i) => (
                    <button
                        key={i}
                        onClick={() => goTo(i)}
                        aria-label={`Go to slide ${i + 1}`}
                        className={`w-3 h-3 rounded-full transition-colors focus:outline-none ${selected === i ? 'bg-orange-600' : 'bg-gray-300 hover:bg-gray-400'}`}
                    />
                ))}
            </div>
        </div>
    )
}
export default CarouselSpacing