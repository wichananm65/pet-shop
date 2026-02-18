"use client"

import Section from "../common/Section/Section"
import CategoryCard from "../common/CategoryCard/CategoryCard"

const categories = [
    { filename: "Animal _food.png", name: "Animal food" },
    { filename: "pet_supplies.png", name: "Pet supplies" },
    { filename: "Clothes_and_accessories.png", name: "Clothes and accessories" },
    { filename: "Cleaning_equipment.png", name: "Cleaning equipment" },
    { filename: "sand_and_bathroom.png", name: "Sand and bathroom" },
    { filename: "Hygiene_care.png", name: "Hygiene care" },
    { filename: "Cat_snacks.png", name: "Cat snacks" },
    { filename: "Cat_exercise.png", name: "Cat exercise" },
]

function slugify(s: string) {
    return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
}

const CategorySection = () => {
    return (
        <Section name="Category" href="/categories" grid="grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4" seeMore={false}>
            {categories.map((c) => (
                <CategoryCard
                    key={c.name}
                    name={c.name}
                    imageSrc={`/Category/${encodeURIComponent(c.filename)}`}
                    href={`/shopping-mall/${slugify(c.name)}`}
                />
            ))}
        </Section>
    )
}
export default CategorySection