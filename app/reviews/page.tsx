import Link from 'next/link';
import { getPublishedReviews } from '@/app/actions/business';

function Stars({ rating }: { rating: number }) {
  return <span className="text-gold">{'★'.repeat(rating)}{'☆'.repeat(5 - rating)}</span>;
}

export default async function ReviewsPage() {
  const reviews = await getPublishedReviews();

  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="font-serif text-3xl font-semibold text-ink">Reviews</h1>
      <p className="text-ink/70 mt-2">รีวิวจากลูกทริป Trip2Talk</p>

      {reviews.length === 0 ? (
        <div className="mt-10 space-y-4 text-ink/80">
          <p>Guests travel with us for the light, the pace, and the photos they take home.</p>
          <blockquote className="border-l-4 border-gold pl-4 italic">
            “Small group, beautiful locations, and พี่แสน knows exactly when to shoot.”
          </blockquote>
        </div>
      ) : (
        <ul className="mt-10 space-y-8">
          {reviews.map((r) => (
            <li key={r.id} className="border-b border-ink/10 pb-8">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <p className="font-semibold text-ink">{r.guest_name}</p>
                {r.rating != null && <Stars rating={r.rating} />}
              </div>
              <p className="text-sm text-ink/50 mt-1">{r.tour_code}</p>
              {r.review_text && (
                <blockquote className="mt-3 border-l-4 border-teal pl-4 italic text-ink/90">
                  {r.review_text}
                </blockquote>
              )}
            </li>
          ))}
        </ul>
      )}

      <p className="mt-12 text-sm text-ink/60">
        <Link href="/" className="underline hover:text-gold">
          ← Back home
        </Link>
      </p>
    </main>
  );
}
