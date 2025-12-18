import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load .env from parent directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const products = [
    // AC Treadmills - مشايات موتور AC
    {
        name: "مشايه لايف فيتنس 2 موتور وزن مفتوح",
        category: "AC",
        price: 55900,
        old_price: 60000,
        image: "/products/ac-1.png",
        description: "مشاية احترافية بموتور AC مزدوج للاستخدام المكثف في الجيمات والمراكز الرياضية. وزن المستخدم مفتوح.",
        features: ["موتور AC مزدوج", "وزن مفتوح", "شاشة LCD كبيرة", "برامج تدريب متنوعة"],
        is_new: true,
        rating: 5
    },
    {
        name: "مشايه كيرفى وزن مفتوح تكنو بدون موتور",
        category: "AC",
        price: 54900,
        old_price: 58000,
        image: "/products/ac-2.png",
        description: "مشاية كيرفى احترافية بتقنية بدون موتور للتمرين الطبيعي. مثالية للجيمات.",
        features: ["تقنية كيرفى", "بدون موتور", "وزن مفتوح", "تصميم احترافي"],
        is_new: true,
        rating: 5
    },
    {
        name: "مشايه وزن مفتوح ميجا فوكس 2 موتور",
        category: "AC",
        price: 45900,
        old_price: 50000,
        image: "/products/ac-3.png",
        description: "مشاية ميجا فوكس بموتورين AC للأداء العالي والاستخدام المستمر.",
        features: ["2 موتور AC", "وزن مفتوح", "سرعة عالية", "متانة فائقة"],
        is_new: false,
        rating: 5
    },
    {
        name: "مشايه جراند وزن 260 كيلو",
        category: "AC",
        price: 40000,
        old_price: 43000,
        image: "/products/ac-1.png",
        description: "مشاية جراند بقدرة تحمل 260 كيلو، مثالية للاستخدام التجاري.",
        features: ["وزن 260 كيلو", "موتور AC قوي", "سير عريض", "ضمان شامل"],
        is_new: false,
        rating: 5
    },
    {
        name: "مشايه 200ك 2موتور AC",
        category: "AC",
        price: 35000,
        old_price: 38000,
        image: "/products/ac-2.png",
        description: "مشاية بموتورين AC بقدرة تحمل 200 كيلو للاستخدام الاحترافي.",
        features: ["2 موتور AC", "وزن 200 كيلو", "انكلاين كهربائي", "برامج متعددة"],
        is_new: false,
        rating: 5
    },
    {
        name: "مشايه كماليات 200ك ماتور AC",
        category: "AC",
        price: 33000,
        old_price: 36000,
        image: "/products/ac-3.png",
        description: "مشاية AC بكماليات كاملة ووزن 200 كيلو.",
        features: ["موتور AC", "كماليات كاملة", "وزن 200 كيلو", "USB وبلوتوث"],
        is_new: false,
        rating: 5
    },
    {
        name: "مشايه 250ك 3 موتور",
        category: "AC",
        price: 38500,
        old_price: 42000,
        image: "/products/ac-1.png",
        description: "مشاية فاخرة بثلاث موتورات ووزن 250 كيلو للأداء الفائق.",
        features: ["3 موتور", "وزن 250 كيلو", "سرعة فائقة", "تصميم فاخر"],
        is_new: false,
        rating: 5
    },
    {
        name: "مشايه 180ك كماليات AC",
        category: "AC",
        price: 28500,
        old_price: 31000,
        image: "/products/ac-2.png",
        description: "مشاية AC بكماليات ووزن 180 كيلو.",
        features: ["موتور AC", "كماليات", "وزن 180 كيلو", "انكلاين"],
        is_new: false,
        rating: 5
    },
    {
        name: "مشايه 170ك كماليات AC",
        category: "AC",
        price: 26500,
        old_price: 29000,
        image: "/products/ac-3.png",
        description: "مشاية AC بكماليات ووزن 170 كيلو، مناسبة للمنزل والجيم.",
        features: ["موتور AC", "كماليات", "وزن 170 كيلو", "شاشة LCD"],
        is_new: false,
        rating: 5
    },
    {
        name: "مشايه 160ك كماليات",
        category: "AC",
        price: 24500,
        old_price: 27000,
        image: "/products/ac-1.png",
        description: "مشاية بكماليات ووزن 160 كيلو.",
        features: ["موتور AC", "كماليات", "وزن 160 كيلو", "برامج تدريب"],
        is_new: false,
        rating: 5
    },
    {
        name: "مشايه 140ك بدون كماليات AC",
        category: "AC",
        price: 20900,
        old_price: 23500,
        image: "/products/ac-2.png",
        description: "مشاية AC اقتصادية بوزن 140 كيلو.",
        features: ["موتور AC", "وزن 140 كيلو", "سعر اقتصادي", "جودة عالية"],
        is_new: false,
        rating: 5
    },
    {
        name: "مشايه 180ك 2موتور AC انكلاين",
        category: "AC",
        price: 30500,
        old_price: 33500,
        image: "/products/ac-3.png",
        description: "مشاية بموتورين AC مع انكلاين كهربائي ووزن 180 كيلو.",
        features: ["2 موتور AC", "انكلاين كهربائي", "وزن 180 كيلو", "شاشة تحكم"],
        is_new: false,
        rating: 5
    },
    {
        name: "مشايه 150ك كماليات AC",
        category: "AC",
        price: 22950,
        old_price: 25500,
        image: "/products/ac-1.png",
        description: "مشاية AC بكماليات ووزن 150 كيلو.",
        features: ["موتور AC", "كماليات", "وزن 150 كيلو", "USB"],
        is_new: false,
        rating: 5
    },
    {
        name: "مشايه 130ك AC كماليات",
        category: "AC",
        price: 18950,
        old_price: 21500,
        image: "/products/ac-2.png",
        description: "مشاية AC اقتصادية بكماليات ووزن 130 كيلو.",
        features: ["موتور AC", "كماليات", "وزن 130 كيلو", "سعر مميز"],
        is_new: false,
        rating: 5
    },
    {
        name: "مشايه ماركه جراند وزن 135ك كماليات DC",
        category: "DC",
        price: 12600,
        old_price: 14000,
        image: "/products/dc-1.png",
        description: "مشاية DC ماركة جراند بكماليات ووزن 135 كيلو، مثالية للاستخدام المنزلي.",
        features: ["موتور DC", "كماليات", "وزن 135 كيلو", "ماركة جراند"],
        is_new: true,
        rating: 5
    },
    {
        name: "مشايه ماركه جراند وزن 125ك كماليات DC",
        category: "DC",
        price: 12200,
        old_price: 13500,
        image: "/products/dc-2.png",
        description: "مشاية DC ماركة جراند بكماليات ووزن 125 كيلو.",
        features: ["موتور DC", "كماليات", "وزن 125 كيلو", "تصميم عصري"],
        is_new: false,
        rating: 5
    },
    {
        name: "مشايه 120ك جراند كماليات",
        category: "DC",
        price: 11800,
        old_price: 13000,
        image: "/products/dc-1.png",
        description: "مشاية جراند DC بكماليات ووزن 120 كيلو.",
        features: ["موتور DC", "كماليات", "وزن 120 كيلو", "شاشة LCD"],
        is_new: false,
        rating: 5
    },
    {
        name: "مشاية 115ك ماركه جراند",
        category: "DC",
        price: 11400,
        old_price: 12800,
        image: "/products/dc-2.png",
        description: "مشاية DC ماركة جراند بوزن 115 كيلو.",
        features: ["موتور DC", "وزن 115 كيلو", "ماركة جراند", "ضمان"],
        is_new: false,
        rating: 5
    },
    {
        name: "مشايه كهربائيه بالريموت وحامل موبايل وزن 105ك",
        category: "DC",
        price: 10900,
        old_price: 12500,
        image: "/products/dc-1.png",
        description: "مشاية DC بريموت كنترول وحامل موبايل، وزن 105 كيلو. مثالية للمنزل.",
        features: ["موتور DC", "ريموت كنترول", "حامل موبايل", "وزن 105 كيلو"],
        is_new: true,
        rating: 5
    }
];

async function migrate() {
    console.log('Starting migration...');

    const { error } = await supabase
        .from('products')
        .upsert(products, { onConflict: 'name' }); // Just simple upsert for now, assuming names are unique or not caring about dupes in local dev for a moment. But actually 'upsert' needs a constraint.
    // Since I don't have a unique constraint on 'name', upsert might just insert or fail.
    // Better to just insert.

    if (error) {
        console.error('Error inserting products:', error);
    } else {
        console.log('Successfully inserted products!');
    }
}

// Actually, let's use insert. If I run this multiple times, I'll get duplicates.
// I'll delete all first?
async function migrateClean() {
    console.log('Cleaning old products...');
    const { error: deleteError } = await supabase.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all
    if (deleteError) console.error('Error cleaning:', deleteError);

    console.log('Inserting products...');
    const { error } = await supabase.from('products').insert(products);
    if (error) {
        console.error('Error inserting:', error);
    } else {
        console.log('Migration complete! ' + products.length + ' products inserted.');
    }
}

migrateClean();
