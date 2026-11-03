import { ArticleDetailSection } from '../../../features/articles/index.js';
import { Footer } from '../../../components/Footer/index.js';

export default function ArticleDetailPage() {
  return (
    <>
      <div className="bg-white min-h-screen">
        <ArticleDetailSection />
      </div>
      <Footer />
    </>
  );
}
