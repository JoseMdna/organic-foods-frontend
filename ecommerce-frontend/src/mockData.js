export const fetchOrganicProducts = async () => {
    try {
      // Get organic products with nutrition data
      const response = await fetch(
        "https://world.openfoodfacts.org/cgi/search.pl?search_terms=organic&search_simple=1&action=process&json=1&page_size=30"
      );
      
      const data = await response.json();
      
      // Map the data to our app's product structure
      const organicProducts = data.products
        .filter(product => 
          product.product_name && 
          product.image_url && 
          product.categories_tags && 
          product.nutriments
        )
        .map((product, index) => {
          // Determine category
          let category = 'vegetables';
          if (product.categories_tags.some(tag => tag.includes('fruit'))) {
            category = 'fruits';
          } else if (product.categories_tags.some(tag => tag.includes('dairy'))) {
            category = 'dairy';
          } else if (product.categories_tags.some(tag => tag.includes('grain') || tag.includes('cereal'))) {
            category = 'grains';
          }
          
          // Check dietary preferences
          const isVegan = product.ingredients_analysis_tags?.includes('en:vegan') || false;
          const isGlutenFree = product.allergens_tags?.length === 0 || product.allergens_tags?.every(tag => !tag.includes('gluten'));
          
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
            local: Math.random() > 0.5, // 50% chance of being local
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
  
  // Fallback products in case the API fails
  export const fallbackProducts = [
    {
      id: 1,
      name: "Organic Avocado",
      price: 2.99,
      description: "Fresh, locally sourced organic avocados. Rich in healthy fats and perfect for guacamole or toast.",
      image_url: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=500&auto=format",
      category: "fruits",
      organic: true,
      vegan: true,
      glutenFree: true,
      local: true,
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
      image_url: "https://images.unsplash.com/photo-1524179091875-bf99a9a6af57?w=500&auto=format",
      category: "vegetables",
      organic: true,
      vegan: true,
      glutenFree: true,
      local: true,
      nutrition: {
        calories: 33,
        protein: 2.9,
        carbs: 6.7,
        fat: 0.5,
        fiber: 1.3
      }
    },
    {
      id: 3,
      name: "Organic Greek Yogurt",
      price: 4.99,
      description: "Creamy, protein-rich organic Greek yogurt. Made from the milk of pasture-raised cows.",
      image_url: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500&auto=format",
      category: "dairy",
      organic: true,
      vegan: false,
      glutenFree: true,
      local: true,
      nutrition: {
        calories: 120,
        protein: 15,
        carbs: 9,
        fat: 5,
        fiber: 0
      }
    }
  ];

  export const getCuratedProducts = () => {
    return [
      {
        id: 1,
        name: "Organic Avocado",
        price: 2.99,
        description: "Fresh, locally sourced organic avocados. Rich in healthy fats and perfect for guacamole or toast.",
        image_url: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=500&auto=format",
        category: "fruits",
        organic: true,
        vegan: true,
        glutenFree: true,
        local: true,
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
        image_url: "https://images.unsplash.com/photo-1524179091875-bf99a9a6af57?w=500&auto=format",
        category: "vegetables",
        organic: true,
        vegan: true,
        glutenFree: true,
        local: true,
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
        image_url: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500&auto=format",
        category: "dairy",
        organic: true,
        vegan: false,
        glutenFree: true,
        local: true,
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
        image_url: "https://images.unsplash.com/photo-1586201375761-83865001e8d7?w=500&auto=format",
        category: "grains",
        organic: true,
        vegan: true,
        glutenFree: true,
        local: false,
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
        name: "Local Honey",
        price: 7.99,
        description: "Raw, unfiltered honey from local beekeepers. Perfect for teas, baking, or drizzled on breakfast.",
        image_url: "https://images.unsplash.com/photo-1587049332298-1c42e83937a7?w=500&auto=format",
        category: "other",
        organic: true,
        vegan: false,
        glutenFree: true,
        local: true,
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
        image_url: "https://images.unsplash.com/photo-1518635017498-87f514b751ba?w=500&auto=format",
        category: "fruits",
        organic: true,
        vegan: true,
        glutenFree: true,
        local: true,
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
        image_url: "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=500&auto=format",
        category: "grains",
        organic: true,
        vegan: true,
        glutenFree: true,
        local: false,
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
        image_url: "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=500&auto=format",
        category: "vegetables",
        organic: true,
        vegan: true,
        glutenFree: true,
        local: true,
        nutrition: {
          calories: 30,
          protein: 1,
          carbs: 7,
          fat: 0,
          fiber: 2
        },
        sourcing: "Grown in organic greenhouses by regional farmers."
      }
    ];
  };