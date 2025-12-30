import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function FeaturedPost({ post }) {
  return (
    <section className="py-16">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center"
        >
          <div className="order-2 lg:order-1">
            <div className="inline-flex items-center rounded-full bg-blue-100 dark:bg-blue-900/20 px-3 py-1 text-xs font-medium text-blue-800 dark:text-blue-300 mb-4">
              {post.category}
            </div>
            <h2 className="text-3xl font-bold mb-4">
              <Link href={`/blog/${post.id}`} className="hover:text-primary transition-colors">
                {post.title}
              </Link>
            </h2>
            <p className="text-muted-foreground mb-6">
              {post.description}
            </p>
            <div className="flex items-center gap-4 mb-6">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                {post.author.charAt(0)}
              </div>
              <div>
                <p className="font-medium">{post.author}</p>
                <p className="text-sm text-muted-foreground">{post.date} · {post.readTime}</p>
              </div>
            </div>
            <Button asChild className="gap-2">
              <Link href={`/blog/${post.id}`}>
                Read Article
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="order-1 lg:order-2">
            <motion.div
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="aspect-[16/9] relative rounded-xl overflow-hidden border border-border/40 shadow-md"
            >
              <Image
                src={post.image || "/images/bg/services-bg.webp"}
                alt={post.title}
                fill
                className="object-cover transition-transform duration-500"
                unoptimized={post.image?.startsWith('http') || post.image?.startsWith('data:')}
                onError={(e) => {
                  e.target.src = "/images/bg/services-bg.webp";
                }}
              />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
