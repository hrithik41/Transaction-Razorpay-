// backend/prisma/seed.ts
import prisma from "../src/lib/prisma";

async function main() {
    console.log('Seeding luxury watch products...');

    const products = [
        {
            product_id: 1,
            product_name: 'Vilix Casino Rose Gold',
            product_description: 'Forged in 18k Rose Gold with an authentic, fully functional miniature roulette complication.',
            display_price: 125000,
            discount_price: 110000,
            product_quantity: 1,
            product_stock: 50,
            product_image: '/products/product_2.png',
        },
        {
            product_id: 2,
            product_name: 'Vilix Obsidian Black',
            product_description: 'A masterpiece of Grade 5 Titanium with a matte black DLC coating and skeletonized dial.',
            display_price: 85000,
            discount_price: 79999,
            product_quantity: 1,
            product_stock: 120,
            product_image: '/products/product_3.png',
        },
        {
            product_id: 3,
            product_name: 'Vilix Sapphire Chrono',
            product_description: 'Featuring a transparent sapphire crystal case that reveals the intricate chronometric movement.',
            display_price: 150000,
            discount_price: 145000,
            product_quantity: 1,
            product_stock: 25,
            product_image: '/products/product_4.png',
        },
        {
            product_id: 4,
            product_name: 'Vilix Deep Diver',
            product_description: 'Water-resistant to 3000m. Equipped with extreme Super-LumiNova for absolute clarity in the abyss.',
            display_price: 45000,
            discount_price: 42000,
            product_quantity: 1,
            product_stock: 200,
            product_image: '/products/product_6.png',
        }
    ];

    for (const product of products) {
        await prisma.product.upsert({
            where: { product_id: product.product_id },
            update: product,
            create: product,
        });
    }

    console.log('Seeding test user...');
    await prisma.user.upsert({
        where: { email: 'test@gmail.com' },
        update: {},
        create: {
            email: 'test@gmail.com',
            name: 'Test User',
            password: '0000', 
            isVerified: true,
            updatedAt: new Date(),
        }
    });

    console.log('Database Seeding completed successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
