import { Button } from "@/components/ui/button";
import BlogPostCard from "./BlogPostCard";

export default function BlogGrid({ posts }) {
  return (
    <section className="py-16 bg-muted/30 dark:bg-gray-900 transition-colors duration-200">
      <div className="container-custom">
        <h2 className="text-2xl font-bold mb-8 text-foreground dark:text-white">Latest Articles</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <BlogPostCard key={post.id} post={post} index={index} />
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-12">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled className="dark:border-gray-700 dark:text-gray-300">
              Previous
            </Button>
            <Button variant="outline" size="sm" className="bg-primary text-white hover:bg-primary/90 dark:bg-blue-600 dark:hover:bg-blue-700">
              1
            </Button>
            <Button variant="outline" size="sm" className="dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">
              Next
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
