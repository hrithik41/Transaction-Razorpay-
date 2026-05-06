import prisma from "../src/lib/prisma";

async function main() {
    console.log('Seeding products...');

    const products = [
        {
            product_id: 'prod_1',
            product_name: 'Premium Subscription',
            product_description: 'Unlimited access to all financial tools and analytics.',
            display_price: 1200,
            discount_price: 999,
            product_quantity: 1,
            product_stock: 500,
            product_image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=400',
        },
        {
            product_id: 'prod_2',
            product_name: 'Pro Trader Pack',
            product_description: 'Advanced charting and real-time market data.',
            display_price: 2500,
            discount_price: 1999,
            product_quantity: 1,
            product_stock: 200,
            product_image: 'https://images.unsplash.com/photo-1559526324-593bc073d938?auto=format&fit=crop&q=80&w=400',
        },
        {
            product_id: 'prod_3',
            product_name: 'Starter Wallet',
            product_description: 'Perfect for beginners starting their investment journey.',
            display_price: 500,
            discount_price: 450,
            product_quantity: 1,
            product_stock: 1000,
            product_image: 'https://images.unsplash.com/photo-1580519542036-c47de6196ba5?auto=format&fit=crop&q=80&w=400',
        },
        {
            product_id: 'prod_4',
            product_name: 'Tax Planner Plus',
            product_description: 'Automated tax reports and filing assistance.',
            display_price: 1500,
            discount_price: 1299,
            product_quantity: 1,
            product_stock: 300,
            product_image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=400',
        },
        {
            product_id: 'prod_5',
            product_name: 'Savings Maximizer',
            product_description: 'AI-driven insights to help you save more every month.',
            display_price: 800,
            discount_price: 699,
            product_quantity: 1,
            product_stock: 450,
            product_image: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&q=80&w=400',
        }
    ];

    for (const product of products) {
        await prisma.product.upsert({
            where: { product_id: product.product_id },
            update: product,
            create: product,
        });
    }

    console.log('Seeding completed successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
