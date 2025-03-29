export const fetchOrganicProducts = async () => {
  try {
    const response = await fetch(
      "https://world.openfoodfacts.org/cgi/search.pl?search_terms=organic&search_simple=1&action=process&json=1&page_size=30"
    );
    
    const data = await response.json();
    
    const organicProducts = data.products
      .filter(product => 
        product.product_name && 
        product.image_url && 
        product.categories_tags && 
        product.nutriments
      )
      .map((product, index) => {
        let category = 'vegetables';
        if (product.categories_tags.some(tag => tag.includes('fruit'))) {
          category = 'fruits';
        } else if (product.categories_tags.some(tag => tag.includes('dairy'))) {
          category = 'dairy';
        } else if (product.categories_tags.some(tag => tag.includes('grain') || tag.includes('cereal'))) {
          category = 'grains';
        } else if (product.categories_tags.some(tag => tag.includes('meat'))) {
          category = 'meat';
        }
        
        const isVegan = product.ingredients_analysis_tags?.includes('en:vegan') || false;
        const isGlutenFree = product.allergens_tags?.length === 0 || product.allergens_tags?.every(tag => !tag.includes('gluten'));
        
        const suppliers = [
          {name: "Green Valley Farms", location: "Portland, Oregon", contact: "contact@greenvalleyfarms.com", phone: "(503) 555-7823"},
          {name: "Sunnyvale Organics", location: "Sacramento, California", contact: "info@sunnyvaleorganics.com", phone: "(916) 555-3049"},
          {name: "Meadow Brook Farm", location: "Burlington, Vermont", contact: "orders@meadowbrookfarm.com", phone: "(802) 555-6127"},
          {name: "Heritage Harvest", location: "Austin, Texas", contact: "sales@heritageharvesttx.com", phone: "(512) 555-8901"},
          {name: "Mountain Springs Cooperative", location: "Boulder, Colorado", contact: "info@mountainsprings.coop", phone: "(303) 555-4582"}
        ];
        
        const supplier = suppliers[Math.floor(Math.random() * suppliers.length)];
        
        return {
          id: index + 1,
          name: product.product_name,
          price: ((Math.random() * 6) + 1.99).toFixed(2),
          description: product.generic_name || `Organic ${product.product_name} sourced from sustainable farms`,
          image_url: product.image_url,
          category,
          organic: true,
          vegan: isVegan,
          glutenFree: isGlutenFree,
          local: Math.random() > 0.5,
          supplierName: supplier.name,
          supplierLocation: supplier.location,
          supplierContact: supplier.contact,
          supplierPhone: supplier.phone,
          nutrition: {
            calories: product.nutriments.energy_100g || 100,
            protein: product.nutriments.proteins_100g || 0,
            carbs: product.nutriments.carbohydrates_100g || 0,
            fat: product.nutriments.fat_100g || 0,
            fiber: product.nutriments.fiber_100g || 0
          },
          sourcing: `Our ${product.product_name} is sourced from organic farms committed to sustainable agriculture practices.`
        };
      });
      
    return organicProducts;
  } catch (error) {
    console.error("Error fetching organic products:", error);
    return [];
  }
};

