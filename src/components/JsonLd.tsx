type StructuredReviewData = {
  rating: number;
  maxRating: number;
};

type AuthorStructuredData = {
  name: string;
  url: string;
};

type StructuredArticleData = {
  title: string;
  updatedAt?: string;
  publishedAt?: string;
  images: string[]; // Best practice: provide 3 photos at aspect ratios of 1x1, 4x3, and 16x9
  authors: AuthorStructuredData[];
};

type Props = {
  entries: Array<
    | {
        type: "review";
        data: StructuredReviewData;
      }
    | {
        type: "article";
        data: StructuredArticleData;
      }
  >;
};

export default function JsonLd(props: Props) {
  // Potential Improvement: Add TypeScript types for structured data
  const entries: any[] = [];

  for (const entry of props.entries) {
    switch (entry.type) {
      case "article":
        entries.push({
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: entry.data.title,
          dateModified: entry.data.updatedAt,
          datePublished: entry.data.publishedAt,
          image: entry.data.images,
          author: entry.data.authors.map((a) => ({ ...a, "@type": "Person" })),
        });
        break;
      case "review":
        entries.push({
          "@context": "https://schema.org",
          "@type": "Review",
          reviewRating: {
            "@type": "Rating",
            ratingValue: entry.data.rating,
            bestRating: entry.data.maxRating,
          },
        });
        break;
      default:
        throw new Error("Structured Data not implemented yet for type");
    }
  }

  return (
    <>
      {entries.map((entry, idx) => (
        <script
          key={idx}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(entry) }}
        />
      ))}
    </>
  );
}
