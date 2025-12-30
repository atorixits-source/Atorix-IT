import { Button } from "@/components/ui/button";
 
export default function BlogCategories({ selectedCategory = 'all', onCategoryChange, categories = [] }) {
  // Default categories if none provided
  const defaultCategories = [
    { id: 'all', name: 'All Posts' },
    { id: 'implementation', name: 'Implementation' },
    { id: 'migration', name: 'Migration' },
    { id: 'support', name: 'Support' },
    { id: 's/4hana', name: 'S/4HANA' },
    
  ];

  // Build category list: always include 'All Posts', then add unique categories from backend
  const categoryList = [
    { id: 'all', name: 'All Posts' },
    ...categories
      .filter(cat => cat && cat.trim() !== '')
      .map(cat => ({
        id: cat.toLowerCase(),
        name: cat.charAt(0).toUpperCase() + cat.slice(1)
      }))
      .filter((cat, index, self) => 
        index === self.findIndex(c => c.id === cat.id)
      )
  ];

  // If no categories from backend, use defaults
  const displayCategories = categoryList.length > 1 ? categoryList : defaultCategories;

  const handleCategoryClick = (categoryId) => {
    onCategoryChange(categoryId);
  };

  return (
    <section className="border-b border-border/60 py-6">
      <div className="container-custom">
        <div className="flex flex-wrap items-center justify-center gap-4">
          {displayCategories.map((category) => (
            <Button
              key={category.id}
              variant="ghost"
              className={`rounded-full ${selectedCategory === category.id 
                ? 'bg-primary/10 text-primary' 
                : 'text-muted-foreground hover:text-primary'}`}
              onClick={() => handleCategoryClick(category.id)}
            >
              {category.name}
            </Button>
          ))}
        </div>
      </div>
    </section>
  );
}
 
 