export const getCuratedProducts = () => {
  return [
    {
      id: 1,
      name: "Organic Avocado",
      price: 2.99,
      description: "Fresh, locally sourced organic avocados. Rich in healthy fats and perfect for guacamole or toast.",
      image_url: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      category: "fruits",
      organic: true,
      vegan: true,
      glutenFree: true,
      local: true,
      supplierName: "Green Valley Farms",
      supplierLocation: "Portland, Oregon",
      supplierContact: "contact@greenvalleyfarms.com",
      supplierPhone: "(503) 555-7823",
      nutrition: {
        calories: 160,
        protein: 2,
        carbs: 9,
        fat: 15,
        fiber: 7
      },
      sourcing: "Grown by sustainable family farms within 100 miles of our distribution center."
    },
    {
      id: 2,
      name: "Organic Kale Bunch",
      price: 3.49,
      description: "Nutrient-dense organic kale. Perfect for salads, smoothies, or sautéed as a healthy side dish.",
      image_url: "https://images.unsplash.com/photo-1524179091875-bf99a9a6af57?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      category: "vegetables",
      organic: true,
      vegan: true,
      glutenFree: true,
      local: true,
      supplierName: "Sunnyvale Organics",
      supplierLocation: "Sacramento, California",
      supplierContact: "info@sunnyvaleorganics.com",
      supplierPhone: "(916) 555-3049",
      nutrition: {
        calories: 33,
        protein: 2.9,
        carbs: 6.7,
        fat: 0.5,
        fiber: 1.3
      },
      sourcing: "Harvested from our partner farms using regenerative agriculture practices."
    },
    {
      id: 3,
      name: "Organic Greek Yogurt",
      price: 4.99,
      description: "Creamy, protein-rich organic Greek yogurt. Made from the milk of pasture-raised cows.",
      image_url: "https://images.unsplash.com/photo-1488477181946-6428a0291777?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      category: "dairy",
      organic: true,
      vegan: false,
      glutenFree: true,
      local: true,
      supplierName: "Meadow Brook Farm",
      supplierLocation: "Burlington, Vermont",
      supplierContact: "orders@meadowbrookfarm.com",
      supplierPhone: "(802) 555-6127",
      nutrition: {
        calories: 120,
        protein: 15,
        carbs: 9,
        fat: 5,
        fiber: 0
      },
      sourcing: "Made with milk from family-owned dairy farms committed to ethical animal care."
    },
    {
      id: 4,
      name: "Organic Quinoa",
      price: 5.49,
      description: "Protein-packed ancient grain, perfect for salads, bowls, and sides.",
      image_url: "https://plus.unsplash.com/premium_photo-1705207702007-7c6a3872ef25?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8cXVpbm9hfGVufDB8fDB8fHww",
      category: "grains",
      organic: true,
      vegan: true,
      glutenFree: true,
      local: false,
      supplierName: "Heritage Harvest",
      supplierLocation: "Austin, Texas",
      supplierContact: "sales@heritageharvesttx.com",
      supplierPhone: "(512) 555-8901",
      nutrition: {
        calories: 120,
        protein: 4,
        carbs: 21,
        fat: 2,
        fiber: 3
      },
      sourcing: "Sourced from certified organic farmers using traditional cultivation methods."
    },
    {
      id: 5,
      name: "Organic Honey",
      price: 7.99,
      description: "Raw, unfiltered honey from local beekeepers. Perfect for teas, baking, or drizzled on breakfast.",
      image_url: "https://plus.unsplash.com/premium_photo-1663957861996-8093b48a22e6?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8aG9uZXl8ZW58MHx8MHx8fDA%3D",
      category: "other",
      organic: true,
      vegan: false,
      glutenFree: true,
      local: true,
      supplierName: "Mountain Springs Cooperative",
      supplierLocation: "Boulder, Colorado",
      supplierContact: "info@mountainsprings.coop",
      supplierPhone: "(303) 555-4582",
      nutrition: {
        calories: 64,
        protein: 0,
        carbs: 17,
        fat: 0,
        fiber: 0
      },
      sourcing: "Produced by local beekeepers supporting pollinator health in our community."
    },
    {
      id: 6,
      name: "Organic Strawberries",
      price: 4.99,
      description: "Sweet, juicy organic strawberries. Perfect for snacking, smoothies, or desserts.",
      image_url: "https://images.unsplash.com/photo-1518635017498-87f514b751ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      category: "fruits",
      organic: true,
      vegan: true,
      glutenFree: true,
      local: true,
      supplierName: "Green Valley Farms",
      supplierLocation: "Portland, Oregon",
      supplierContact: "contact@greenvalleyfarms.com",
      supplierPhone: "(503) 555-7823",
      nutrition: {
        calories: 50,
        protein: 1,
        carbs: 12,
        fat: 0,
        fiber: 3
      },
      sourcing: "Grown without synthetic pesticides on local family farms."
    },
    {
      id: 7,
      name: "Organic Brown Rice",
      price: 3.49,
      description: "Whole grain, nutrient-rich organic brown rice. A versatile staple for countless healthy meals.",
      image_url: "https://plus.unsplash.com/premium_photo-1671130295823-78f170465794?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      category: "grains",
      organic: true,
      vegan: true,
      glutenFree: true,
      local: false,
      supplierName: "Heritage Harvest",
      supplierLocation: "Austin, Texas",
      supplierContact: "sales@heritageharvesttx.com",
      supplierPhone: "(512) 555-8901",
      nutrition: {
        calories: 215,
        protein: 5,
        carbs: 45,
        fat: 2,
        fiber: 4
      },
      sourcing: "Sourced from sustainable farms committed to water conservation."
    },
    {
      id: 8,
      name: "Organic Bell Peppers",
      price: 3.99,
      description: "Crisp, colorful organic bell peppers. Great for salads, stir-fries, or roasting.",
      image_url: "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      category: "vegetables",
      organic: true,
      vegan: true,
      glutenFree: true,
      local: true,
      supplierName: "Sunnyvale Organics",
      supplierLocation: "Sacramento, California",
      supplierContact: "info@sunnyvaleorganics.com",
      supplierPhone: "(916) 555-3049",
      nutrition: {
        calories: 30,
        protein: 1,
        carbs: 7,
        fat: 0,
        fiber: 2
      },
      sourcing: "Grown in organic greenhouses by regional farmers."
    },
    {
      id: 9,
      name: "Grass-Fed Ground Beef",
      price: 7.99,
      description: "Ethically raised, grass-fed beef from local farms. High in omega-3 fatty acids.",
      image_url: "https://plus.unsplash.com/premium_photo-1668616817443-f64ce045ccc2?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fGdyb3VuZCUyMGJlZWZ8ZW58MHx8MHx8fDA%3D",
      category: "meat",
      organic: true,
      vegan: false,
      glutenFree: true,
      local: true,
      supplierName: "Meadow Brook Farm",
      supplierLocation: "Burlington, Vermont",
      supplierContact: "orders@meadowbrookfarm.com",
      supplierPhone: "(802) 555-6127",
      nutrition: {
        calories: 250,
        protein: 26,
        carbs: 0,
        fat: 15,
        fiber: 0
      },
      sourcing: "Raised on open pastures with no antibiotics or hormones. Our cattle graze on diverse grasses and live stress-free lives."
    },
    {
      id: 10,
      name: "Pasture-Raised Chicken",
      price: 6.49,
      description: "Free-range, organic chicken raised on pasture. Leaner and more flavorful than conventional poultry.",
      image_url: "https://images.unsplash.com/photo-1587593810167-a84920ea0781?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      category: "meat",
      organic: true,
      vegan: false,
      glutenFree: true,
      local: true,
      supplierName: "Heritage Harvest",
      supplierLocation: "Austin, Texas",
      supplierContact: "sales@heritageharvesttx.com",
      supplierPhone: "(512) 555-8901",
      nutrition: {
        calories: 165,
        protein: 31,
        carbs: 0,
        fat: 3.6,
        fiber: 0
      },
      sourcing: "Our chickens roam freely on pasture, foraging for insects and seeds. Supplemented with organic feed."
    },
    {
      id: 11,
      name: "Wild-Caught Salmon",
      price: 12.99,
      description: "Wild-caught salmon fillets rich in omega-3 fatty acids. Sustainably harvested.",
      image_url: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      category: "meat",
      organic: false,
      vegan: false,
      glutenFree: true,
      local: false,
      supplierName: "Northern Waters Seafood",
      supplierLocation: "Seattle, Washington",
      supplierContact: "orders@northernwatersseafood.com",
      supplierPhone: "(206) 555-7190",
      nutrition: {
        calories: 206,
        protein: 22,
        carbs: 0,
        fat: 13,
        fiber: 0
      },
      sourcing: "Responsibly harvested from pristine Alaskan waters during peak season for optimal flavor and nutrition."
    },
    {
      id: 12,
      name: "Organic Baby Spinach",
      price: 3.99,
      description: "Tender, nutrient-rich organic baby spinach leaves. Perfect for salads and smoothies.",
      image_url: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      category: "vegetables",
      organic: true,
      vegan: true,
      glutenFree: true,
      local: true,
      supplierName: "Green Valley Farms",
      supplierLocation: "Portland, Oregon",
      supplierContact: "contact@greenvalleyfarms.com",
      supplierPhone: "(503) 555-7823",
      nutrition: {
        calories: 23,
        protein: 2.9,
        carbs: 3.6,
        fat: 0.4,
        fiber: 2.2
      },
      sourcing: "Grown hydroponically using organic methods in our sustainable greenhouses."
    },
    {
      id: 13,
      name: "Organic Almond Milk",
      price: 4.49,
      description: "Creamy, dairy-free organic almond milk. No additives or preservatives.",
      image_url: "https://images.unsplash.com/photo-1626196340104-2d6769a08761?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YWxtb25kJTIwbWlsa3xlbnwwfHwwfHx8MA%3D%3D",
      category: "dairy",
      organic: true,
      vegan: true,
      glutenFree: true,
      local: false,
      supplierName: "Mountain Springs Cooperative",
      supplierLocation: "Boulder, Colorado",
      supplierContact: "info@mountainsprings.coop",
      supplierPhone: "(303) 555-4582",
      nutrition: {
        calories: 30,
        protein: 1,
        carbs: 1,
        fat: 2.5,
        fiber: 0.5
      },
      sourcing: "Made from organic almonds grown by family farmers in California using sustainable water practices."
    },
    {
      id: 14,
      name: "Pasture-Raised Pork Chops",
      price: 8.99,
      description: "Pasture-raised heritage breed pork chops. More flavorful and tender than conventional pork.",
      image_url: "https://images.unsplash.com/photo-1432139555190-58524dae6a55?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      category: "meat",
      organic: true,
      vegan: false,
      glutenFree: true,
      local: true,
      supplierName: "Heritage Harvest",
      supplierLocation: "Austin, Texas",
      supplierContact: "sales@heritageharvesttx.com",
      supplierPhone: "(512) 555-8901",
      nutrition: {
        calories: 206,
        protein: 24,
        carbs: 0,
        fat: 12,
        fiber: 0
      },
      sourcing: "Our heritage pigs are raised in wooded areas where they can forage naturally. No antibiotics or hormones ever."
    },
    {
      id: 15,
      name: "Organic Sweet Potatoes",
      price: 2.99,
      description: "Versatile, nutrient-rich organic sweet potatoes. Great for roasting, mashing, or fries.",
      image_url: "https://media.istockphoto.com/id/1448150088/photo/sweet-potatoes.webp?a=1&b=1&s=612x612&w=0&k=20&c=r9gJwIOZ5pI_nu1GahUt7XQJ8uiztolyk2NPGQpRLvY=",
      category: "vegetables",
      organic: true,
      vegan: true,
      glutenFree: true,
      local: true,
      supplierName: "Sunnyvale Organics",
      supplierLocation: "Sacramento, California",
      supplierContact: "info@sunnyvaleorganics.com",
      supplierPhone: "(916) 555-3049",
      nutrition: {
        calories: 90,
        protein: 2,
        carbs: 20,
        fat: 0.1,
        fiber: 3
      },
      sourcing: "Grown in nutrient-rich soil using crop rotation to naturally deter pests and enhance flavor."
    },
    {
      id: 16,
      name: "Organic Tomatoes",
      price: 4.99,
      description: "Colorful, flavorful organic heirloom tomatoes. A rainbow of varieties for salads and sauces.",
      image_url: "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      category: "vegetables",
      organic: true,
      vegan: true,
      glutenFree: true,
      local: true,
      supplierName: "Green Valley Farms",
      supplierLocation: "Portland, Oregon",
      supplierContact: "contact@greenvalleyfarms.com",
      supplierPhone: "(503) 555-7823",
      nutrition: {
        calories: 22,
        protein: 1.1,
        carbs: 4.8,
        fat: 0.2,
        fiber: 1.5
      },
      sourcing: "Our heirloom tomato seeds have been passed down for generations, preserving unique flavors and colors."
    },
    {
      id: 17,
      name: "Organic Blueberries",
      price: 5.99,
      description: "Sweet, antioxidant-rich organic blueberries. Perfect for snacking or baking.",
      image_url: "https://images.unsplash.com/photo-1498557850523-fd3d118b962e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      category: "fruits",
      organic: true,
      vegan: true,
      glutenFree: true,
      local: true,
      supplierName: "Meadow Brook Farm",
      supplierLocation: "Burlington, Vermont",
      supplierContact: "orders@meadowbrookfarm.com",
      supplierPhone: "(802) 555-6127",
      nutrition: {
        calories: 57,
        protein: 0.7,
        carbs: 14,
        fat: 0.3,
        fiber: 2.4
      },
      sourcing: "Hand-picked at peak ripeness from our dedicated organic blueberry fields."
    },
    {
      id: 18,
      name: "Organic Sourdough Bread",
      price: 5.49,
      description: "Artisanal organic sourdough bread made with traditional fermentation methods.",
      image_url: "https://plus.unsplash.com/premium_photo-1664640733898-d5c3f71f44e1?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8c291cmRvdWdofGVufDB8fDB8fHww",
      category: "grains",
      organic: true,
      vegan: true,
      glutenFree: false,
      local: true,
      supplierName: "Mountain Springs Cooperative",
      supplierLocation: "Boulder, Colorado",
      supplierContact: "info@mountainsprings.coop",
      supplierPhone: "(303) 555-4582",
      nutrition: {
        calories: 120,
        protein: 4,
        carbs: 20,
        fat: 0.5,
        fiber: 2
      },
      sourcing: "Baked daily using our 100-year-old sourdough starter and organic flour from local mills."
    },
    {
      id: 19,
      name: "Organic Eggs",
      price: 5.99,
      description: "Farm-fresh organic eggs from free-range, pasture-raised hens.",
      image_url: "https://images.unsplash.com/photo-1536816579748-4ecb3f03d72a?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZWdnc3xlbnwwfHwwfHx8MA%3D%3D",
      category: "dairy",
      organic: true,
      vegan: false,
      glutenFree: true,
      local: true,
      supplierName: "Heritage Harvest",
      supplierLocation: "Austin, Texas",
      supplierContact: "sales@heritageharvesttx.com",
      supplierPhone: "(512) 555-8901",
      nutrition: {
        calories: 70,
        protein: 6,
        carbs: 0.6,
        fat: 5,
        fiber: 0
      },
      sourcing: "Our hens roam freely on pasture during the day, eating insects, seeds, and organic feed supplements."
    },
    {
      id: 20,
      name: "Organic Black Beans",
      price: 2.49,
      description: "Protein-rich organic black beans. A versatile staple for countless healthy dishes.",
      image_url: "https://plus.unsplash.com/premium_photo-1675237625091-e40de414b510?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YmxhY2slMjBiZWFuc3xlbnwwfHwwfHx8MA%3D%3D",
      category: "grains",
      organic: true,
      vegan: true,
      glutenFree: true,
      local: false,
      supplierName: "Sunnyvale Organics",
      supplierLocation: "Sacramento, California",
      supplierContact: "info@sunnyvaleorganics.com",
      supplierPhone: "(916) 555-3049",
      nutrition: {
        calories: 227,
        protein: 15,
        carbs: 41,
        fat: 0.9,
        fiber: 15
      },
      sourcing: "Grown using crop rotation practices that naturally enrich the soil and prevent pests."
    }
  ];
};